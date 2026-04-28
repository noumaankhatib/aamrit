/**
 * Shopify Cart utilities with cookie-based cart ID persistence.
 * This layer abstracts cart operations and manages cart state across sessions.
 */

import { cookies } from "next/headers";
import {
  createCart,
  getCart as fetchCart,
  addToCart as shopifyAddToCart,
  updateCartLine,
  removeFromCart as shopifyRemoveFromCart,
  getProductVariantId,
  type ShopifyCart,
} from "@/lib/shopify";

const CART_COOKIE = "shopify_cart_id";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// ============================================================================
// Cookie Management
// ============================================================================

async function getCartIdFromCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

async function setCartIdCookie(cartId: string): Promise<void> {
  const store = await cookies();
  try {
    store.set(CART_COOKIE, cartId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: CART_COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
    });
  } catch {
    // RSC read context — ignore, will be set by next mutation
  }
}

async function clearCartCookie(): Promise<void> {
  const store = await cookies();
  try {
    store.delete(CART_COOKIE);
  } catch {
    // RSC read context — ignore
  }
}

// ============================================================================
// Cart Operations
// ============================================================================

/**
 * Get the current cart, creating one if necessary.
 * Returns null if Shopify is not configured or cart creation fails.
 */
export async function getOrCreateCart(): Promise<ShopifyCart | null> {
  const cartId = await getCartIdFromCookie();

  if (cartId) {
    const cart = await fetchCart(cartId);
    if (cart) return cart;
    // Cart ID was invalid, clear it
    await clearCartCookie();
  }

  // Create new cart
  const newCart = await createCart();
  if (newCart) {
    await setCartIdCookie(newCart.id);
  }
  return newCart;
}

/**
 * Get the current cart without creating one.
 * Returns null if no cart exists.
 */
export async function getCartSafe(): Promise<ShopifyCart | null> {
  const cartId = await getCartIdFromCookie();
  if (!cartId) return null;

  const cart = await fetchCart(cartId);
  if (!cart) {
    await clearCartCookie();
    return null;
  }

  return cart;
}

/**
 * Get cart count for displaying in navigation.
 */
export async function getCartCount(): Promise<number> {
  const cart = await getCartSafe();
  return cart?.totalQuantity ?? 0;
}

/**
 * Add a product to the cart by product ID.
 * Creates a cart if one doesn't exist.
 */
export async function addToCart(productId: string, quantity = 1): Promise<ShopifyCart | null> {
  const cart = await getOrCreateCart();
  if (!cart) return null;

  // Get the variant ID for the product
  const variantId = await getProductVariantId(productId);
  if (!variantId) {
    console.error("Could not find variant for product:", productId);
    return null;
  }

  const updatedCart = await shopifyAddToCart(cart.id, variantId, quantity);
  return updatedCart;
}

/**
 * Update the quantity of a cart line item.
 */
export async function setCartItemQty(lineId: string, quantity: number): Promise<ShopifyCart | null> {
  const cart = await getCartSafe();
  if (!cart) return null;

  const updatedCart = await updateCartLine(cart.id, lineId, quantity);
  return updatedCart;
}

/**
 * Remove an item from the cart by line ID.
 */
export async function removeFromCart(lineId: string): Promise<ShopifyCart | null> {
  const cart = await getCartSafe();
  if (!cart) return null;

  const updatedCart = await shopifyRemoveFromCart(cart.id, lineId);
  return updatedCart;
}

/**
 * Clear the cart by creating a new empty one.
 */
export async function clearCart(): Promise<void> {
  await clearCartCookie();
}

/**
 * Get the checkout URL for the current cart.
 */
export async function getCheckoutUrl(): Promise<string | null> {
  const cart = await getCartSafe();
  return cart?.checkoutUrl ?? null;
}

// ============================================================================
// Cart Data Transformations (for compatibility with existing UI)
// ============================================================================

/**
 * Transform Shopify cart to match the existing cart page data shape.
 * This provides backward compatibility with the current UI components.
 */
export interface CartPageData {
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    product: {
      id: string;
      slug: string;
      name: string;
      variety: string;
      priceCents: number;
      weightGrams: number;
      imageUrl: string;
    };
  }>;
  checkoutUrl: string;
}

export async function getCartForPage(): Promise<CartPageData | null> {
  const cart = await getCartSafe();
  if (!cart) return null;

  return {
    items: cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        slug: item.product.slug,
        name: item.product.name,
        variety: item.product.variety,
        priceCents: item.product.priceCents,
        weightGrams: item.product.weightGrams,
        imageUrl: item.product.imageUrl,
      },
    })),
    checkoutUrl: cart.checkoutUrl,
  };
}

/**
 * Find a cart line ID by product ID.
 * Useful when the UI only has product ID but needs line ID for updates.
 */
export async function findCartLineByProductId(productId: string): Promise<string | null> {
  const cart = await getCartSafe();
  if (!cart) return null;

  const line = cart.items.find((item) => item.productId === productId);
  return line?.id ?? null;
}
