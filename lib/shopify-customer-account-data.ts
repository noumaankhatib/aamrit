/**
 * Customer Account API GraphQL — maps to shapes used by account UI.
 */

import type { ShopifyCustomer, ShopifyOrder, ShopifyAddress } from "@/lib/shopify-customer";
import {
  discoverCustomerAccountGraphqlUrl,
  normalizeShopHost,
} from "@/lib/shopify-customer-account-auth";
import { env } from "@/lib/env";

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
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "AamritStorefront/1.0",
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
        province
        territoryCode
        country
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
            province
            territoryCode
            country
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
