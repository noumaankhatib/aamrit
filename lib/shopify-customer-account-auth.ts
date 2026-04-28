/**
 * Shopify Customer Account API — OAuth (PKCE) helpers.
 * Hosted login supports Shopify's default methods (often email → one-time code).
 * @see https://shopify.dev/docs/api/customer#authentication
 */

import crypto from "crypto";
import { env } from "@/lib/env";

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

export async function discoverOpenIdConfiguration(
  shopHost: string
): Promise<OpenIdConfiguration | null> {
  const url = `https://${shopHost}/.well-known/openid-configuration`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function discoverCustomerAccountGraphqlUrl(shopHost: string): Promise<string | null> {
  const url = `https://${shopHost}/.well-known/customer-account-api`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { graphql_api?: string };
  return data.graphql_api ?? null;
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
