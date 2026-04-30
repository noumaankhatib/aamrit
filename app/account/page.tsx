import { redirect } from "next/navigation";
import { getCurrentCustomer, getMyOrders, isAuthenticated } from "./actions";
import AccountTabs from "@/components/account/AccountTabs";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    console.log("[/account] not authenticated, redirecting to login");
    redirect("/account/login?error=not_authenticated");
  }

  const customer = await getCurrentCustomer();

  if (!customer) {
    console.log("[/account] customer fetch returned null despite auth=true");
    redirect("/account/login?error=customer_fetch_failed");
  }

  const orders = await getMyOrders(10).catch((e) => {
    console.error("[/account] getMyOrders failed:", e);
    return [];
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
        {/* Header */}
        <div className="bg-charcoal text-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-4xl">
                  Hello, {customer.firstName || "there"}!
                </h1>
                <p className="mt-2 text-white/60">{customer.email}</p>
              </div>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl border border-white/20 hover:border-white/40 text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <AccountTabs customer={customer} orders={orders} />
        </div>
      </div>
  );
}
