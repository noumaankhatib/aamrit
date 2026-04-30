"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  customerLogin,
  customerRegister,
  customerLogout,
  getCustomer,
  updateCustomer,
  recoverPassword,
  getCustomerOrders,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type ShopifyCustomer,
  type ShopifyAddress,
  type ShopifyOrder,
} from "@/lib/shopify-customer";
import {
  getCustomerAccountAccessToken,
  clearCustomerAccountCookies,
} from "@/lib/customer-account-session";
import {
  fetchCustomerAccountProfile,
  fetchCustomerAccountOrders,
  fetchCustomerAccountOrderById,
  updateCustomerAccountProfile,
  createCustomerAccountAddress,
  updateCustomerAccountAddress,
  deleteCustomerAccountAddress,
  setDefaultCustomerAccountAddress,
  type ShopifyOrderDetail,
  type CustomerAddressInput,
} from "@/lib/shopify-customer-account-data";
import { revalidatePath } from "next/cache";

const CUSTOMER_TOKEN_COOKIE = "shopify_customer_token";
const CUSTOMER_TOKEN_EXPIRY_COOKIE = "shopify_customer_token_expiry";

// ============================================================================
// Cookie Management (legacy Storefront customer access token)
// ============================================================================

async function setAuthCookies(accessToken: string, expiresAt: string) {
  const cookieStore = await cookies();
  const expiryDate = new Date(expiresAt);

  cookieStore.set(CUSTOMER_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiryDate,
    path: "/",
  });

  cookieStore.set(CUSTOMER_TOKEN_EXPIRY_COOKIE, expiresAt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiryDate,
    path: "/",
  });
}

async function clearLegacyAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_TOKEN_COOKIE);
  cookieStore.delete(CUSTOMER_TOKEN_EXPIRY_COOKIE);
}

export async function getCustomerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value ?? null;
}

/** True if Customer Account OAuth session or valid legacy storefront token exists. */
export async function isAuthenticated(): Promise<boolean> {
  const ca = await getCustomerAccountAccessToken();
  if (ca) return true;

  const token = await getCustomerToken();
  if (!token) return false;

  const cookieStore = await cookies();
  const expiry = cookieStore.get(CUSTOMER_TOKEN_EXPIRY_COOKIE)?.value;

  if (expiry && new Date(expiry) < new Date()) {
    await clearLegacyAuthCookies();
    return false;
  }

  return true;
}

// ============================================================================
// Authentication Actions
// ============================================================================

export async function loginAction(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirectTo") as string | null;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { token, error } = await customerLogin(email, password);

  if (error || !token) {
    return { error: error ?? "Invalid email or password" };
  }

  await clearCustomerAccountCookies();
  await setAuthCookies(token.accessToken, token.expiresAt);

  redirect(redirectTo || "/account");
}

export async function registerAction(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string | null;
  const lastName = formData.get("lastName") as string | null;
  const phone = formData.get("phone") as string | null;
  const acceptsMarketing = formData.get("acceptsMarketing") === "on";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const { customer, error: regError } = await customerRegister({
    email,
    password,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    phone: phone || undefined,
    acceptsMarketing,
  });

  if (regError || !customer) {
    return { error: regError ?? "Failed to create account" };
  }

  const { token, error: loginError } = await customerLogin(email, password);

  if (loginError || !token) {
    redirect("/account/login?registered=true");
  }

  await clearCustomerAccountCookies();
  await setAuthCookies(token.accessToken, token.expiresAt);

  redirect("/account");
}

export async function logoutAction(): Promise<void> {
  const legacy = await getCustomerToken();
  if (legacy) {
    await customerLogout(legacy);
  }

  await clearLegacyAuthCookies();
  await clearCustomerAccountCookies();
  redirect("/");
}

export async function recoverPasswordAction(
  _prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required", success: false };
  }

  const { success, error } = await recoverPassword(email);

  if (!success) {
    return { error: error ?? "Failed to send recovery email", success: false };
  }

  return { error: null, success: true };
}

// ============================================================================
// Profile Actions
// ============================================================================

export async function getCurrentCustomer(): Promise<ShopifyCustomer | null> {
  const caToken = await getCustomerAccountAccessToken();
  if (caToken) {
    const { customer } = await fetchCustomerAccountProfile(caToken);
    return customer;
  }

  const legacy = await getCustomerToken();
  if (!legacy) return null;

  const { customer } = await getCustomer(legacy);
  return customer;
}

export async function updateProfileAction(
  _prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const firstName = formData.get("firstName") as string | null;
  const lastName = formData.get("lastName") as string | null;
  const email = formData.get("email") as string | null;
  const phone = formData.get("phone") as string | null;
  const acceptsMarketing = formData.get("acceptsMarketing") === "on";

  const caToken = await getCustomerAccountAccessToken();
  if (caToken) {
    const result = await updateCustomerAccountProfile(caToken, {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    });
    if (!result.ok) {
      return { error: result.error ?? "Failed to update profile", success: false };
    }
    return { error: null, success: true };
  }

  const token = await getCustomerToken();
  if (!token) {
    return { error: "Not authenticated", success: false };
  }

  const { customer, error } = await updateCustomer(token, {
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    email: email || undefined,
    phone: phone || undefined,
    acceptsMarketing,
  });

  if (error || !customer) {
    return { error: error ?? "Failed to update profile", success: false };
  }

  return { error: null, success: true };
}

// ============================================================================
// Order Actions
// ============================================================================

