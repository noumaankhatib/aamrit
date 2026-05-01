/**
 * Customer Account API GraphQL — maps to shapes used by account UI.
 */

import type { ShopifyCustomer, ShopifyOrder, ShopifyAddress } from "@/lib/shopify-customer";
import {
  discoverCustomerAccountGraphqlUrl,
  normalizeShopHost,
} from "@/lib/shopify-customer-account-auth";
import { env } from "@/lib/env";

function getAppOrigin(): string {
  const u = env.appUrl.replace(/\/$/, "");
  return u.startsWith("http") ? u : `https://${u}`;
}

async function getGraphqlEndpoint(): Promise<string | null> {
  const host = normalizeShopHost(env.shopify.publicStoreDomain || env.shopify.storeDomain);
  if (!host) return null;
  return discoverCustomerAccountGraphqlUrl(host);
}

async function customerAccountFetch<T>(
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<{ data?: T; errors?: { message: string }[] }> {
  const endpoint = await getGraphqlEndpoint();
  if (!endpoint) {
    return { errors: [{ message: "Customer Account API discovery failed" }] };
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
      "User-Agent": "AamritStorefront/1.0",
      Origin: getAppOrigin(),
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  return json;
}

function mapAddress(node: Record<string, unknown> | null | undefined): ShopifyAddress | null {
  if (!node || typeof node !== "object") return null;
  const id = node.id as string;
  if (!id) return null;
  return {
    id,
    firstName: (node.firstName as string) ?? null,
    lastName: (node.lastName as string) ?? null,
    company: (node.company as string) ?? null,
    address1: (node.address1 as string) ?? null,
    address2: (node.address2 as string) ?? null,
    city: (node.city as string) ?? null,
    province: (node.province as string) ?? null,
    provinceCode: (node.zoneCode as string) ?? null,
    country: (node.country as string) ?? null,
    countryCode: (node.territoryCode as string) ?? null,
    zip: (node.zip as string) ?? null,
    phone: (node.phoneNumber as string) ?? null,
  };
}

const CUSTOMER_QUERY = `
  query AccountCustomer {
    customer {
      id
      firstName
      lastName
      creationDate
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
      defaultAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        territoryCode
        zip
        zoneCode
        phoneNumber
      }
      addresses(first: 20) {
        edges {
          node {
            id
            firstName
            lastName
            company
            address1
            address2
            city
            territoryCode
            zip
            zoneCode
            phoneNumber
          }
        }
      }
    }
  }
`;

export async function fetchCustomerAccountProfile(
  accessToken: string
): Promise<{ customer: ShopifyCustomer | null; error: string | null }> {
  const json = await customerAccountFetch<{
    customer: Record<string, unknown> | null;
  }>(accessToken, CUSTOMER_QUERY);

  if (json.errors?.length) {
    return { customer: null, error: json.errors[0].message };
  }

  const c = json.data?.customer;
  if (!c) {
    return { customer: null, error: "Not signed in" };
  }

  const email =
    (c.emailAddress as { emailAddress?: string } | undefined)?.emailAddress ?? "";

  const defaultAddr = mapAddress(c.defaultAddress as Record<string, unknown> | undefined);

  const edges = (c.addresses as { edges?: { node: Record<string, unknown> }[] } | undefined)?.edges;
  const addresses: ShopifyAddress[] =
    edges
      ?.map((e) => mapAddress(e.node))
      .filter((a): a is ShopifyAddress => Boolean(a)) ?? [];

  const customer: ShopifyCustomer = {
    id: String(c.id),
    email,
    firstName: (c.firstName as string | null) ?? null,
    lastName: (c.lastName as string | null) ?? null,
    phone: (c.phoneNumber as { phoneNumber?: string } | null)?.phoneNumber ?? null,
    acceptsMarketing: false,
    createdAt: String(c.creationDate ?? new Date().toISOString()),
    defaultAddress: defaultAddr,
    addresses,
  };

  return { customer, error: null };
}

const ORDERS_QUERY = `
  query AccountOrders($first: Int!) {
    customer {
      orders(first: $first, reverse: true) {
        edges {
          node {
            id
            number
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 15) {
              edges {
                node {
                  name
                  title
                  quantity
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
`;

export async function fetchCustomerAccountOrders(
  accessToken: string,
  first = 10
): Promise<{ orders: ShopifyOrder[]; error: string | null }> {
  const json = await customerAccountFetch<{
    customer: {
      orders: {
        edges: {
          node: Record<string, unknown>;
        }[];
      } | null;
    } | null;
  }>(accessToken, ORDERS_QUERY, { first });

  if (json.errors?.length) {
    return { orders: [], error: json.errors[0].message };
  }

  const edges = json.data?.customer?.orders?.edges;
  if (!edges?.length) {
    return { orders: [], error: null };
  }

  const orders: ShopifyOrder[] = edges.map(({ node: o }) => {
    const lineEdges = (o.lineItems as { edges?: { node: Record<string, unknown> }[] })?.edges ?? [];
    const lineItems = lineEdges.map(({ node: line }) => {
      const title = (line.title as string) || (line.name as string) || "Item";
      const qty = (line.quantity as number) ?? 1;
      const price = line.price as { amount?: string; currencyCode?: string } | undefined;
      const img = line.image as { url?: string; altText?: string | null } | undefined;
      return {
        title,
        quantity: qty,
        variant: img?.url
          ? {
              price: {
                amount: price?.amount ?? "0",
                currencyCode: price?.currencyCode ?? "INR",
              },
              image: {
                url: img.url,
                altText: img.altText ?? null,
              },
            }
          : price
            ? {
                price: {
                  amount: price.amount ?? "0",
                  currencyCode: price.currencyCode ?? "INR",
                },
                image: null,
              }
            : null,
      };
    });

    const totalPrice = o.totalPrice as { amount?: string; currencyCode?: string };

    return {
      id: String(o.id),
      orderNumber: Number(o.number) ?? 0,
      processedAt: String(o.processedAt),
      financialStatus: String(o.financialStatus ?? "UNKNOWN"),
      fulfillmentStatus: String(o.fulfillmentStatus ?? "UNKNOWN"),
      totalPrice: {
        amount: totalPrice?.amount ?? "0",
        currencyCode: totalPrice?.currencyCode ?? "INR",
      },
      lineItems,
    };
  });

  return { orders, error: null };
}

export interface ShopifyOrderDetail {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  statusPageUrl: string | null;
  totalPrice: { amount: string; currencyCode: string };
  subtotalPrice: { amount: string; currencyCode: string } | null;
  totalShipping: { amount: string; currencyCode: string } | null;
  totalTax: { amount: string; currencyCode: string } | null;
  shippingAddress: ShopifyAddress | null;
  fulfillments: {
    status: string;
    trackingCompany: string | null;
    trackingNumber: string | null;
    trackingUrl: string | null;
  }[];
  lineItems: {
    title: string;
    quantity: number;
    price: { amount: string; currencyCode: string } | null;
    image: { url: string; altText: string | null } | null;
  }[];
}

const ORDER_DETAIL_QUERY = `
  query AccountOrderDetail($id: ID!) {
    order(id: $id) {
      id
      number
      processedAt
      financialStatus
      fulfillmentStatus
      statusPageUrl
      totalPrice { amount currencyCode }
      subtotal { amount currencyCode }
      totalShipping { amount currencyCode }
      totalTax { amount currencyCode }
      shippingAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        territoryCode
        zip
        zoneCode
        phoneNumber
      }
      fulfillments(first: 10) {
        edges {
          node {
            status
            trackingInformation {
              company
              number
              url
            }
          }
        }
      }
      lineItems(first: 50) {
        edges {
          node {
            title
            name
            quantity
            price { amount currencyCode }
            image { url altText }
          }
        }
      }
    }
  }
`;

export async function fetchCustomerAccountOrderById(
  accessToken: string,
  orderId: string
): Promise<{ order: ShopifyOrderDetail | null; error: string | null }> {
  const json = await customerAccountFetch<{
    order: Record<string, unknown> | null;
  }>(accessToken, ORDER_DETAIL_QUERY, { id: orderId });

  if (json.errors?.length) {
    return { order: null, error: json.errors[0].message };
  }

  const o = json.data?.order;
  if (!o) return { order: null, error: "Order not found" };

  const lineEdges = (o.lineItems as { edges?: { node: Record<string, unknown> }[] })?.edges ?? [];
  const lineItems = lineEdges.map(({ node: line }) => {
    const title = (line.title as string) || (line.name as string) || "Item";
    const qty = (line.quantity as number) ?? 1;
    const price = line.price as { amount?: string; currencyCode?: string } | undefined;
    const img = line.image as { url?: string; altText?: string | null } | undefined;
    return {
      title,
      quantity: qty,
      price: price?.amount
        ? { amount: price.amount, currencyCode: price.currencyCode ?? "INR" }
        : null,
      image: img?.url ? { url: img.url, altText: img.altText ?? null } : null,
    };
  });

  const fulfillEdges = (o.fulfillments as { edges?: { node: Record<string, unknown> }[] })?.edges ?? [];
  const fulfillments = fulfillEdges.map(({ node: f }) => {
    const ti = (f.trackingInformation as { company?: string; number?: string; url?: string }[] | undefined)?.[0];
    return {
      status: String(f.status ?? "UNKNOWN"),
      trackingCompany: ti?.company ?? null,
      trackingNumber: ti?.number ?? null,
      trackingUrl: ti?.url ?? null,
    };
  });

  const totalPrice = o.totalPrice as { amount?: string; currencyCode?: string };
  const subtotal = o.subtotal as { amount?: string; currencyCode?: string } | undefined;
  const shipping = o.totalShipping as { amount?: string; currencyCode?: string } | undefined;
  const tax = o.totalTax as { amount?: string; currencyCode?: string } | undefined;

  return {
    order: {
      id: String(o.id),
      orderNumber: Number(o.number) ?? 0,
      processedAt: String(o.processedAt ?? ""),
      financialStatus: String(o.financialStatus ?? "UNKNOWN"),
      fulfillmentStatus: String(o.fulfillmentStatus ?? "UNKNOWN"),
      statusPageUrl: (o.statusPageUrl as string) ?? null,
      totalPrice: {
        amount: totalPrice?.amount ?? "0",
        currencyCode: totalPrice?.currencyCode ?? "INR",
      },
      subtotalPrice: subtotal?.amount
        ? { amount: subtotal.amount, currencyCode: subtotal.currencyCode ?? "INR" }
        : null,
      totalShipping: shipping?.amount
        ? { amount: shipping.amount, currencyCode: shipping.currencyCode ?? "INR" }
        : null,
      totalTax: tax?.amount
        ? { amount: tax.amount, currencyCode: tax.currencyCode ?? "INR" }
        : null,
      shippingAddress: mapAddress(o.shippingAddress as Record<string, unknown> | undefined),
      fulfillments,
      lineItems,
    },
    error: null,
  };
}

const CUSTOMER_UPDATE_MUTATION = `
  mutation CustomerAccountUpdate($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        firstName
        lastName
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export async function updateCustomerAccountProfile(
  accessToken: string,
  input: { firstName?: string; lastName?: string }
): Promise<{ ok: boolean; error: string | null }> {
  const json = await customerAccountFetch<{
    customerUpdate: {
      userErrors: { message: string }[];
      customer: { id: string } | null;
    };
  }>(accessToken, CUSTOMER_UPDATE_MUTATION, { input });

  if (json.errors?.length) {
    return { ok: false, error: json.errors[0].message };
  }

  const errs = json.data?.customerUpdate?.userErrors;
  if (errs?.length) {
    return { ok: false, error: errs[0].message };
  }

  return { ok: true, error: null };
}

export interface CustomerAddressInput {
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  zoneCode?: string | null;
  territoryCode?: string | null;
  zip?: string | null;
  phoneNumber?: string | null;
}

const ADDRESS_CREATE_MUTATION = `
  mutation CustomerAddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
      customerAddress { id }
      userErrors { code field message }
    }
  }
