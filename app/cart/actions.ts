"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addToCart,
  setCartItemQty,
  removeFromCart,
  clearCart,
  findCartLineByProductId,
  getCartSafe,
} from "@/lib/shopify-cart";
import { getProductVariantIdByHandle } from "@/lib/shopify";

export async function addToCartAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const productHandle = String(formData.get("productHandle") ?? "");
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));
  const goToCart = formData.get("goToCart") === "1";

  if (!productId && !productHandle) return;

  // If we have a handle, we need to use it for adding to cart
  // The Shopify cart requires the variant ID, which we get from the product
  await addToCart(productId, quantity);

  revalidatePath("/cart");
  revalidatePath("/shop");

  if (goToCart) redirect("/cart");
}

export async function updateCartQtyAction(formData: FormData) {
  const lineId = String(formData.get("lineId") ?? "");
  const productId = String(formData.get("productId") ?? "");
  const quantity = Math.max(0, Number(formData.get("quantity") ?? 0));

  // Try to find line ID from product ID if not provided directly
  let targetLineId = lineId;
  if (!targetLineId && productId) {
    targetLineId = await findCartLineByProductId(productId) ?? "";
  }

  if (!targetLineId) return;

  await setCartItemQty(targetLineId, quantity);
  revalidatePath("/cart");
}

export async function removeCartItemAction(formData: FormData) {
  const lineId = String(formData.get("lineId") ?? "");
  const productId = String(formData.get("productId") ?? "");

  // Try to find line ID from product ID if not provided directly
  let targetLineId = lineId;
  if (!targetLineId && productId) {
    targetLineId = await findCartLineByProductId(productId) ?? "";
  }

  if (!targetLineId) return;

  await removeFromCart(targetLineId);
  revalidatePath("/cart");
}

export async function clearCartAction() {
  await clearCart();
  revalidatePath("/cart");
}

export async function redirectToCheckoutAction() {
  const cart = await getCartSafe();
  if (!cart?.checkoutUrl) {
    redirect("/cart");
  }
  redirect(cart.checkoutUrl);
}
