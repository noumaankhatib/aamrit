import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import {
  normalizeShopHost,
  discoverOpenIdConfiguration,
  exchangeAuthorizationCode,
  getOAuthCallbackUrl,
} from "@/lib/shopify-customer-account-auth";
import { setCustomerAccountSession } from "@/lib/customer-account-session";

function loginWithError(message: string, baseUrl: string) {
  return NextResponse.redirect(
    new URL(`/account/login?error=${encodeURIComponent(message)}`, baseUrl)
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const baseUrl = `${url.origin}`;
  const oauthErr = url.searchParams.get("error_description") || url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const jar = await cookies();
  const savedState = jar.get("shopify_oauth_state")?.value;
  const verifier = jar.get("shopify_oauth_verifier")?.value;
  const redirectPath = jar.get("shopify_oauth_redirect")?.value ?? "/account";

  jar.delete("shopify_oauth_state");
  jar.delete("shopify_oauth_verifier");
  jar.delete("shopify_oauth_nonce");
  jar.delete("shopify_oauth_redirect");

  if (oauthErr) {
    return loginWithError(oauthErr, baseUrl);
  }

  const clientId = env.shopify.customerAccountClientId;
  if (!clientId) return loginWithError("missing_client_id", baseUrl);
  if (!code) return loginWithError("missing_code", baseUrl);
  if (!verifier) return loginWithError("missing_verifier_cookie", baseUrl);
  if (!state) return loginWithError("missing_state_param", baseUrl);
  if (!savedState) return loginWithError("missing_state_cookie", baseUrl);
  if (state !== savedState) return loginWithError("state_mismatch", baseUrl);

  const host = normalizeShopHost(env.shopify.publicStoreDomain || env.shopify.storeDomain);
  const oid = await discoverOpenIdConfiguration(host);
  if (!oid?.token_endpoint) {
    return loginWithError("discovery_failed", baseUrl);
  }

  const exchanged = await exchangeAuthorizationCode({
    tokenEndpoint: oid.token_endpoint,
    clientId,
    code,
    redirectUri: getOAuthCallbackUrl(),
    codeVerifier: verifier,
  });

  if (!exchanged.ok) {
    return loginWithError(exchanged.error, baseUrl);
  }

  const t = exchanged.tokens;

  await setCustomerAccountSession({
    accessToken: t.access_token,
    refreshToken: t.refresh_token,
    expiresInSeconds: t.expires_in || 3600,
    idToken: t.id_token,
  });

  const safePath =
    redirectPath.startsWith("/") && !redirectPath.startsWith("//")
      ? redirectPath
      : "/account";

  const origin = new URL(request.url).origin;
  const dest = `${origin}${safePath}`;
  return NextResponse.redirect(dest);
}
