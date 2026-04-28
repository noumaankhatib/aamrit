import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import {
  normalizeShopHost,
  discoverOpenIdConfiguration,
  generateOAuthSecret,
  generateCodeChallenge,
  buildAuthorizationUrl,
  getOAuthCallbackUrl,
} from "@/lib/shopify-customer-account-auth";

const TRANSIT_MAX_AGE = 600;

function safeRedirectPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/account";
  return raw;
}

export async function GET(request: Request) {
  const clientId = env.shopify.customerAccountClientId;
  if (!clientId) {
    return NextResponse.redirect(
      new URL("/account/login?error=oauth_not_configured", request.url)
    );
  }

  const url = new URL(request.url);
  const loginHint = url.searchParams.get("login_hint")?.trim() || undefined;
  const redirectTo = safeRedirectPath(url.searchParams.get("redirectTo"));

  const host = normalizeShopHost(env.shopify.publicStoreDomain || env.shopify.storeDomain);
  if (!host) {
    return NextResponse.redirect(
      new URL("/account/login?error=missing_shop_domain", request.url)
    );
  }

  const oid = await discoverOpenIdConfiguration(host);
  if (!oid?.authorization_endpoint || !oid.token_endpoint) {
    return NextResponse.redirect(
      new URL("/account/login?error=discovery_failed", request.url)
    );
  }

  const state = generateOAuthSecret();
  const nonce = generateOAuthSecret();
  const verifier = generateOAuthSecret(48);
  const challenge = await generateCodeChallenge(verifier);

  const jar = await cookies();
  const cookieOpts = {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: TRANSIT_MAX_AGE,
  };

  jar.set("shopify_oauth_state", state, cookieOpts);
  jar.set("shopify_oauth_verifier", verifier, cookieOpts);
  jar.set("shopify_oauth_nonce", nonce, cookieOpts);
  jar.set("shopify_oauth_redirect", redirectTo, cookieOpts);

  const authorizeUrl = buildAuthorizationUrl({
    authorizationEndpoint: oid.authorization_endpoint,
    clientId,
    redirectUri: getOAuthCallbackUrl(),
    state,
    nonce,
    codeChallenge: challenge,
    loginHint,
  });

  return NextResponse.redirect(authorizeUrl);
}
