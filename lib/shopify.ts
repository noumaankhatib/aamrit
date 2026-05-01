/**
 * Shopify Storefront API client and data fetching utilities.
 * Centralizes all Shopify API calls with proper error handling and caching.
 */

import {
  env,
  isShopifyConfigured,
  getStorefrontApiUrl,
  getStorefrontToken,
} from "@/lib/env";

const STOREFRONT_API_URL = getStorefrontApiUrl();

// Type definitions matching current frontend data shapes
export interface ShopifyProduct {
  id: string;
  slug: string;
  name: string;
  variety: string;
  description: string;
  benefits: string | null;
  nutrition: string | null;
  priceCents: number;
  weightGrams: number;
  imageUrl: string;
  gallery: string[];
  stock: number;
  active: boolean;
  featured: boolean;
  category: ShopifyCategory | null;
  categoryId: string | null;
}

export interface ShopifyCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ShopifyCartItem {
  id: string;
  productId: string;
  quantity: number;
  product: ShopifyProduct;
}

export interface ShopifyCart {
  id: string;
  items: ShopifyCartItem[];
  checkoutUrl: string;
  subtotalCents: number;
  totalCents: number;
  totalQuantity: number;
}

interface ShopifyAPIError {
  message: string;
  extensions?: Record<string, unknown>;
}

interface ShopifyResponse<T> {
  data?: T;
  errors?: ShopifyAPIError[];
}

interface ShopifyFetchOptions {
  cache?: RequestCache;
  revalidate?: number;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

/**
 * Core Shopify Storefront API fetch with retry logic and improved error handling.
 */
async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: ShopifyFetchOptions = {}
): Promise<T> {
  const {
    cache,
    revalidate,
    timeout = 10000,
    retries = 2,
    retryDelay = 1000,
  } = options;

  if (!isShopifyConfigured()) {
    throw new Error(
      "Shopify credentials not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN."
    );
  }

  const token = getStorefrontToken(true);
  
  const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  };

  if (cache) {
    fetchOptions.cache = cache;
  }

  if (revalidate !== undefined) {
    fetchOptions.next = { revalidate };
  }

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(STOREFRONT_API_URL, {
        ...fetchOptions,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `Shopify API error: ${response.status} ${response.statusText}${errorText ? ` - ${errorText.slice(0, 200)}` : ""}`
        );
      }

      const json: ShopifyResponse<T> = await response.json();

      if (json.errors?.length) {
        const errorMessages = json.errors.map((e) => e.message).join(", ");
        console.error("[shopifyFetch] GraphQL errors:", json.errors);
        throw new Error(`Shopify GraphQL error: ${errorMessages}`);
      }

      if (!json.data) {
        throw new Error("No data returned from Shopify");
      }

      return json.data;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (error instanceof Error && error.name === "AbortError") {
        lastError = new Error(`Shopify API request timed out after ${timeout}ms`);
      }
      
      const isRetryable =
        lastError.message.includes("timed out") ||
        lastError.message.includes("503") ||
        lastError.message.includes("502") ||
        lastError.message.includes("429") ||
        lastError.message.includes("ECONNRESET");
      
      if (attempt < retries && isRetryable) {
        const delay = retryDelay * Math.pow(2, attempt);
        console.warn(`[shopifyFetch] Retry ${attempt + 1}/${retries} after ${delay}ms:`, lastError.message);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      
      throw lastError;
    }
  }
  
  throw lastError ?? new Error("Shopify fetch failed");
}

/** Carton weights are sometimes stored on variants; ≥1 kg is not plausible per mango. */
function normalizePerPieceWeightGrams(weightGrams: number, title: string): number {
  const gradeMatch = title.match(/Grade\s*(A\d)/i);
  const midpoint: Record<string, number> = { A1: 275, A2: 225, A3: 175 };
  const g = gradeMatch ? gradeMatch[1].toUpperCase() : null;
  const graded = g && midpoint[g] ? midpoint[g] : 300;

  if (!Number.isFinite(weightGrams) || weightGrams <= 0) return graded;
  if (weightGrams >= 1000) return graded;
  return Math.round(weightGrams);
}

