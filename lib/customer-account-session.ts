/**
 * HttpOnly cookie session for Shopify Customer Account OAuth tokens.
 * Handles token storage, expiry checking, and automatic refresh.
 */

import { cookies } from "next/headers";
import { env, isCustomerAccountConfigured } from "@/lib/env";
import {
  normalizeShopHost,
  discoverOpenIdConfiguration,
  refreshAccessToken,
} from "@/lib/shopify-customer-account-auth";

export const CA_ACCESS_COOKIE = "shopify_ca_access";
export const CA_REFRESH_COOKIE = "shopify_ca_refresh";
export const CA_EXPIRES_COOKIE = "shopify_ca_expires_at";
export const CA_ID_TOKEN_COOKIE = "shopify_ca_id_token";

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

const REFRESH_BUFFER_MS = 120_000; // Refresh 2 minutes before expiry
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

export interface CustomerAccountSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  idToken?: string;
}

/**
 * Clear all Customer Account session cookies.
 */
export async function clearCustomerAccountCookies(): Promise<void> {
  try {
    const jar = await cookies();
    jar.delete(CA_ACCESS_COOKIE);
    jar.delete(CA_REFRESH_COOKIE);
    jar.delete(CA_EXPIRES_COOKIE);
    jar.delete(CA_ID_TOKEN_COOKIE);
  } catch (error) {
    console.error("[clearCustomerAccountCookies] Failed:", error);
  }
}

/**
 * Set Customer Account session cookies.
 */
export async function setCustomerAccountSession(tokens: {
  accessToken: string;
  refreshToken?: string;
  expiresInSeconds: number;
  idToken?: string;
}): Promise<void> {
  const jar = await cookies();
  const expiresAt = new Date(Date.now() + tokens.expiresInSeconds * 1000);

  jar.set(CA_ACCESS_COOKIE, tokens.accessToken, {
    ...cookieBase,
    expires: expiresAt,
  });

  if (tokens.refreshToken) {
    jar.set(CA_REFRESH_COOKIE, tokens.refreshToken, {
      ...cookieBase,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }

  jar.set(CA_EXPIRES_COOKIE, expiresAt.toISOString(), {
    ...cookieBase,
    expires: expiresAt,
  });

  if (tokens.idToken) {
    jar.set(CA_ID_TOKEN_COOKIE, tokens.idToken, {
      ...cookieBase,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }
}

/**
 * Check if a Customer Account session exists (without triggering refresh).
 * Useful for quick auth checks in middleware or UI.
 */
export async function hasCustomerAccountSession(): Promise<boolean> {
  try {
    const jar = await cookies();
    const access = jar.get(CA_ACCESS_COOKIE)?.value;
    const expRaw = jar.get(CA_EXPIRES_COOKIE)?.value;
    
    if (!access) return false;
    
    const expiresMs = expRaw ? new Date(expRaw).getTime() : 0;
    return expiresMs > Date.now();
  } catch {
    return false;
  }
}

/**
 * Get the current session info without refreshing.
 */
export async function getCustomerAccountSessionInfo(): Promise<CustomerAccountSession | null> {
  try {
    const jar = await cookies();
    const accessToken = jar.get(CA_ACCESS_COOKIE)?.value;
    const refreshToken = jar.get(CA_REFRESH_COOKIE)?.value;
    const expRaw = jar.get(CA_EXPIRES_COOKIE)?.value;
    const idToken = jar.get(CA_ID_TOKEN_COOKIE)?.value;
    
    if (!accessToken) return null;
    
    return {
      accessToken,
      refreshToken,
      expiresAt: expRaw ? new Date(expRaw) : new Date(0),
      idToken,
    };
  } catch {
    return null;
  }
}

/**
 * Returns a valid Customer Account API bearer token, refreshing when close to expiry.
 * Returns null if no valid session exists or refresh fails.
 */
export async function getCustomerAccountAccessToken(): Promise<string | null> {
  if (!isCustomerAccountConfigured()) {
    return null;
  }
  
  const jar = await cookies();
  const access = jar.get(CA_ACCESS_COOKIE)?.value;
  const refresh = jar.get(CA_REFRESH_COOKIE)?.value;
  const expRaw = jar.get(CA_EXPIRES_COOKIE)?.value;
  const clientId = env.shopify.customerAccountClientId;

  if (!access) return null;

  const expiresMs = expRaw ? new Date(expRaw).getTime() : 0;
  const now = Date.now();

  if (expiresMs > now + REFRESH_BUFFER_MS) {
    return access;
  }

  if (!refresh || !clientId) {
    return expiresMs > now ? access : null;
  }

  const host = normalizeShopHost(env.shopify.publicStoreDomain || env.shopify.storeDomain);
  if (!host) {
    return expiresMs > now ? access : null;
  }

  try {
    const oid = await discoverOpenIdConfiguration(host);
    if (!oid?.token_endpoint) {
      console.warn("[getCustomerAccountAccessToken] OIDC discovery failed");
      return expiresMs > now ? access : null;
    }

    const refreshResult = await refreshAccessToken({
      tokenEndpoint: oid.token_endpoint,
      clientId,
      refreshToken: refresh,
    });

    if (!refreshResult.ok) {
      console.error("[getCustomerAccountAccessToken] Refresh failed:", refreshResult.error);
      await clearCustomerAccountCookies();
      return null;
    }

    const t = refreshResult.tokens;
    const prevId = jar.get(CA_ID_TOKEN_COOKIE)?.value;
    
    // For headless Customer Account API, the refreshed OAuth access token 
    // works directly - no additional token exchange needed.
    await setCustomerAccountSession({
      accessToken: t.access_token,
      refreshToken: t.refresh_token ?? refresh,
      expiresInSeconds: t.expires_in,
      idToken: t.id_token ?? prevId,
    });

    return t.access_token;
  } catch (error) {
    console.error("[getCustomerAccountAccessToken] Unexpected error:", error);
    return expiresMs > now ? access : null;
  }
}