`;

const ADDRESS_UPDATE_MUTATION = `
  mutation CustomerAddressUpdate($addressId: ID!, $address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) {
      customerAddress { id }
      userErrors { code field message }
    }
  }
`;

const ADDRESS_DELETE_MUTATION = `
  mutation CustomerAddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors { code field message }
    }
  }
`;

const ADDRESS_DEFAULT_UPDATE_MUTATION = `
  mutation CustomerDefaultAddressUpdate($addressId: ID!) {
    customerDefaultAddressUpdate(addressId: $addressId) {
      customer { id }
      userErrors { code field message }
    }
  }
`;

export async function createCustomerAccountAddress(
  accessToken: string,
  input: CustomerAddressInput,
  setAsDefault = false
): Promise<{ ok: boolean; error: string | null }> {
  const json = await customerAccountFetch<{
    customerAddressCreate: {
      userErrors: { message: string }[];
      customerAddress: { id: string } | null;
    };
  }>(accessToken, ADDRESS_CREATE_MUTATION, { address: input, defaultAddress: setAsDefault });
  if (json.errors?.length) return { ok: false, error: json.errors[0].message };
  const errs = json.data?.customerAddressCreate?.userErrors;
  if (errs?.length) return { ok: false, error: errs[0].message };
  return { ok: true, error: null };
}

export async function updateCustomerAccountAddress(
  accessToken: string,
  addressId: string,
  input: CustomerAddressInput,
  setAsDefault = false
): Promise<{ ok: boolean; error: string | null }> {
  const json = await customerAccountFetch<{
    customerAddressUpdate: {
      userErrors: { message: string }[];
      customerAddress: { id: string } | null;
    };
  }>(accessToken, ADDRESS_UPDATE_MUTATION, { addressId, address: input, defaultAddress: setAsDefault });
  if (json.errors?.length) return { ok: false, error: json.errors[0].message };
  const errs = json.data?.customerAddressUpdate?.userErrors;
  if (errs?.length) return { ok: false, error: errs[0].message };
  return { ok: true, error: null };
}

export async function deleteCustomerAccountAddress(
  accessToken: string,
  addressId: string
): Promise<{ ok: boolean; error: string | null }> {
  const json = await customerAccountFetch<{
    customerAddressDelete: {
      userErrors: { message: string }[];
      deletedAddressId: string | null;
    };
  }>(accessToken, ADDRESS_DELETE_MUTATION, { addressId });
  if (json.errors?.length) return { ok: false, error: json.errors[0].message };
  const errs = json.data?.customerAddressDelete?.userErrors;
  if (errs?.length) return { ok: false, error: errs[0].message };
  return { ok: true, error: null };
}

export async function setDefaultCustomerAccountAddress(
  accessToken: string,
  addressId: string
): Promise<{ ok: boolean; error: string | null }> {
  const json = await customerAccountFetch<{
    customerDefaultAddressUpdate: {
      userErrors: { message: string }[];
      customer: { id: string } | null;
    };
  }>(accessToken, ADDRESS_DEFAULT_UPDATE_MUTATION, { addressId });
  if (json.errors?.length) return { ok: false, error: json.errors[0].message };
  const errs = json.data?.customerDefaultAddressUpdate?.userErrors;
  if (errs?.length) return { ok: false, error: errs[0].message };
  return { ok: true, error: null };
}
