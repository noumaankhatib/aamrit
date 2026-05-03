/**
 * Shopify Admin API client for order management.
 * Uses centralized configuration from env.ts.
 */

import { env, isAdminApiConfigured, getAdminApiUrl } from "@/lib/env";

const ADMIN_API_URL = getAdminApiUrl();

/** In-memory token cache (Dev Dashboard client_credentials; ~24h TTL) */
let oauthTokenCache: { token: string; expiresAtMs: number } | null = null;

async function getShopifyAdminAccessToken(): Promise<string> {
  const { adminClientSecret, adminClientId, adminAccessToken, storeDomain } = env.shopify;
  const shopHost = storeDomain.replace(/^https?:\/\//, "").split("/")[0] ?? "";

  if (adminClientSecret && adminClientId) {
    const now = Date.now();
    if (oauthTokenCache && now < oauthTokenCache.expiresAtMs - 60_000) {
      return oauthTokenCache.token;
    }

    const res = await fetch(`https://${shopHost}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: adminClientId,
        client_secret: adminClientSecret,
      }),
      cache: "no-store",
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Admin OAuth token failed (${res.status}): ${text.slice(0, 300)}`);
    }

    const json = JSON.parse(text) as { access_token?: string; expires_in?: number };
    if (!json.access_token) {
      throw new Error("Admin OAuth: no access_token in response");
    }

    const expiresInSec = json.expires_in ?? 86400;
    oauthTokenCache = {
      token: json.access_token,
      expiresAtMs: now + expiresInSec * 1000,
    };
    return json.access_token;
  }

  if (adminAccessToken) {
    return adminAccessToken;
  }

  throw new Error("Missing Admin API credentials");
}

// Order types
export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  name: string;
  createdAt: string;
  displayFinancialStatus: string;
  displayFulfillmentStatus: string;
  totalPriceSet: {
    shopMoney: { amount: string; currencyCode: string };
  };
  subtotalPriceSet: {
    shopMoney: { amount: string; currencyCode: string };
  };
  totalShippingPriceSet: {
    shopMoney: { amount: string; currencyCode: string };
  };
  totalTaxSet: {
    shopMoney: { amount: string; currencyCode: string };
  };
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    ordersCount: string;
  } | null;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string | null;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone: string | null;
  } | null;
  billingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string | null;
    city: string;
    province: string;
    country: string;
    zip: string;
  } | null;
  lineItems: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        variantTitle: string | null;
        sku: string | null;
        quantity: number;
        originalUnitPriceSet: {
          shopMoney: { amount: string; currencyCode: string };
        };
        discountedUnitPriceSet: {
          shopMoney: { amount: string; currencyCode: string };
        };
        image: { url: string; altText: string | null } | null;
      };
    }>;
  };
  fulfillments: Array<{
    id: string;
    status: string;
    trackingInfo: Array<{
      company: string | null;
      number: string | null;
      url: string | null;
    }>;
    createdAt: string;
  }>;
  transactions: Array<{
    id: string;
    kind: string;
    status: string;
    gateway: string;
    amountSet: {
      shopMoney: { amount: string; currencyCode: string };
    };
    createdAt: string;
  }>;
  note: string | null;
  tags: string[];
  test: boolean;
  cancelledAt: string | null;
  cancelReason: string | null;
}

export interface OrderListItem {
  id: string;
  orderNumber: number;
  name: string;
  createdAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  total: string;
  currency: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  isTest: boolean;
}

interface AdminAPIResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface AdminFetchOptions {
  timeout?: number;
  retries?: number;
}

