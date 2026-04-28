import { getCartCount } from "@/lib/shopify-cart";
import { getCurrentCustomer, isAuthenticated } from "@/app/account/actions";
import ShopNavClient from "@/components/shop/ShopNavClient";

export default async function ShopNav() {
  const [count, authenticated] = await Promise.all([
    getCartCount(),
    isAuthenticated(),
  ]);

  let user = null;
  if (authenticated) {
    const customer = await getCurrentCustomer();
    if (customer) {
      user = {
        name: [customer.firstName, customer.lastName].filter(Boolean).join(" ") || null,
        email: customer.email,
        image: null,
        isAdmin: false,
      };
    }
  }

  return (
    <ShopNavClient
      cartCount={count}
      user={user}
    />
  );
}
