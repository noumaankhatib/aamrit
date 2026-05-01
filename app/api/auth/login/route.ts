import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { customerLogin } from "@/lib/shopify-customer";
import { clearCustomerAccountCookies } from "@/lib/customer-account-session";

const CUSTOMER_TOKEN_COOKIE = "shopify_customer_token";
const CUSTOMER_TOKEN_EXPIRY_COOKIE = "shopify_customer_token_expiry";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { token, error } = await customerLogin(email, password);

    if (error || !token) {
      return NextResponse.json(
        { error: error ?? "Invalid email or password" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const expiryDate = new Date(token.expiresAt);

    await clearCustomerAccountCookies();

    cookieStore.set(CUSTOMER_TOKEN_COOKIE, token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiryDate,
      path: "/",
    });

    cookieStore.set(CUSTOMER_TOKEN_EXPIRY_COOKIE, token.expiresAt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiryDate,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[/api/auth/login] Error:", error);
    return NextResponse.json(
      { error: "An error occurred during sign in" },
      { status: 500 }
    );
  }
}
