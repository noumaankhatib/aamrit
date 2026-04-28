/**
 * Centralized environment configuration for Shopify-powered storefront.
 */

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

  shopify: {
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN ?? "",
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "",
    publicStoreDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "",
    /** Headless / Hydrogen → Customer Account API — enables OAuth login (email + code on Shopify UI). */
    customerAccountClientId: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID ?? "",
  },

  admin: {
    email: process.env.ADMIN_EMAIL ?? "admin@aamrit.local",
  },
} as const;

const isPlaceholder = (v: string) =>
  !v || v.includes("placeholder") || v.includes("replace-with") || v.startsWith("dev-only");

export const features = {
  shopify:
    !isPlaceholder(env.shopify.storeDomain) &&
    !isPlaceholder(env.shopify.storefrontAccessToken),
};

/**
 * Check if Shopify is properly configured
 */
export function isShopifyConfigured(): boolean {
  return features.shopify;
}
