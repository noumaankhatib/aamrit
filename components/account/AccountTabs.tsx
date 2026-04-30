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
}

type Tab = "orders" | "profile" | "addresses";

const VALID_TABS: Tab[] = ["orders", "profile", "addresses"];

function isTab(v: string | null): v is Tab {
  return v !== null && (VALID_TABS as string[]).includes(v);
}

export default function AccountTabs({ customer, orders }: AccountTabsProps) {
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

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "orders", label: "Orders", count: orders.length },
    { id: "profile", label: "Profile" },
    { id: "addresses", label: "Addresses", count: customer.addresses.length },
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-cream-100/50 rounded-xl mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => selectTab(tab.id)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-charcoal shadow-sm"
                : "text-charcoal/60 hover:text-charcoal hover:bg-white/50"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? "bg-gold/10 text-saffron"
                  : "bg-charcoal/10 text-charcoal/60"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
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
              <div className="mb-6 p-4 rounded-xl bg-leaf/10 border border-leaf/20 text-leaf-700 text-sm">
                Profile updated successfully!
              </div>
            )}

            {profileState.error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
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
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={customer.email}
                  className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-2">
                  Phone number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={customer.phone || ""}
                  className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptsMarketing"
                  name="acceptsMarketing"
                  defaultChecked={customer.acceptsMarketing}
                  className="mt-1 w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold/30"
                />
                <label htmlFor="acceptsMarketing" className="text-sm text-charcoal/70">
                  Receive marketing emails about products and offers
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-gold px-6 py-3 rounded-xl text-white font-medium disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save changes"}
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
  };

  return (
    <Link
      href={`/account/orders/${encodeURIComponent(order.id)}`}
      className="group block bg-white rounded-2xl border border-cream-100 overflow-hidden transition-all hover:border-gold/40 hover:shadow-e1"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-cream-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-charcoal/60">Order</p>
          <p className="font-semibold text-charcoal">#{order.orderNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-charcoal/60">
            {new Date(order.processedAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="font-semibold text-charcoal">
            {formatINR(Math.round(parseFloat(order.totalPrice.amount) * 100))}
          </p>
        </div>
      </div>

      {/* Line Items */}
      <div className="px-6 py-4">
        <div className="flex flex-wrap gap-3 mb-4">
          {order.lineItems.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.variant?.image && (
                <img
                  src={item.variant.image.url}
                  alt={item.variant.image.altText || item.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="text-sm font-medium text-charcoal">{item.title}</p>
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
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.financialStatus] || statusColors.PENDING}`}>
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

