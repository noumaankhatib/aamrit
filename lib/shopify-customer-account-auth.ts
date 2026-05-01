/**
 * Shopify Customer Account API — OAuth (PKCE) helpers.
 * Hosted login supports Shopify's default methods (often email → one-time code).
 * @see https://shopify.dev/docs/api/customer#authentication
 */

import crypto from "crypto";
import { env } from "@/lib/env";

/**
 * Extract shop ID from the store domain for Customer Account API authentication.
 * The Customer Account API uses shop ID-based URLs, not myshopify domain.
 */
export function getShopId(): string | null {
  return process.env.SHOPIFY_SHOP_ID ?? null;
}

export function normalizeShopHost(domain: string): string {
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "").split("/")[0] ?? "";
}

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function generateOAuthSecret(bytes = 32): string {
  return base64UrlEncode(crypto.randomBytes(bytes));
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const hash = crypto.createHash("sha256").update(verifier).digest();
  return base64UrlEncode(hash);
}

export type OpenIdConfiguration = {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
};

/**
 * Get Customer Account API endpoints using the shop ID.
 * These are static endpoints based on the Shopify shop ID.
 */
export function getCustomerAccountEndpoints(shopId: string): OpenIdConfiguration {
  return {
    authorization_endpoint: `https://shopify.com/authentication/${shopId}/oauth/authorize`,
    token_endpoint: `https://shopify.com/authentication/${shopId}/oauth/token`,
    end_session_endpoint: `https://shopify.com/authentication/${shopId}/logout`,
  };
}

/**
 * Discover OpenID configuration. First tries shop ID-based endpoints (preferred),
 * then falls back to myshopify domain discovery.
 */
export async function discoverOpenIdConfiguration(
  shopHost: string
): Promise<OpenIdConfiguration | null> {
  const shopId = getShopId();
  
  if (shopId) {
    return getCustomerAccountEndpoints(shopId);
  }
  
  const url = `https://${shopHost}/.well-known/openid-configuration`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("[discoverOpenIdConfiguration] Failed:", error);
    return null;
  }
}

/**
 * Get Customer Account API GraphQL endpoint.
 */
export async function discoverCustomerAccountGraphqlUrl(shopHost: string): Promise<string | null> {
  const shopId = getShopId();
  
  if (shopId) {
    return `https://shopify.com/${shopId}/account/customer/api/2024-10/graphql`;
  }
  
  const url = `https://${shopHost}/.well-known/customer-account-api`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { graphql_api?: string };
    return data.graphql_api ?? null;
  } catch (error) {
    console.error("[discoverCustomerAccountGraphqlUrl] Failed:", error);
    return null;
  }
}

function getAppOrigin(): string {
  const u = env.appUrl.replace(/\/$/, "");
  return u.startsWith("http") ? u : `https://${u}`;
}

function requestHeaders(): HeadersInit {
  const origin = getAppOrigin();
  return {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
    "User-Agent": "AamritStorefront/1.0",
    Origin: origin,
  };
}

export type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  id_token?: string;
  token_type?: string;
};

