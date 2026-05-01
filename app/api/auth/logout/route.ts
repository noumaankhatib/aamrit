import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { customerLogout } from "@/lib/shopify-customer";
import {
  clearCustomerAccountCookies,
  CA_ID_TOKEN_COOKIE,
} from "@/lib/customer-account-session";
import {
  getShopId,
  getCustomerAccountEndpoints,
} from "@/lib/shopify-customer-account-auth";
import { env } from "@/lib/env";

const CUSTOMER_TOKEN_COOKIE = "shopify_customer_token";
const CUSTOMER_TOKEN_EXPIRY_COOKIE = "shopify_customer_token_expiry";

/**
 * Logout handler that clears local sessions and optionally redirects
 * to Shopify's end_session_endpoint for full SSO logout.
 */
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const legacyToken = cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value;
  const idToken = cookieStore.get(CA_ID_TOKEN_COOKIE)?.value;

  if (legacyToken) {
    try {
      await customerLogout(legacyToken);
    } catch (error) {
      console.error("[logout] Legacy token revocation failed:", error);
    }
  }

  cookieStore.delete(CUSTOMER_TOKEN_COOKIE);
  cookieStore.delete(CUSTOMER_TOKEN_EXPIRY_COOKIE);
  await clearCustomerAccountCookies();

  const url = new URL(request.url);
  const fullLogout = url.searchParams.get("full") === "true";
  const returnTo = url.searchParams.get("returnTo") ?? "/";
  
  const shopId = getShopId();
  if (fullLogout && shopId && idToken) {
    const endpoints = getCustomerAccountEndpoints(shopId);
    if (endpoints.end_session_endpoint) {
      const logoutUrl = new URL(endpoints.end_session_endpoint);
      logoutUrl.searchParams.set("id_token_hint", idToken);
      const postLogoutUri = `${env.appUrl.replace(/\/$/, "")}${returnTo}`;
      logoutUrl.searchParams.set("post_logout_redirect_uri", postLogoutUri);
      
      return NextResponse.redirect(logoutUrl.toString());
    }
  }

  const baseUrl = new URL(request.url).origin;
  return NextResponse.redirect(`${baseUrl}${returnTo}`);
}

export async function GET(request: Request) {
  return POST(request);
}
