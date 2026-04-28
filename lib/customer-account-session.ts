/**
 * HttpOnly cookie session for Shopify Customer Account OAuth tokens.
 */

import { cookies } from "next/headers";
import { env } from "@/lib/env";
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

export async function clearCustomerAccountCookies(): Promise<void> {
  const jar = await cookies();
  jar.delete(CA_ACCESS_COOKIE);
  jar.delete(CA_REFRESH_COOKIE);
  jar.delete(CA_EXPIRES_COOKIE);
  jar.delete(CA_ID_TOKEN_COOKIE);
}

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
      maxAge: 60 * 60 * 24 * 90,
    });
  }

  jar.set(CA_EXPIRES_COOKIE, expiresAt.toISOString(), {
    ...cookieBase,
    expires: expiresAt,
  });

  if (tokens.idToken) {
    jar.set(CA_ID_TOKEN_COOKIE, tokens.idToken, {
      ...cookieBase,
      maxAge: 60 * 60 * 24 * 90,
    });
  }
}

/**
 * Returns a valid Customer Account API bearer token, refreshing when close to expiry.
 */
export async function getCustomerAccountAccessToken(): Promise<string | null> {
  const jar = await cookies();
  const access = jar.get(CA_ACCESS_COOKIE)?.value;
  const refresh = jar.get(CA_REFRESH_COOKIE)?.value;
  const expRaw = jar.get(CA_EXPIRES_COOKIE)?.value;
  const clientId = env.shopify.customerAccountClientId;

  if (!access) return null;

  const expiresMs = expRaw ? new Date(expRaw).getTime() : 0;
  const bufferMs = 120_000;

  if (expiresMs > Date.now() + bufferMs) {
    return access;
  }

  if (!refresh || !clientId) {
    return expiresMs > Date.now() ? access : null;
  }

  const host = normalizeShopHost(env.shopify.publicStoreDomain || env.shopify.storeDomain);
  if (!host) return expiresMs > Date.now() ? access : null;

  const oid = await discoverOpenIdConfiguration(host);
  if (!oid) return expiresMs > Date.now() ? access : null;

  const result = await refreshAccessToken({
    tokenEndpoint: oid.token_endpoint,
    clientId,
    refreshToken: refresh,
  });

  if (!result.ok) {
    await clearCustomerAccountCookies();
    return null;
  }

  const t = result.tokens;
  const prevId = jar.get(CA_ID_TOKEN_COOKIE)?.value;
  await setCustomerAccountSession({
    accessToken: t.access_token,
    refreshToken: t.refresh_token ?? refresh,
    expiresInSeconds: t.expires_in,
    idToken: t.id_token ?? prevId,
  });

  return t.access_token;
}