export async function exchangeAuthorizationCode(params: {
  tokenEndpoint: string;
  clientId: string;
  code: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<{ ok: true; tokens: TokenResponse } | { ok: false; error: string }> {
  const body = new URLSearchParams();
  body.append("grant_type", "authorization_code");
  body.append("client_id", params.clientId);
  body.append("redirect_uri", params.redirectUri);
  body.append("code", params.code);
  body.append("code_verifier", params.codeVerifier);

  const res = await fetch(params.tokenEndpoint, {
    method: "POST",
    headers: requestHeaders(),
    body,
  });

  const text = await res.text();
  if (!res.ok) {
    try {
      const j = JSON.parse(text) as { error_description?: string; error?: string };
      return {
        ok: false,
        error: j.error_description || j.error || `Token exchange failed (${res.status})`,
      };
    } catch {
      return { ok: false, error: `Token exchange failed (${res.status})` };
    }
  }

  const tokens = JSON.parse(text) as TokenResponse;
  if (!tokens.access_token) {
    return { ok: false, error: "No access_token in response" };
  }
  return { ok: true, tokens };
}

/**
 * Exchanges the OAuth access_token (JWT) for a shcat_-prefixed Customer Account API token.
 * Required because Shopify's GraphQL endpoint rejects raw OAuth tokens.
 */
export async function exchangeForCustomerApiToken(params: {
  tokenEndpoint: string;
  clientId: string;
  oauthAccessToken: string;
}): Promise<{ ok: true; tokens: TokenResponse } | { ok: false; error: string }> {
  // Match Shopify Hydrogen's exact token-exchange request shape.
  // Reference: github.com/Shopify/hydrogen packages/hydrogen/src/customer/auth.helpers.ts
  // Key gotchas: grant_type is token-exchange (not jwt-bearer);
  // field is "scopes" (plural, NOT "scope"); audience is the static
  // CUSTOMER_API_CLIENT_ID UUID; Origin header must be the app origin.
  const body = new URLSearchParams();
  body.append("grant_type", "urn:ietf:params:oauth:grant-type:token-exchange");
  body.append("client_id", params.clientId);
  body.append("audience", "30243aa5-17c1-465a-8493-944bcc4e88aa");
  body.append("subject_token", params.oauthAccessToken);
  body.append("subject_token_type", "urn:ietf:params:oauth:token-type:access_token");
  body.append("scopes", "https://api.customers.com/auth/customer.graphql");

  const res = await fetch(params.tokenEndpoint, {
    method: "POST",
    headers: requestHeaders(),
    body,
  });

  const text = await res.text();
  if (!res.ok) {
    try {
      const j = JSON.parse(text) as { error_description?: string; error?: string };
      return {
        ok: false,
        error: j.error_description || j.error || `Token-exchange failed (${res.status})`,
      };
    } catch {
      return { ok: false, error: `Token-exchange failed (${res.status}): ${text.slice(0, 200)}` };
    }
  }

  const tokens = JSON.parse(text) as TokenResponse;
  if (!tokens.access_token) {
    return { ok: false, error: "No access_token in token-exchange response" };
  }
  return { ok: true, tokens };
}

export async function refreshAccessToken(params: {
  tokenEndpoint: string;
  clientId: string;
  refreshToken: string;
}): Promise<{ ok: true; tokens: TokenResponse } | { ok: false; error: string }> {
  const body = new URLSearchParams();
  body.append("grant_type", "refresh_token");
  body.append("client_id", params.clientId);
  body.append("refresh_token", params.refreshToken);

  const res = await fetch(params.tokenEndpoint, {
    method: "POST",
    headers: requestHeaders(),
    body,
  });

  const text = await res.text();
  if (!res.ok) {
    try {
      const j = JSON.parse(text) as { error_description?: string; error?: string };
      return {
        ok: false,
        error: j.error_description || j.error || `Refresh failed (${res.status})`,
      };
    } catch {
      return { ok: false, error: `Refresh failed (${res.status})` };
    }
  }

  const tokens = JSON.parse(text) as TokenResponse;
  if (!tokens.access_token) {
    return { ok: false, error: "No access_token from refresh" };
  }
  return { ok: true, tokens };
}

export function buildAuthorizationUrl(params: {
  authorizationEndpoint: string;
  clientId: string;
  redirectUri: string;
  state: string;
  nonce: string;
  codeChallenge: string;
  loginHint?: string;
  locale?: string;
  regionCountry?: string;
}): string {
  const u = new URL(params.authorizationEndpoint);
  u.searchParams.set("scope", "openid email customer-account-api:full");
  u.searchParams.set("client_id", params.clientId);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("redirect_uri", params.redirectUri);
  u.searchParams.set("state", params.state);
  u.searchParams.set("nonce", params.nonce);
  u.searchParams.set("code_challenge", params.codeChallenge);
  u.searchParams.set("code_challenge_method", "S256");
  if (params.loginHint) {
    u.searchParams.set("login_hint", params.loginHint);
  }
  if (params.locale) {
    u.searchParams.set("locale", params.locale);
  }
  if (params.regionCountry) {
    u.searchParams.set("region_country", params.regionCountry);
  }
  return u.toString();
}

export function getOAuthCallbackUrl(): string {
  const base = getAppOrigin();
  return `${base}/api/auth/shopify-account/callback`;
}