// Transform Shopify product to match current frontend shape
function transformProduct(shopifyProduct: any): ShopifyProduct {
  const variant = shopifyProduct.variants?.edges?.[0]?.node;
  const priceAmount = parseFloat(variant?.price?.amount ?? "0");
  const priceCents = Math.round(priceAmount * 100);

  const rawKg = variant?.weight;
  const kg =
    typeof rawKg === "number"
      ? rawKg
      : typeof rawKg === "string"
        ? parseFloat(rawKg)
        : NaN;
  const variantWeightGrams =
    Number.isFinite(kg) && kg > 0
      ? Math.round(kg * (variant.weightUnit === "KILOGRAMS" ? 1000 : 1))
      : null;
  const weightGrams = normalizePerPieceWeightGrams(
    variantWeightGrams ?? 850,
    shopifyProduct.title ?? ""
  );

  // Extract custom fields from metafields
  const metafields = shopifyProduct.metafields?.edges?.reduce(
    (acc: Record<string, string>, edge: any) => {
      if (edge.node?.key && edge.node?.value) {
        acc[edge.node.key] = edge.node.value;
      }
      return acc;
    },
    {}
  ) ?? {};

  // Get gallery images
  const gallery = shopifyProduct.images?.edges
    ?.slice(1)
    .map((edge: any) => edge.node?.url)
    .filter(Boolean) ?? [];

  // Check stock availability
  const quantityAvailable = variant?.quantityAvailable ?? 0;
  const availableForSale = shopifyProduct.availableForSale ?? false;

  return {
    id: shopifyProduct.id,
    slug: shopifyProduct.handle,
    name: shopifyProduct.title,
    variety: metafields.variety ?? shopifyProduct.productType ?? "",
    description: shopifyProduct.description ?? "",
    benefits: metafields.benefits ?? null,
    nutrition: metafields.nutrition ?? null,
    priceCents,
    weightGrams,
    imageUrl: shopifyProduct.featuredImage?.url ?? shopifyProduct.images?.edges?.[0]?.node?.url ?? "",
    gallery,
    stock: availableForSale ? Math.max(quantityAvailable, 1) : 0,
    active: shopifyProduct.availableForSale ?? true,
    featured: shopifyProduct.tags?.includes("featured") ?? false,
    category: shopifyProduct.collections?.edges?.[0]?.node
      ? {
          id: shopifyProduct.collections.edges[0].node.id,
          name: shopifyProduct.collections.edges[0].node.title,
          slug: shopifyProduct.collections.edges[0].node.handle,
        }
      : null,
    categoryId: shopifyProduct.collections?.edges?.[0]?.node?.id ?? null,
  };
}

// Transform Shopify collection to category
function transformCollection(collection: any): ShopifyCategory {
  return {
    id: collection.id,
    name: collection.title,
    slug: collection.handle,
  };
}

/** Default Shopify starter collection (“Food & beverage … example/sample products”). Hidden from storefront. */
function isFoodAndBeverageExampleCollection(cat: ShopifyCategory): boolean {
  const slug = cat.slug.trim().toLowerCase();
  const title = cat.name.trim().toLowerCase();
  const haystack = `${slug} ${title}`;

  const mentionsFood = /\bfood\b/u.test(slug + title);
  const mentionsBeverages =
    /\bbev(erage)?s?\b/u.test(haystack) || /\bdrinks?\b/u.test(title);
  const exampleish =
    /\b(example|examples|sample|samples|demo)\b/i.test(haystack) ||
    /\bgetting started\b/i.test(haystack);

  const slugLooksLikeStarterSample =
    slug.includes("food") &&
    (slug.includes("beverage") || slug.includes("beverages") || slug.includes("drink")) &&
    (slug.includes("sample") || slug.includes("example"));

  return mentionsFood && mentionsBeverages && (exampleish || slugLooksLikeStarterSample);
}

// GraphQL Fragments
const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    productType
    availableForSale
    tags
    featuredImage {
      url
      altText
    }
    images(first: 5) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 1) {
      edges {
        node {
          id
          price {
            amount
            currencyCode
          }
          quantityAvailable
          weight
          weightUnit
        }
      }
    }
    collections(first: 1) {
      edges {
        node {
          id
          handle
          title
        }
      }
    }
    metafields(identifiers: [
      {namespace: "custom", key: "variety"},
      {namespace: "custom", key: "benefits"},
      {namespace: "custom", key: "nutrition"}
    ]) {
      key
      value
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              product {
                ...ProductFields
              }
            }
          }
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

// ============================================================================
// Product Fetching
// ============================================================================

