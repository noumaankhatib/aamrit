/**
 * Centralized environment configuration for Shopify-powered storefront.
 * This is the single source of truth for all Shopify configuration.
 */

const isPlaceholder = (v: string | undefined | null): boolean =>
  !v || v.includes("placeholder") || v.includes("replace-with") || v.startsWith("dev-only");

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",

  shopify: {
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN ?? "",
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "",
    storefrontPrivateToken: process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ?? "",
    publicStoreDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "",
    shopId: process.env.SHOPIFY_SHOP_ID ?? "",
    customerAccountClientId: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID ?? "",
    adminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ?? "",
    clientId: process.env.SHOPIFY_CLIENT_ID ?? "",
    
    /** Storefront API version - centralized for easy upgrades */
    apiVersion: "2024-10",
  },

  admin: {
    email: process.env.ADMIN_EMAIL ?? "admin@aamrit.local",
    emails: (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean),
  },
} as const;

/**
 * Feature flags based on configuration availability
 */
export const features = {
  /** Storefront API is configured with domain and access token */
  shopify:
    !isPlaceholder(env.shopify.storeDomain) &&
    !isPlaceholder(env.shopify.storefrontAccessToken),
  
  /** Customer Account API is configured with shop ID and client ID */
  customerAccount:
    !isPlaceholder(env.shopify.shopId) &&
    !isPlaceholder(env.shopify.customerAccountClientId),
  
  /** Admin API is configured */
  adminApi: !isPlaceholder(env.shopify.adminAccessToken),
};

/**
 * Check if Shopify Storefront API is properly configured.
 * This is the SINGLE source of truth - do not create duplicate checks.
 */
export function isShopifyConfigured(): boolean {
  return features.shopify;
}

/**
 * Check if Customer Account API is properly configured
 */
export function isCustomerAccountConfigured(): boolean {
  return features.customerAccount;
}

/**
 * Check if Admin API is properly configured
 */
export function isAdminApiConfigured(): boolean {
  return features.adminApi;
}

/**
 * Get the Storefront API URL
 */
export function getStorefrontApiUrl(): string {
  return `https://${env.shopify.storeDomain}/api/${env.shopify.apiVersion}/graphql.json`;
}

/**
 * Get the Admin API URL
 */
export function getAdminApiUrl(): string {
  return `https://${env.shopify.storeDomain}/admin/api/${env.shopify.apiVersion}/graphql.json`;
}

/**
 * Get the Storefront access token.
 * Note: The private token (shpat_*) is for Admin API, not Storefront API.
 * Storefront API uses the public access token for both client and server contexts.
 */
export function getStorefrontToken(): string {
  return env.shopify.storefrontAccessToken;
}