export async function getMyOrders(first = 10): Promise<ShopifyOrder[]> {
  const caToken = await getCustomerAccountAccessToken();
  if (caToken) {
    const { orders } = await fetchCustomerAccountOrders(caToken, first);
    return orders;
  }

  const token = await getCustomerToken();
  if (!token) return [];

  const { orders } = await getCustomerOrders(token, first);
  return orders;
}

export async function getOrderById(orderId: string): Promise<ShopifyOrderDetail | null> {
  const caToken = await getCustomerAccountAccessToken();
  if (!caToken) return null;
  const { order } = await fetchCustomerAccountOrderById(caToken, orderId);
  return order;
}

// ============================================================================
// Address Actions (Customer Account API preferred, legacy Storefront fallback)
// ============================================================================

function readAddressInput(formData: FormData): CustomerAddressInput & {
  province?: string | null;
  countryCode?: string | null;
} {
  return {
    firstName: (formData.get("firstName") as string | null)?.trim() || null,
    lastName: (formData.get("lastName") as string | null)?.trim() || null,
    company: (formData.get("company") as string | null)?.trim() || null,
    address1: (formData.get("address1") as string | null)?.trim() || null,
    address2: (formData.get("address2") as string | null)?.trim() || null,
    city: (formData.get("city") as string | null)?.trim() || null,
    zoneCode: (formData.get("zoneCode") as string | null)?.trim() || null,
    territoryCode:
      ((formData.get("territoryCode") as string | null)?.trim() ||
        (formData.get("countryCode") as string | null)?.trim() ||
        "IN") as string,
    zip: (formData.get("zip") as string | null)?.trim() || null,
    phoneNumber: (formData.get("phoneNumber") as string | null)?.trim() || null,
  };
}

export async function addAddressAction(
  _prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const setDefault = formData.get("setDefault") === "on";

  const ca = await getCustomerAccountAccessToken();
  if (ca) {
    const input = readAddressInput(formData);
    if (!input.address1 || !input.city || !input.zip) {
      return { error: "Address line 1, city, and PIN code are required", success: false };
    }
    const result = await createCustomerAccountAddress(ca, input, setDefault);
    if (!result.ok) {
      return { error: result.error ?? "Failed to add address", success: false };
    }
    revalidatePath("/account");
    return { error: null, success: true };
  }

  const token = await getCustomerToken();
  if (!token) return { error: "Not authenticated", success: false };

  const address: Omit<ShopifyAddress, "id"> = {
    firstName: formData.get("firstName") as string | null,
    lastName: formData.get("lastName") as string | null,
    company: formData.get("company") as string | null,
    address1: formData.get("address1") as string | null,
    address2: formData.get("address2") as string | null,
    city: formData.get("city") as string | null,
    province: formData.get("province") as string | null,
    provinceCode: formData.get("zoneCode") as string | null,
    country: formData.get("country") as string | null,
    countryCode: (formData.get("territoryCode") as string | null) ?? "IN",
    zip: formData.get("zip") as string | null,
    phone: formData.get("phoneNumber") as string | null,
  };

  const { address: newAddress, error } = await createAddress(token, address);
  if (error || !newAddress) {
    return { error: error ?? "Failed to add address", success: false };
  }
  revalidatePath("/account");
  return { error: null, success: true };
}

export async function updateAddressAction(
  addressId: string,
  _prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const setDefault = formData.get("setDefault") === "on";

  const ca = await getCustomerAccountAccessToken();
  if (ca) {
    const input = readAddressInput(formData);
    const result = await updateCustomerAccountAddress(ca, addressId, input, setDefault);
    if (!result.ok) {
      return { error: result.error ?? "Failed to update address", success: false };
    }
    revalidatePath("/account");
    return { error: null, success: true };
  }

  const token = await getCustomerToken();
  if (!token) return { error: "Not authenticated", success: false };

  const address: Partial<Omit<ShopifyAddress, "id">> = {
    firstName: formData.get("firstName") as string | null,
    lastName: formData.get("lastName") as string | null,
    company: formData.get("company") as string | null,
    address1: formData.get("address1") as string | null,
    address2: formData.get("address2") as string | null,
    city: formData.get("city") as string | null,
    province: formData.get("province") as string | null,
    provinceCode: formData.get("zoneCode") as string | null,
    country: formData.get("country") as string | null,
    countryCode: (formData.get("territoryCode") as string | null) ?? "IN",
    zip: formData.get("zip") as string | null,
    phone: formData.get("phoneNumber") as string | null,
  };

  const { error } = await updateAddress(token, addressId, address);
  if (error) return { error, success: false };
  revalidatePath("/account");
  return { error: null, success: true };
}

export async function deleteAddressAction(addressId: string): Promise<{ error: string | null }> {
  const ca = await getCustomerAccountAccessToken();
  if (ca) {
    const result = await deleteCustomerAccountAddress(ca, addressId);
    if (!result.ok) return { error: result.error ?? "Failed to delete address" };
    revalidatePath("/account");
    return { error: null };
  }

  const token = await getCustomerToken();
  if (!token) return { error: "Not authenticated" };
  const { error } = await deleteAddress(token, addressId);
  if (error) return { error };
  revalidatePath("/account");
  return { error: null };
}

export async function setDefaultAddressAction(addressId: string): Promise<{ error: string | null }> {
  const ca = await getCustomerAccountAccessToken();
  if (ca) {
    const result = await setDefaultCustomerAccountAddress(ca, addressId);
    if (!result.ok) return { error: result.error ?? "Failed to set default" };
    revalidatePath("/account");
    return { error: null };
  }

  const token = await getCustomerToken();
  if (!token) return { error: "Not authenticated" };
  const { error } = await setDefaultAddress(token, addressId);
  if (error) return { error };
  revalidatePath("/account");
  return { error: null };
}