export async function getProducts(options: {
  categorySlug?: string;
  searchQuery?: string;
  first?: number;
} = {}): Promise<ShopifyProduct[]> {
  const { categorySlug, searchQuery, first = 50 } = options;

  if (
    categorySlug &&
    isFoodAndBeverageExampleCollection({
      id: "",
      name: "",
      slug: categorySlug,
    })
  ) {
    return [];
  }

  let query: string;
  let variables: Record<string, unknown>;

  if (categorySlug) {
    // Fetch products from a specific collection
    query = `
      query GetCollectionProducts($handle: String!, $first: Int!) {
        collection(handle: $handle) {
          products(first: $first) {
            edges {
              node {
                ...ProductFields
              }
            }
          }
        }
      }
      ${PRODUCT_FRAGMENT}
    `;
    variables = { handle: categorySlug, first };
  } else if (searchQuery) {
    // Search products
    query = `
      query SearchProducts($query: String!, $first: Int!) {
        products(first: $first, query: $query) {
          edges {
            node {
              ...ProductFields
            }
          }
        }
      }
      ${PRODUCT_FRAGMENT}
    `;
    variables = { query: searchQuery, first };
  } else {
    // Fetch all products
    query = `
      query GetAllProducts($first: Int!) {
        products(first: $first, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              ...ProductFields
            }
          }
        }
      }
      ${PRODUCT_FRAGMENT}
    `;
    variables = { first };
  }

  try {
    const data = await shopifyFetch<any>(query, variables, { revalidate: 60 });

    const edges = categorySlug
      ? data.collection?.products?.edges
      : data.products?.edges;

    if (!edges) return [];

    const products = edges
      .map((edge: any) => transformProduct(edge.node))
      .filter(
        (p: ShopifyProduct) =>
          p.active && !(p.category && isFoodAndBeverageExampleCollection(p.category)),
      )
      .sort((a: ShopifyProduct, b: ShopifyProduct) => {
        // Extract grade from product name (e.g., "Grade A1" -> "A1")
        const gradeA = a.name.match(/Grade\s*(A\d)/i)?.[1]?.toUpperCase();
        const gradeB = b.name.match(/Grade\s*(A\d)/i)?.[1]?.toUpperCase();
        
        // Sort by grade: A1 first, then A2, then A3, then products without grade
        if (gradeA && gradeB) {
          return gradeA.localeCompare(gradeB);
        }
        if (gradeA && !gradeB) return -1;
        if (!gradeA && gradeB) return 1;
        
        // Featured products next (among same grade or no grade)
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<ShopifyProduct | null> {
  const query = `
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
      }
    }
    ${PRODUCT_FRAGMENT}
  `;

  try {
    const data = await shopifyFetch<{ product: any }>(query, { handle: slug }, { revalidate: 60 });

    if (!data.product) return null;

    return transformProduct(data.product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit = 3
): Promise<ShopifyProduct[]> {
  if (!categoryId) {
    // If no category, return recent products
    const products = await getProducts({ first: limit + 1 });
    return products.filter((p) => p.id !== productId).slice(0, limit);
  }

  const query = `
    query GetRelatedProducts($collectionId: ID!, $first: Int!) {
      collection(id: $collectionId) {
        products(first: $first) {
          edges {
            node {
              ...ProductFields
            }
          }
        }
      }
    }
    ${PRODUCT_FRAGMENT}
  `;

  try {
    const data = await shopifyFetch<any>(query, { collectionId: categoryId, first: limit + 1 }, { revalidate: 60 });

    const products = data.collection?.products?.edges
      ?.map((edge: any) => transformProduct(edge.node))
      .filter(
        (p: ShopifyProduct) =>
          p.id !== productId &&
          p.active &&
          !(p.category && isFoodAndBeverageExampleCollection(p.category)),
      )
      .slice(0, limit) ?? [];

    return products;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function getAllProductSlugs(): Promise<string[]> {
  const query = `
    query GetAllProductHandles {
      products(first: 250) {
        edges {
          node {
            handle
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<any>(query, {}, { revalidate: 3600 });
    return data.products?.edges?.map((edge: any) => edge.node.handle) ?? [];
  } catch {
    return [];
  }
}

// ============================================================================
// Categories (Collections)
// ============================================================================

export async function getCategories(): Promise<ShopifyCategory[]> {
  const query = `
    query GetCollections {
      collections(first: 50, sortKey: TITLE) {
        edges {
          node {
            id
            handle
            title
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<any>(query, {}, { revalidate: 3600 });

    return (
      data.collections?.edges?.map((edge: any) => transformCollection(edge.node)) ?? []
    ).filter((c: ShopifyCategory) => !isFoodAndBeverageExampleCollection(c));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// ============================================================================
// Cart Operations
// ============================================================================

export async function createCart(): Promise<ShopifyCart | null> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const returnUrl = `${appUrl.replace(/\/$/, "")}/orders/success`;
  
  const query = `
    mutation CreateCart($input: CartInput) {
      cartCreate(input: $input) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  try {
    const data = await shopifyFetch<any>(
      query, 
      { 
        input: {
          attributes: [
            { key: "_return_url", value: returnUrl }
          ]
        }
      }, 
      { cache: "no-store" }
    );

    if (data.cartCreate?.userErrors?.length) {
      console.error("Cart creation errors:", data.cartCreate.userErrors);
      return null;
    }

    return transformCart(data.cartCreate.cart);
  } catch (error) {
    console.error("Error creating cart:", error);
    return null;
  }
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFields
      }
    }
    ${CART_FRAGMENT}
  `;

  try {
    const data = await shopifyFetch<{ cart: any }>(query, { cartId }, { cache: "no-store" });

    if (!data.cart) return null;

    return transformCart(data.cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<ShopifyCart | null> {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  try {
    const data = await shopifyFetch<any>(
      query,
      {
        cartId,
        lines: [{ merchandiseId: variantId, quantity }],
      },
      { cache: "no-store" }
    );

    if (data.cartLinesAdd?.userErrors?.length) {
      console.error("Add to cart errors:", data.cartLinesAdd.userErrors);
      return null;
    }

    return transformCart(data.cartLinesAdd.cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return null;
  }
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart | null> {
  if (quantity <= 0) {
    return removeFromCart(cartId, lineId);
  }

  const query = `
    mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  try {
    const data = await shopifyFetch<any>(
      query,
      {
        cartId,
        lines: [{ id: lineId, quantity }],
      },
      { cache: "no-store" }
    );

    if (data.cartLinesUpdate?.userErrors?.length) {
      console.error("Update cart errors:", data.cartLinesUpdate.userErrors);
      return null;
    }

    return transformCart(data.cartLinesUpdate.cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    return null;
  }
}

export async function removeFromCart(
  cartId: string,
  lineId: string
): Promise<ShopifyCart | null> {
  const query = `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  try {
    const data = await shopifyFetch<any>(
      query,
      { cartId, lineIds: [lineId] },
      { cache: "no-store" }
    );

    if (data.cartLinesRemove?.userErrors?.length) {
      console.error("Remove from cart errors:", data.cartLinesRemove.userErrors);
      return null;
    }

    return transformCart(data.cartLinesRemove.cart);
  } catch (error) {
    console.error("Error removing from cart:", error);
    return null;
  }
}

function transformCart(shopifyCart: any): ShopifyCart {
  const subtotalAmount = parseFloat(shopifyCart.cost?.subtotalAmount?.amount ?? "0");
  const totalAmount = parseFloat(shopifyCart.cost?.totalAmount?.amount ?? "0");

  const items: ShopifyCartItem[] = shopifyCart.lines?.edges?.map((edge: any) => {
    const line = edge.node;
    const product = transformProduct(line.merchandise.product);

    return {
      id: line.id,
      productId: product.id,
      quantity: line.quantity,
      product,
    };
  }) ?? [];

  return {
    id: shopifyCart.id,
    items,
    checkoutUrl: shopifyCart.checkoutUrl,
    subtotalCents: Math.round(subtotalAmount * 100),
    totalCents: Math.round(totalAmount * 100),
    totalQuantity: shopifyCart.totalQuantity ?? 0,
  };
}

// ============================================================================
// Product Variant Helper
// ============================================================================

export async function getProductVariantId(productId: string): Promise<string | null> {
  const query = `
    query GetProductVariant($productId: ID!) {
      product(id: $productId) {
        variants(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<any>(query, { productId }, { cache: "no-store" });
    return data.product?.variants?.edges?.[0]?.node?.id ?? null;
  } catch {
    return null;
  }
}

export async function getProductVariantIdByHandle(handle: string): Promise<string | null> {
  const query = `
    query GetProductVariantByHandle($handle: String!) {
      product(handle: $handle) {
        variants(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<any>(query, { handle }, { cache: "no-store" });
    return data.product?.variants?.edges?.[0]?.node?.id ?? null;
  } catch {
    return null;
  }
}

// ============================================================================
// Re-export configuration utilities from centralized env module
// ============================================================================

export { isShopifyConfigured } from "@/lib/env";

export const shopifyConfig = {
  domain: env.shopify.storeDomain,
  storefrontToken: env.shopify.storefrontAccessToken,
  apiVersion: env.shopify.apiVersion,
};