async function adminFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: AdminFetchOptions = {}
): Promise<T> {
  const { timeout = 15000, retries = 1 } = options;
  
  if (!isAdminApiConfigured()) {
    throw new Error(
      "Shopify Admin API not configured. Set SHOPIFY_STORE_DOMAIN and either SHOPIFY_ADMIN_ACCESS_TOKEN (legacy custom app), or SHOPIFY_ADMIN_CLIENT_SECRET + SHOPIFY_ADMIN_CLIENT_ID (or SHOPIFY_CLIENT_ID) for Dev Dashboard apps."
    );
  }

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const accessToken = await getShopifyAdminAccessToken();
      const response = await fetch(ADMIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({ query, variables }),
        cache: "no-store",
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `Shopify Admin API error: ${response.status} ${response.statusText}${errorText ? ` - ${errorText.slice(0, 200)}` : ""}`
        );
      }

      const json: AdminAPIResponse<T> = await response.json();

      if (json.errors?.length) {
        console.error("[adminFetch] GraphQL errors:", json.errors);
        throw new Error(json.errors[0].message);
      }

      if (!json.data) {
        throw new Error("No data returned from Shopify Admin API");
      }

      return json.data;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (error instanceof Error && error.name === "AbortError") {
        lastError = new Error(`Admin API request timed out after ${timeout}ms`);
      }
      
      const isRetryable =
        lastError.message.includes("timed out") ||
        lastError.message.includes("503") ||
        lastError.message.includes("502") ||
        lastError.message.includes("429");
      
      if (attempt < retries && isRetryable) {
        const delay = 1000 * Math.pow(2, attempt);
        console.warn(`[adminFetch] Retry ${attempt + 1}/${retries} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      
      throw lastError;
    }
  }
  
  throw lastError ?? new Error("Admin API fetch failed");
}

const ORDER_FRAGMENT = `
  fragment OrderFields on Order {
    id
    name
    createdAt
    displayFinancialStatus
    displayFulfillmentStatus
    totalPriceSet {
      shopMoney { amount currencyCode }
    }
    subtotalPriceSet {
      shopMoney { amount currencyCode }
    }
    totalShippingPriceSet {
      shopMoney { amount currencyCode }
    }
    totalTaxSet {
      shopMoney { amount currencyCode }
    }
    customer {
      id
      firstName
      lastName
      email
      phone
      ordersCount
    }
    shippingAddress {
      firstName
      lastName
      address1
      address2
      city
      province
      country
      zip
      phone
    }
    billingAddress {
      firstName
      lastName
      address1
      address2
      city
      province
      country
      zip
    }
    lineItems(first: 50) {
      edges {
        node {
          id
          title
          variantTitle
          sku
          quantity
          originalUnitPriceSet {
            shopMoney { amount currencyCode }
          }
          discountedUnitPriceSet {
            shopMoney { amount currencyCode }
          }
          image {
            url
            altText
          }
        }
      }
    }
    fulfillments {
      id
      status
      trackingInfo {
        company
        number
        url
      }
      createdAt
    }
    transactions(first: 10) {
      id
      kind
      status
      gateway
      amountSet {
        shopMoney { amount currencyCode }
      }
      createdAt
    }
    note
    tags
    test
    cancelledAt
    cancelReason
  }
`;

function extractOrderNumber(name: string): number {
  const match = name.match(/#(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export async function getOrders(options: {
  first?: number;
  status?: "open" | "closed" | "cancelled" | "any";
  financialStatus?: string;
  fulfillmentStatus?: string;
  query?: string;
} = {}): Promise<OrderListItem[]> {
  const { first = 50, status = "any", query: searchQuery } = options;

  let queryFilter = "";
  if (status !== "any") {
    queryFilter = `status:${status}`;
  }
  if (searchQuery) {
    queryFilter = searchQuery;
  }

  const query = `
    query GetOrders($first: Int!, $query: String) {
      orders(first: $first, sortKey: CREATED_AT, reverse: true, query: $query) {
        edges {
          node {
            id
            name
            createdAt
            displayFinancialStatus
            displayFulfillmentStatus
            totalPriceSet {
              shopMoney { amount currencyCode }
            }
            customer {
              firstName
              lastName
              email
            }
            lineItems(first: 1) {
              edges {
                node { quantity }
              }
            }
            test
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  try {
    const data = await adminFetch<any>(query, { first, query: queryFilter || null });

    return data.orders.edges.map((edge: any) => {
      const order = edge.node;
      const customer = order.customer;
      const itemCount = order.lineItems.edges.reduce(
        (sum: number, e: any) => sum + e.node.quantity,
        0
      );

      return {
        id: order.id,
        orderNumber: extractOrderNumber(order.name),
        name: order.name,
        createdAt: order.createdAt,
        financialStatus: order.displayFinancialStatus,
        fulfillmentStatus: order.displayFulfillmentStatus,
        total: order.totalPriceSet.shopMoney.amount,
        currency: order.totalPriceSet.shopMoney.currencyCode,
        customerName: customer
          ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Guest"
          : "Guest",
        customerEmail: customer?.email || "",
        itemCount,
        isTest: order.test,
      };
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function getOrder(orderId: string): Promise<ShopifyOrder | null> {
  const query = `
    query GetOrder($id: ID!) {
      order(id: $id) {
        ...OrderFields
      }
    }
    ${ORDER_FRAGMENT}
  `;

  try {
    const data = await adminFetch<{ order: any }>(query, { id: orderId });

    if (!data.order) return null;

    return {
      ...data.order,
      orderNumber: extractOrderNumber(data.order.name),
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export async function getOrderByNumber(orderNumber: number): Promise<ShopifyOrder | null> {
  const query = `
    query GetOrderByName($query: String!) {
      orders(first: 1, query: $query) {
        edges {
          node {
            ...OrderFields
          }
        }
      }
    }
    ${ORDER_FRAGMENT}
  `;

  try {
    const data = await adminFetch<any>(query, { query: `name:#${orderNumber}` });

    const order = data.orders.edges[0]?.node;
    if (!order) return null;

    return {
      ...order,
      orderNumber: extractOrderNumber(order.name),
    };
  } catch (error) {
    console.error("Error fetching order by number:", error);
    return null;
  }
}

export async function fulfillOrder(
  orderId: string,
  trackingCompany?: string,
  trackingNumber?: string,
  trackingUrl?: string
): Promise<{ success: boolean; error?: string }> {
  const getFulfillmentOrderQuery = `
    query GetFulfillmentOrders($orderId: ID!) {
      order(id: $orderId) {
        id
        fulfillmentOrders(first: 10) {
          edges {
            node {
              id
              status
              lineItems(first: 50) {
                edges {
                  node {
                    id
                    remainingQuantity
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const orderData = await adminFetch<{
      order: {
        fulfillmentOrders: {
          edges: {
            node: {
              id: string;
              status: string;
              lineItems: {
                edges: {
                  node: {
                    id: string;
                    remainingQuantity: number;
                  };
                }[];
              };
            };
          }[];
        };
      };
    }>(getFulfillmentOrderQuery, { orderId });

    const fulfillmentOrders = orderData.order?.fulfillmentOrders?.edges || [];
    
    const openFulfillmentOrder = fulfillmentOrders.find(
      (fo) => fo.node.status === "OPEN" || fo.node.status === "IN_PROGRESS"
    );

    if (!openFulfillmentOrder) {
      return { success: false, error: "No open fulfillment orders found. Order may already be fulfilled." };
    }

    const lineItemsToFulfill = openFulfillmentOrder.node.lineItems.edges
      .filter((li) => li.node.remainingQuantity > 0)
      .map((li) => ({
        id: li.node.id,
        quantity: li.node.remainingQuantity,
      }));

    if (lineItemsToFulfill.length === 0) {
      return { success: false, error: "No items remaining to fulfill." };
    }

    const fulfillmentCreateQuery = `
      mutation FulfillmentCreateV2($fulfillment: FulfillmentV2Input!) {
        fulfillmentCreateV2(fulfillment: $fulfillment) {
          fulfillment {
            id
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const trackingInfo = trackingNumber
      ? { company: trackingCompany || null, number: trackingNumber, url: trackingUrl || null }
      : null;

    const fulfillmentInput: Record<string, unknown> = {
      lineItemsByFulfillmentOrder: [
        {
          fulfillmentOrderId: openFulfillmentOrder.node.id,
          fulfillmentOrderLineItems: lineItemsToFulfill,
        },
      ],
      notifyCustomer: true,
    };

    if (trackingInfo) {
      fulfillmentInput.trackingInfo = trackingInfo;
    }

    const data = await adminFetch<{
      fulfillmentCreateV2: {
        fulfillment: { id: string; status: string } | null;
        userErrors: { field: string[]; message: string }[];
      };
    }>(fulfillmentCreateQuery, { fulfillment: fulfillmentInput });

    if (data.fulfillmentCreateV2?.userErrors?.length) {
      const error = data.fulfillmentCreateV2.userErrors[0];
      console.error("Fulfillment errors:", error);
      return { success: false, error: error.message };
    }

    if (!data.fulfillmentCreateV2?.fulfillment) {
      return { success: false, error: "Failed to create fulfillment" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error fulfilling order:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fulfill order" 
    };
  }
}

export async function cancelOrder(orderId: string, reason?: string): Promise<boolean> {
  const query = `
    mutation CancelOrder($input: OrderCancelInput!) {
      orderCancel(input: $input) {
        job {
          id
        }
        orderCancelUserErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await adminFetch<any>(query, {
      input: {
        orderId,
        reason: reason || "OTHER",
        notifyCustomer: true,
        refund: true,
      },
    });

    if (data.orderCancel?.orderCancelUserErrors?.length) {
      console.error("Cancel errors:", data.orderCancel.orderCancelUserErrors);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error cancelling order:", error);
    return false;
  }
}

export async function updateFulfillmentTracking(
  fulfillmentId: string,
  trackingCompany?: string,
  trackingNumber?: string,
  trackingUrl?: string,
  notifyCustomer: boolean = true
): Promise<{ success: boolean; error?: string }> {
  const query = `
    mutation FulfillmentTrackingInfoUpdateV2($fulfillmentId: ID!, $trackingInfoInput: FulfillmentTrackingInput!, $notifyCustomer: Boolean) {
      fulfillmentTrackingInfoUpdateV2(
        fulfillmentId: $fulfillmentId
        trackingInfoInput: $trackingInfoInput
        notifyCustomer: $notifyCustomer
      ) {
        fulfillment {
          id
          status
          trackingInfo {
            company
            number
            url
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const trackingInfoInput: Record<string, unknown> = {};
    if (trackingCompany) trackingInfoInput.company = trackingCompany;
    if (trackingNumber) trackingInfoInput.number = trackingNumber;
    if (trackingUrl) trackingInfoInput.url = trackingUrl;

    const data = await adminFetch<{
      fulfillmentTrackingInfoUpdateV2: {
        fulfillment: { id: string } | null;
        userErrors: { field: string[]; message: string }[];
      };
    }>(query, {
      fulfillmentId,
      trackingInfoInput,
      notifyCustomer,
    });

    if (data.fulfillmentTrackingInfoUpdateV2?.userErrors?.length) {
      const error = data.fulfillmentTrackingInfoUpdateV2.userErrors[0];
      console.error("Update tracking errors:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating fulfillment tracking:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update tracking" 
    };
  }
}

export interface OrderStatusUpdate {
  orderId: string;
  status: "OPEN" | "ARCHIVED";
  note?: string;
}

export async function addOrderNote(
  orderId: string,
  note: string
): Promise<{ success: boolean; error?: string }> {
  const query = `
    mutation OrderUpdate($input: OrderInput!) {
      orderUpdate(input: $input) {
        order {
          id
          note
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await adminFetch<{
      orderUpdate: {
        order: { id: string } | null;
        userErrors: { field: string[]; message: string }[];
      };
    }>(query, {
      input: {
        id: orderId,
        note,
      },
    });

    if (data.orderUpdate?.userErrors?.length) {
      const error = data.orderUpdate.userErrors[0];
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding order note:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to add note" 
    };
  }
}

export async function getOrderStats(): Promise<{
  totalOrders: number;
  unfulfilled: number;
  totalRevenue: number;
  currency: string;
}> {
  const query = `
    query OrderStats {
      ordersCount: orders(first: 1) {
        edges { node { id } }
        pageInfo { hasNextPage }
      }
      unfulfilled: orders(first: 250, query: "fulfillment_status:unfulfilled") {
        edges { node { id } }
      }
      recentOrders: orders(first: 250) {
        edges {
          node {
            totalPriceSet {
              shopMoney { amount currencyCode }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await adminFetch<any>(query);

    const totalRevenue = data.recentOrders.edges.reduce(
      (sum: number, e: any) => sum + parseFloat(e.node.totalPriceSet.shopMoney.amount),
      0
    );

    const currency =
      data.recentOrders.edges[0]?.node.totalPriceSet.shopMoney.currencyCode || "INR";

    return {
      totalOrders: data.recentOrders.edges.length,
      unfulfilled: data.unfulfilled.edges.length,
      totalRevenue,
      currency,
    };
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return { totalOrders: 0, unfulfilled: 0, totalRevenue: 0, currency: "INR" };
  }
}

export function formatMoney(amount: string | number, currency: string = "INR"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(dateString));
}

export async function updateOrderTags(
  orderId: string,
  tags: string[]
): Promise<{ success: boolean; error?: string }> {
  const query = `
    mutation OrderUpdate($input: OrderInput!) {
      orderUpdate(input: $input) {
        order {
          id
          tags
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await adminFetch<{
      orderUpdate: {
        order: { id: string; tags: string[] } | null;
        userErrors: { field: string[]; message: string }[];
      };
    }>(query, {
      input: {
        id: orderId,
        tags,
      },
    });

    if (data.orderUpdate?.userErrors?.length) {
      const error = data.orderUpdate.userErrors[0];
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating order tags:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update tags" 
    };
  }
}

export async function closeOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  const query = `
    mutation OrderClose($input: OrderCloseInput!) {
      orderClose(input: $input) {
        order {
          id
          closed
          closedAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await adminFetch<{
      orderClose: {
        order: { id: string } | null;
        userErrors: { field: string[]; message: string }[];
      };
    }>(query, {
      input: { id: orderId },
    });

    if (data.orderClose?.userErrors?.length) {
      const error = data.orderClose.userErrors[0];
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error closing order:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to close order" 
    };
  }
}

export async function openOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  const query = `
    mutation OrderOpen($input: OrderOpenInput!) {
      orderOpen(input: $input) {
        order {
          id
          closed
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await adminFetch<{
      orderOpen: {
        order: { id: string } | null;
        userErrors: { field: string[]; message: string }[];
      };
    }>(query, {
      input: { id: orderId },
    });

    if (data.orderOpen?.userErrors?.length) {
      const error = data.orderOpen.userErrors[0];
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error opening order:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to open order" 
    };
  }
}

export async function markOrderAsPaid(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  const query = `
    mutation OrderMarkAsPaid($input: OrderMarkAsPaidInput!) {
      orderMarkAsPaid(input: $input) {
        order {
          id
          displayFinancialStatus
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await adminFetch<{
      orderMarkAsPaid: {
        order: { id: string } | null;
        userErrors: { field: string[]; message: string }[];
      };
    }>(query, {
      input: { id: orderId },
    });

    if (data.orderMarkAsPaid?.userErrors?.length) {
      const error = data.orderMarkAsPaid.userErrors[0];
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error marking order as paid:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to mark order as paid" 
    };
  }
}

export async function cancelFulfillment(
  fulfillmentId: string
): Promise<{ success: boolean; error?: string }> {
  const query = `
    mutation FulfillmentCancel($id: ID!) {
      fulfillmentCancel(id: $id) {
        fulfillment {
          id
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await adminFetch<{
      fulfillmentCancel: {
        fulfillment: { id: string; status: string } | null;
        userErrors: { field: string[]; message: string }[];
      };
    }>(query, { id: fulfillmentId });

    if (data.fulfillmentCancel?.userErrors?.length) {
      const error = data.fulfillmentCancel.userErrors[0];
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error cancelling fulfillment:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to cancel fulfillment" 
    };
  }
}
