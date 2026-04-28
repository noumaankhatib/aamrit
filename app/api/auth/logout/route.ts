import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { customerLogout } from "@/lib/shopify-customer";
import { clearCustomerAccountCookies } from "@/lib/customer-account-session";

const CUSTOMER_TOKEN_COOKIE = "shopify_customer_token";
const CUSTOMER_TOKEN_EXPIRY_COOKIE = "shopify_customer_token_expiry";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value;

  if (token) {
    await customerLogout(token);
  }

  cookieStore.delete(CUSTOMER_TOKEN_COOKIE);
  cookieStore.delete(CUSTOMER_TOKEN_EXPIRY_COOKIE);
  await clearCustomerAccountCookies();

  redirect("/");
}

export async function GET() {
  return POST();
}
