import Link from "next/link";
import { getOrders, getOrderStats, formatMoney } from "@/lib/shopify-admin";

function StatCard({
  title,
  value,
  subtitle,
  icon,
  href,
  highlight,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  href?: string;
  highlight?: boolean;
}) {
  const content = (
    <div className={`relative bg-white border rounded-2xl p-6 transition-all hover:shadow-e2 group cursor-pointer ${
      highlight ? "border-saffron/40" : "border-cream-200 hover:border-gold/40"
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-charcoal/60">{title}</p>
          <p className="mt-2 text-3xl font-serif font-semibold text-charcoal">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-charcoal/50">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
          highlight 
            ? "bg-saffron/10 text-saffron group-hover:bg-saffron/20" 
            : "bg-gold/10 text-gold group-hover:bg-gold/20"
        }`}>
          {icon}
        </div>
      </div>
      {highlight && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-saffron animate-pulse" />
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function RecentOrderRow({
  order,
}: {
  order: {
    name: string;
    orderNumber: number;
    createdAt: string;
    customerName: string;
    total: string;
    currency: string;
    fulfillmentStatus: string;
  };
}) {
  return (
    <tr className="border-b border-cream-100 hover:bg-cream-50/50 transition-colors">
      <td className="py-3.5 px-4">
        <Link
          href={`/admin/orders/${order.orderNumber}`}
          className="text-saffron hover:text-saffron-700 font-medium"
        >
          {order.name}
        </Link>
      </td>
      <td className="py-3.5 px-4 text-charcoal/70">{order.customerName}</td>
      <td className="py-3.5 px-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            order.fulfillmentStatus.toLowerCase() === "fulfilled"
              ? "bg-leaf/10 text-leaf-700"
              : "bg-gold/10 text-saffron"
          }`}
        >
          {order.fulfillmentStatus.replace(/_/g, " ")}
        </span>
      </td>
      <td className="py-3.5 px-4 text-right font-medium text-charcoal">
        {formatMoney(order.total, order.currency)}
      </td>
    </tr>
  );
}

export default async function AdminDashboard() {
  const [orders, stats] = await Promise.all([
    getOrders({ first: 5 }),
    getOrderStats(),
  ]);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Dashboard</h1>
        <p className="text-charcoal/60 mt-1">Welcome back to your store admin</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          subtitle="All time"
          href="/admin/orders"
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
        />
        <StatCard
          title="Unfulfilled"
          value={stats.unfulfilled}
          subtitle="Need attention"
          href="/admin/orders?status=open"
          highlight={stats.unfulfilled > 0}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Total Revenue"
          value={formatMoney(stats.totalRevenue, stats.currency)}
          subtitle="All orders"
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Avg Order Value"
          value={
            stats.totalOrders > 0
              ? formatMoney(
                  stats.totalRevenue / stats.totalOrders,
                  stats.currency
                )
              : formatMoney(0, stats.currency)
          }
          subtitle="Per order"
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
        />
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-cream-200 rounded-2xl overflow-hidden shadow-soft">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-100">
          <h2 className="font-serif font-semibold text-charcoal">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-saffron hover:text-saffron-700 font-medium"
          >
            View all →
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="py-14 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-charcoal/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-charcoal/70 font-medium">No orders yet</p>
            <p className="text-sm text-charcoal/50 mt-1">
              Orders will appear here once customers make purchases.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100 bg-cream-50/50">
                <th className="py-3 px-4 text-left text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
                  Order
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <RecentOrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href={`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/orders`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-5 bg-white border border-cream-200 rounded-2xl hover:border-gold/40 hover:shadow-e1 transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-charcoal">Shopify Admin</p>
            <p className="text-sm text-charcoal/50">Full admin access</p>
          </div>
        </a>

        <a
          href={`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/products`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-5 bg-white border border-cream-200 rounded-2xl hover:border-gold/40 hover:shadow-e1 transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-charcoal">Manage Products</p>
            <p className="text-sm text-charcoal/50">Add or edit products</p>
          </div>
        </a>

        <Link
          href="/"
          className="flex items-center gap-4 p-5 bg-white border border-cream-200 rounded-2xl hover:border-gold/40 hover:shadow-e1 transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-charcoal">View Store</p>
            <p className="text-sm text-charcoal/50">See customer view</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
