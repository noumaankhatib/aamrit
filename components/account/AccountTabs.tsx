"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useActionState } from "react";
import type { ShopifyCustomer, ShopifyOrder } from "@/lib/shopify-customer";
import { updateProfileAction } from "@/app/account/actions";
import { formatINR } from "@/lib/money";
import AddressManager from "@/components/account/AddressManager";

interface AccountTabsProps {
  customer: ShopifyCustomer;
  orders: ShopifyOrder[];
  isAdmin?: boolean;
}

type Tab = "orders" | "profile" | "addresses" | "admin";

const VALID_TABS: Tab[] = ["orders", "profile", "addresses", "admin"];

function isTab(v: string | null): v is Tab {
  return v !== null && (VALID_TABS as string[]).includes(v);
}

export default function AccountTabs({ customer, orders, isAdmin = false }: AccountTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = isTab(searchParams.get("tab")) ? (searchParams.get("tab") as Tab) : "orders";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  useEffect(() => {
    const t = searchParams.get("tab");
    if (isTab(t) && t !== activeTab) setActiveTab(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function selectTab(tab: Tab) {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  }
  const [profileState, profileAction, isUpdating] = useActionState(updateProfileAction, {
    error: null,
    success: false,
  });

  const tabs: { id: Tab; label: string; count?: number; adminOnly?: boolean }[] = [
    { id: "orders", label: "Orders", count: orders.length },
    { id: "profile", label: "Profile" },
    { id: "addresses", label: "Addresses", count: customer.addresses.length },
    { id: "admin", label: "Admin", adminOnly: true },
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-cream-100/50 rounded-xl mb-8">
        {tabs.map((tab) => {
          if (tab.adminOnly && !isAdmin) {
            return null;
          }

          const isAdminTab = tab.id === "admin";
          const isDisabled = isAdminTab && !isAdmin;

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && selectTab(tab.id)}
              disabled={isDisabled}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                isDisabled
                  ? "text-charcoal/30 cursor-not-allowed"
                  : activeTab === tab.id
                  ? isAdminTab
                    ? "bg-gradient-to-r from-gold to-saffron text-white shadow-sm"
                    : "bg-white text-charcoal shadow-sm"
                  : "text-charcoal/60 hover:text-charcoal hover:bg-white/50"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                {isAdminTab && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
                {tab.label}
              </span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? isAdminTab
                      ? "bg-white/20 text-white"
                      : "bg-gold/10 text-saffron"
                    : "bg-charcoal/10 text-charcoal/60"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-charcoal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-charcoal mb-2">No orders yet</h3>
              <p className="text-charcoal/60 mb-6">
                When you place orders, they&apos;ll appear here.
              </p>
              <a href="/shop" className="btn-gold px-6 py-3 rounded-xl text-white font-medium">
                Start shopping
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="max-w-xl">
          <div className="bg-white rounded-2xl border border-cream-100 p-6 sm:p-8">
            <h2 className="font-serif text-xl text-charcoal mb-6">Personal Information</h2>

            {profileState.success && (
              <div className="mb-6 p-4 rounded-xl bg-leaf/10 border border-leaf/20 text-leaf-700 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Profile updated successfully!
              </div>
            )}

            {profileState.error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {profileState.error}
              </div>
            )}

            <form action={profileAction} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-charcoal mb-2">
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    defaultValue={customer.firstName || ""}
                    className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-charcoal mb-2">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    defaultValue={customer.lastName || ""}
                    className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                  Email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={customer.email}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-charcoal/70 cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-charcoal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-charcoal/50">Email cannot be changed. Contact support if needed.</p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-2">
                  Mobile number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-charcoal/60 text-sm">
                    <span>+91</span>
                    <span className="text-charcoal/30">|</span>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={customer.phone?.replace(/^\+91\s?/, "") || ""}
                    placeholder="9876543210"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="w-full pl-16 pr-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                  />
                </div>
                <p className="mt-1.5 text-xs text-charcoal/50">Used for order updates and delivery notifications</p>
              </div>

              <div className="flex items-start gap-3 p-4 bg-cream-50 rounded-xl">
                <input
                  type="checkbox"
                  id="acceptsMarketing"
                  name="acceptsMarketing"
                  defaultChecked={customer.acceptsMarketing}
                  className="mt-0.5 w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold/30"
                />
                <div>
                  <label htmlFor="acceptsMarketing" className="text-sm font-medium text-charcoal cursor-pointer">
                    Marketing communications
                  </label>
                  <p className="text-xs text-charcoal/60 mt-0.5">
                    Receive emails about new products, exclusive offers, and promotions
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-gold px-6 py-3 rounded-xl text-white font-medium disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Account created info */}
          <div className="mt-6 p-4 rounded-xl bg-cream-50 border border-cream-100">
            <p className="text-sm text-charcoal/60">
              Account created on{" "}
              <span className="text-charcoal">
                {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === "addresses" && <AddressManager customer={customer} />}

      {/* Admin Tab */}
      {activeTab === "admin" && isAdmin && (
        <div className="max-w-2xl">
          <div className="bg-gradient-to-br from-charcoal via-charcoal-700 to-charcoal-900 rounded-2xl p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-saffron flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-xl">Admin Access</h2>
                <p className="text-white/60 text-sm">You have administrator privileges</p>
              </div>
            </div>

            <p className="text-white/70 text-sm mb-6">
              As an admin, you have access to the full admin panel where you can manage orders, 
              view analytics, manage products, and configure store settings.
            </p>

            <div className="grid gap-3">
              <Link
                href="/admin"
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-gold/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center text-gold group-hover:bg-gold/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Admin Dashboard</p>
                  <p className="text-sm text-white/50">View stats and recent orders</p>
                </div>
                <svg className="w-5 h-5 text-white/30 group-hover:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-gold/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center text-gold group-hover:bg-gold/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Manage Orders</p>
                  <p className="text-sm text-white/50">View and fulfill customer orders</p>
                </div>
                <svg className="w-5 h-5 text-white/30 group-hover:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/admin/products"
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-gold/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center text-gold group-hover:bg-gold/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Products</p>
                  <p className="text-sm text-white/50">Manage product inventory</p>
                </div>
                <svg className="w-5 h-5 text-white/30 group-hover:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-white/40">
                Admin access is granted based on your email address. Contact the store owner if you need your access modified.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: ShopifyOrder }) {
  const statusColors: Record<string, string> = {
    PAID: "bg-leaf/10 text-leaf-700",
    PENDING: "bg-gold/10 text-saffron",
    REFUNDED: "bg-charcoal/10 text-charcoal",
    VOIDED: "bg-red-50 text-red-600",
  };

  const fulfillmentColors: Record<string, string> = {
    FULFILLED: "bg-leaf/10 text-leaf-700",
    UNFULFILLED: "bg-gold/10 text-saffron",
    PARTIALLY_FULFILLED: "bg-gold/10 text-saffron",
    IN_PROGRESS: "bg-blue-50 text-blue-600",
  };

  const getStatusIcon = () => {
    switch (order.fulfillmentStatus) {
      case "FULFILLED":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "UNFULFILLED":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
    }
  };

  return (
    <Link
      href={`/account/orders/${encodeURIComponent(order.id)}`}
      className="group block bg-white rounded-2xl border border-cream-100 overflow-hidden transition-all hover:border-gold/40 hover:shadow-e1"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-cream-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            order.fulfillmentStatus === "FULFILLED" 
              ? "bg-leaf/10 text-leaf-700" 
              : order.fulfillmentStatus === "UNFULFILLED"
              ? "bg-gold/10 text-saffron"
              : "bg-blue-50 text-blue-600"
          }`}>
            {getStatusIcon()}
          </div>
          <div>
            <p className="font-semibold text-charcoal">Order #{order.orderNumber}</p>
            <p className="text-xs text-charcoal/60">
              {new Date(order.processedAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-charcoal">
            {formatINR(Math.round(parseFloat(order.totalPrice.amount) * 100))}
          </p>
          <p className={`text-xs font-medium ${
            order.fulfillmentStatus === "FULFILLED" ? "text-leaf-700" : "text-saffron"
          }`}>
            {order.fulfillmentStatus === "FULFILLED" ? "Delivered" : 
             order.fulfillmentStatus === "UNFULFILLED" ? "Processing" : 
             order.fulfillmentStatus.toLowerCase().replace("_", " ")}
          </p>
        </div>
      </div>

      {/* Line Items */}
      <div className="px-6 py-4">
        <div className="flex flex-wrap gap-3 mb-4">
          {order.lineItems.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-cream-100 overflow-hidden flex-shrink-0">
                {item.variant?.image ? (
                  <img
                    src={item.variant.image.url}
                    alt={item.variant.image.altText || item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal/30">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-charcoal line-clamp-1">{item.title}</p>
                <p className="text-xs text-charcoal/60">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
          {order.lineItems.length > 3 && (
            <div className="flex items-center">
              <span className="text-sm text-charcoal/60">
                +{order.lineItems.length - 3} more
              </span>
            </div>
          )}
        </div>

        {/* Status badges + view link */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${statusColors[order.financialStatus] || statusColors.PENDING}`}>
            {order.financialStatus === "PAID" && (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {order.financialStatus.toLowerCase().replace("_", " ")}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${fulfillmentColors[order.fulfillmentStatus] || fulfillmentColors.UNFULFILLED}`}>
            {order.fulfillmentStatus.toLowerCase().replace("_", " ")}
          </span>
          <span className="ml-auto text-sm font-medium text-saffron group-hover:text-saffron-700 inline-flex items-center gap-1">
            View details
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

