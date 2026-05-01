/**
 * Shopify Customer Account API utilities (Legacy Storefront API).
 * Handles customer authentication, registration, and account management
 * via the Storefront API customer mutations.
 */

import {
  env,
  isShopifyConfigured,
  getStorefrontApiUrl,
  getStorefrontToken,
} from "@/lib/env";

const STOREFRONT_API_URL = getStorefrontApiUrl();

// ============================================================================
// Types
// ============================================================================

export interface ShopifyCustomer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  acceptsMarketing: boolean;
  createdAt: string;
  defaultAddress: ShopifyAddress | null;
  addresses: ShopifyAddress[];
}

export interface ShopifyAddress {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  provinceCode: string | null;
  country: string | null;
  countryCode: string | null;
  zip: string | null;
  phone: string | null;
}

export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: { amount: string; currencyCode: string };
  lineItems: {
    title: string;
    quantity: number;
    variant: {
      price: { amount: string; currencyCode: string };
      image: { url: string; altText: string | null } | null;
    } | null;
  }[];
}

export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

interface ShopifyResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

// ============================================================================
// API Helper
// ============================================================================

async function shopifyCustomerFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: { timeout?: number } = {}
): Promise<T> {
  const { timeout = 15000 } = options;
  
  if (!isShopifyConfigured()) {
    throw new Error("Shopify credentials not configured");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(STOREFRONT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": getStorefrontToken(),
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`Shopify API error: ${response.status}${errorText ? ` - ${errorText.slice(0, 200)}` : ""}`);
    }

    const json: ShopifyResponse<T> = await response.json();

    if (json.errors?.length) {
      throw new Error(json.errors[0].message);
    }

    if (!json.data) {
      throw new Error("No data returned from Shopify");
    }

    return json.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Shopify API request timed out after ${timeout}ms`);
    }
    throw error;
  }
}

// ============================================================================
// Customer Authentication
// ============================================================================

export async function customerLogin(
  email: string,
  password: string
): Promise<{ token: CustomerAccessToken | null; error: string | null }> {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyCustomerFetch<{
      customerAccessTokenCreate: {
        customerAccessToken: CustomerAccessToken | null;
        customerUserErrors: { code: string; message: string }[];
      };
    }>(query, { input: { email, password } });

    const { customerAccessToken, customerUserErrors } = data.customerAccessTokenCreate;

    if (customerUserErrors.length > 0) {
      return { token: null, error: customerUserErrors[0].message };
    }

    return { token: customerAccessToken, error: null };
  } catch (error) {
    console.error("Customer login error:", error);
    return { token: null, error: "Failed to sign in. Please try again." };
  }
}

export async function customerRegister(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}): Promise<{ customer: ShopifyCustomer | null; error: string | null }> {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
          phone
          acceptsMarketing
          createdAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyCustomerFetch<{
      customerCreate: {
        customer: ShopifyCustomer | null;
        customerUserErrors: { code: string; field: string[]; message: string }[];
      };
    }>(query, { input });

    const { customer, customerUserErrors } = data.customerCreate;

    if (customerUserErrors.length > 0) {
      return { customer: null, error: customerUserErrors[0].message };
    }

    return { customer, error: null };
  } catch (error) {
    console.error("Customer registration error:", error);
    return { customer: null, error: "Failed to create account. Please try again." };
  }
}

export async function customerLogout(
  accessToken: string
): Promise<{ success: boolean; error: string | null }> {
  const query = `
    mutation customerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyCustomerFetch<{
      customerAccessTokenDelete: {
        deletedAccessToken: string | null;
        userErrors: { message: string }[];
      };
    }>(query, { customerAccessToken: accessToken });

    const { userErrors } = data.customerAccessTokenDelete;

    if (userErrors.length > 0) {
      return { success: false, error: userErrors[0].message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Customer logout error:", error);
    return { success: false, error: "Failed to sign out" };
  }
}

export async function renewAccessToken(
  accessToken: string
): Promise<{ token: CustomerAccessToken | null; error: string | null }> {
  const query = `
    mutation customerAccessTokenRenew($customerAccessToken: String!) {
      customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyCustomerFetch<{
      customerAccessTokenRenew: {
        customerAccessToken: CustomerAccessToken | null;
        userErrors: { message: string }[];
      };
    }>(query, { customerAccessToken: accessToken });

    const { customerAccessToken, userErrors } = data.customerAccessTokenRenew;

    if (userErrors.length > 0) {
      return { token: null, error: userErrors[0].message };
    }

    return { token: customerAccessToken, error: null };
  } catch (error) {
    console.error("Token renewal error:", error);
    return { token: null, error: "Failed to renew session" };
  }
}

// ============================================================================
// Customer Profile
// ============================================================================

export async function getCustomer(
  accessToken: string
): Promise<{ customer: ShopifyCustomer | null; error: string | null }> {
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        email
        firstName
        lastName
        phone
        acceptsMarketing
        createdAt
        defaultAddress {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          province
          provinceCode
          country
          countryCode
          zip
          phone
        }
        addresses(first: 10) {
          edges {
            node {
              id
              firstName
              lastName
              company
              address1
              address2
              city
              province
              provinceCode
              country
              countryCode
              zip
              phone
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyCustomerFetch<{
      customer: (Omit<ShopifyCustomer, 'addresses'> & {
        addresses: { edges: { node: ShopifyAddress }[] };
      }) | null;
    }>(query, { customerAccessToken: accessToken });

    if (!data.customer) {
      return { customer: null, error: "Customer not found" };
    }

    const customer: ShopifyCustomer = {
      ...data.customer,
      addresses: data.customer.addresses.edges.map((e) => e.node),
    };

    return { customer, error: null };
  } catch (error) {
    console.error("Get customer error:", error);
    return { customer: null, error: "Failed to fetch profile" };
  }
}

export async function updateCustomer(
  accessToken: string,
  input: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    acceptsMarketing?: boolean;
  }
): Promise<{ customer: ShopifyCustomer | null; error: string | null }> {
  const query = `
    mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
        customer {
          id
          email
          firstName
          lastName
          phone
          acceptsMarketing
          createdAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyCustomerFetch<{
      customerUpdate: {
        customer: ShopifyCustomer | null;
        customerUserErrors: { message: string }[];
      };
    }>(query, { customerAccessToken: accessToken, customer: input });

    const { customer, customerUserErrors } = data.customerUpdate;

    if (customerUserErrors.length > 0) {
      return { customer: null, error: customerUserErrors[0].message };
    }

    return { customer, error: null };
  } catch (error) {
    console.error("Update customer error:", error);
    return { customer: null, error: "Failed to update profile" };
  }
}

// ============================================================================
// Password Management
// ============================================================================

export async function recoverPassword(
  email: string
): Promise<{ success: boolean; error: string | null }> {
  const query = `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyCustomerFetch<{
      customerRecover: {
        customerUserErrors: { message: string }[];
      };
    }>(query, { email });

    const { customerUserErrors } = data.customerRecover;

    if (customerUserErrors.length > 0) {
      return { success: false, error: customerUserErrors[0].message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Password recovery error:", error);
    return { success: false, error: "Failed to send recovery email" };
  }
}

export async function resetPassword(
  resetUrl: string,
  password: string
): Promise<{ token: CustomerAccessToken | null; error: string | null }> {
  const query = `
    mutation customerResetByUrl($resetUrl: URL!, $password: String!) {
      customerResetByUrl(resetUrl: $resetUrl, password: $password) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyCustomerFetch<{
      customerResetByUrl: {
        customerAccessToken: CustomerAccessToken | null;
        customerUserErrors: { message: string }[];
      };
    }>(query, { resetUrl, password });

    const { customerAccessToken, customerUserErrors } = data.customerResetByUrl;

    if (customerUserErrors.length > 0) {
      return { token: null, error: customerUserErrors[0].message };
    }

    return { token: customerAccessToken, error: null };
  } catch (error) {
    console.error("Password reset error:", error);
    return { token: null, error: "Failed to reset password" };
  }
}

// ============================================================================
// Customer Orders
// ============================================================================

export async function getCustomerOrders(
  accessToken: string,
  first = 10
): Promise<{ orders: ShopifyOrder[]; error: string | null }> {
  const query = `
    query getCustomerOrders($customerAccessToken: String!, $first: Int!) {
      customer(customerAccessToken: $customerAccessToken) {
        orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      price {
                        amount
                        currencyCode
                      }
                      image {
                        url
                        altText
                      }
                    }
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
    const data = await shopifyCustomerFetch<{
      customer: {
        orders: {
          edges: {
            node: Omit<ShopifyOrder, 'lineItems'> & {
              lineItems: { edges: { node: ShopifyOrder['lineItems'][0] }[] };
            };
          }[];
        };
      } | null;
    }>(query, { customerAccessToken: accessToken, first });

    if (!data.customer) {
      return { orders: [], error: "Customer not found" };
    }

    const orders: ShopifyOrder[] = data.customer.orders.edges.map((edge) => ({
      ...edge.node,
      lineItems: edge.node.lineItems.edges.map((e) => e.node),
    }));

    return { orders, error: null };
  } catch (error) {
    console.error("Get orders error:", error);
    return { orders: [], error: "Failed to fetch orders" };
  }
}

// ============================================================================
// Address Management
// ============================================================================

export async function createAddress(
  accessToken: string,
  address: Omit<ShopifyAddress, 'id'>
): Promise<{ address: ShopifyAddress | null; error: string | null }> {
  const query = `
    mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
        customerAddress {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          province
          provinceCode
          country
          countryCode
          zip
          phone
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyCustomerFetch<{
      customerAddressCreate: {
        customerAddress: ShopifyAddress | null;
        customerUserErrors: { message: string }[];
      };
    }>(query, { customerAccessToken: accessToken, address });

    const { customerAddress, customerUserErrors } = data.customerAddressCreate;

    if (customerUserErrors.length > 0) {
      return { address: null, error: customerUserErrors[0].message };
    }

    return { address: customerAddress, error: null };
  } catch (error) {
    console.error("Create address error:", error);
    return { address: null, error: "Failed to add address" };
  }
}

export async function updateAddress(
  accessToken: string,
  addressId: string,
  address: Partial<Omit<ShopifyAddress, 'id'>>
): Promise<{ address: ShopifyAddress | null; error: string | null }> {
  const query = `
    mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
      customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
        customerAddress {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          province
          provinceCode
          country
          countryCode
          zip
          phone
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyCustomerFetch<{
      customerAddressUpdate: {
        customerAddress: ShopifyAddress | null;
        customerUserErrors: { message: string }[];
      };
    }>(query, { customerAccessToken: accessToken, id: addressId, address });

    const { customerAddress, customerUserErrors } = data.customerAddressUpdate;

    if (customerUserErrors.length > 0) {
      return { address: null, error: customerUserErrors[0].message };
    }

    return { address: customerAddress, error: null };
  } catch (error) {
    console.error("Update address error:", error);
    return { address: null, error: "Failed to update address" };
  }
}

export async function deleteAddress(
  accessToken: string,
  addressId: string
): Promise<{ success: boolean; error: string | null }> {
  const query = `
    mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
      customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
        deletedCustomerAddressId
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyCustomerFetch<{
      customerAddressDelete: {
        deletedCustomerAddressId: string | null;
        customerUserErrors: { message: string }[];
      };
    }>(query, { customerAccessToken: accessToken, id: addressId });

    const { customerUserErrors } = data.customerAddressDelete;

    if (customerUserErrors.length > 0) {
      return { success: false, error: customerUserErrors[0].message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Delete address error:", error);
    return { success: false, error: "Failed to delete address" };
  }
}

export async function setDefaultAddress(
  accessToken: string,
  addressId: string
): Promise<{ success: boolean; error: string | null }> {
  const query = `
    mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
      customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
        customer {
          id
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyCustomerFetch<{
      customerDefaultAddressUpdate: {
        customer: { id: string } | null;
        customerUserErrors: { message: string }[];
      };
    }>(query, { customerAccessToken: accessToken, addressId });

    const { customerUserErrors } = data.customerDefaultAddressUpdate;

    if (customerUserErrors.length > 0) {
      return { success: false, error: customerUserErrors[0].message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Set default address error:", error);
    return { success: false, error: "Failed to set default address" };
  }
}
