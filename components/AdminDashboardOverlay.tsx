"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface OrderStats {
  totalOrders: number;
  unfulfilled: number;
  totalRevenue: number;
  currency: string;
}

interface RecentOrder {
  id: string;
  name: string;
  orderNumber: number;
  customerName: string;
  total: string;
  currency: string;
  fulfillmentStatus: string;
}

interface AdminDashboardOverlayProps {
  stats: OrderStats;
  recentOrders: RecentOrder[];
  userName?: string | null;
  shopifyDomain?: string;
}

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 0.84, 0.3, 1] } },
};

export default function AdminDashboardOverlay({
  stats,
  recentOrders,
  userName,
  shopifyDomain,
}: AdminDashboardOverlayProps) {
  const avgOrderValue =
    stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Background with warm gradient matching theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-700 to-charcoal-900" />
      
      {/* Decorative gold glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-medium mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-gold animate-ping opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>
                Admin Dashboard
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-semibold">
                Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}
              </h2>
              <p className="mt-1 text-cream-100/70 text-sm sm:text-base">
                Here&apos;s your store overview at a glance
              </p>
            </div>
            <Link
              href="/admin"
              className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium text-sm cursor-pointer self-start sm:self-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Full Admin Panel
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <StatCard
              title="Total Orders"
              value={stats.totalOrders.toLocaleString("en-IN")}
              subtitle="All time"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              href="/admin/orders"
            />
            <StatCard
              title="Unfulfilled"
              value={stats.unfulfilled.toString()}
              subtitle="Need attention"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              href="/admin/orders?status=open"
              highlight={stats.unfulfilled > 0}
            />
            <StatCard
              title="Revenue"
              value={formatMoney(stats.totalRevenue, stats.currency)}
              subtitle="Total sales"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Avg Order"
              value={formatMoney(avgOrderValue, stats.currency)}
              subtitle="Per order"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          </motion.div>

          {/* Recent Orders + Quick Actions */}
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Recent Orders Table */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-white/10">
                <h3 className="font-medium text-white text-sm sm:text-base">Recent Orders</h3>
                <Link
                  href="/admin/orders"
                  className="text-sm text-gold hover:text-gold-300 transition-colors"
                >
                  View all →
                </Link>
              </div>
              {recentOrders.length === 0 ? (
                <div className="py-10 text-center">
                  <svg className="w-10 h-10 mx-auto text-white/20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-white/50 text-sm">No orders yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[400px]">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="py-2.5 px-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                          Order
                        </th>
                        <th className="py-2.5 px-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider hidden sm:table-cell">
                          Customer
                        </th>
                        <th className="py-2.5 px-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-2.5 px-4 text-right text-xs font-medium text-white/50 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.slice(0, 5).map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-2.5 px-4">
                            <Link
                              href={`/admin/orders/${order.orderNumber}`}
                              className="text-gold hover:text-gold-300 font-medium text-sm"
                            >
                              {order.name}
                            </Link>
                          </td>
                          <td className="py-2.5 px-4 text-white/70 text-sm hidden sm:table-cell">
                            {order.customerName}
                          </td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                order.fulfillmentStatus.toLowerCase() === "fulfilled"
                                  ? "bg-leaf/20 text-leaf"
                                  : "bg-saffron/20 text-saffron"
                              }`}
                            >
                              {order.fulfillmentStatus.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right font-medium text-white text-sm">
                            {formatMoney(parseFloat(order.total), order.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="space-y-3">
              <QuickActionCard
                href="/admin"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                }
                title="Admin Dashboard"
                description="Full admin access"
              />
              <QuickActionCard
                href="/admin/orders"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                }
                title="Manage Orders"
                description="View & fulfill orders"
              />
              <QuickActionCard
                href="/admin/products"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                }
                title="Products"
                description="Manage inventory"
              />
              {shopifyDomain && (
                <QuickActionCard
                  href={`https://${shopifyDomain}/admin`}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  }
                  title="Shopify Admin"
                  description="Full store settings"
                  external
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  href,
  highlight,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  href?: string;
  highlight?: boolean;
}) {
  const content = (
    <div
      className={`relative bg-white/5 backdrop-blur-sm border rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer group ${
        highlight
          ? "border-saffron/50 hover:border-saffron"
          : "border-white/10 hover:border-gold/30"
      } hover:bg-white/10`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-white/50">{title}</p>
          <p className="mt-1.5 text-xl sm:text-2xl lg:text-3xl font-semibold text-white font-serif">
            {value}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-white/40">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors ${
            highlight
              ? "bg-saffron/20 text-saffron group-hover:bg-saffron/30"
              : "bg-gold/10 text-gold/70 group-hover:text-gold group-hover:bg-gold/20"
          }`}
        >
          {icon}
        </div>
      </div>
      {highlight && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-saffron animate-pulse" />
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  external?: boolean;
}) {
  const Wrapper = external ? "a" : Link;
  const extraProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      href={href}
      {...extraProps}
      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-gold/30 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
    >
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold/70 group-hover:text-gold group-hover:bg-gold/20 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white text-sm sm:text-base">{title}</p>
        <p className="text-xs sm:text-sm text-white/50">{description}</p>
      </div>
      <svg
        className="w-4 h-4 text-white/30 group-hover:text-gold/70 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Wrapper>
  );
}
