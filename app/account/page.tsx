import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentCustomerWithError, getMyOrders, isAuthenticated } from "./actions";
import AccountTabs from "@/components/account/AccountTabs";

export const dynamic = "force-dynamic";

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ?? [];
  return adminEmails.includes(email.toLowerCase());
}

export default async function AccountPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    console.log("[/account] not authenticated, redirecting to login");
    redirect("/account/login?error=not_authenticated");
  }

  const { customer, error } = await getCurrentCustomerWithError();

  if (!customer) {
    const reason = error ? encodeURIComponent(error.slice(0, 200)) : "unknown";
    console.log("[/account] customer fetch failed:", error);
    redirect(`/account/login?error=cust_${reason}`);
  }

  const orders = await getMyOrders(10).catch((e) => {
    console.error("[/account] getMyOrders failed:", e);
    return [];
  });

  const isAdmin = isAdminEmail(customer.email);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
        {/* Header */}
        <div className="bg-charcoal text-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-serif text-3xl sm:text-4xl">
                    Hello, {customer.firstName || "there"}!
                  </h1>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-medium">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Admin
                    </span>
                  )}
                </div>
                <p className="mt-2 text-white/60">{customer.email}</p>
              </div>
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Panel
                  </Link>
                )}
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
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <AccountTabs customer={customer} orders={orders} isAdmin={isAdmin} />
        </div>
      </div>
  );
}
