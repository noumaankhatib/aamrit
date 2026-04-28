import Link from "next/link";
import Image from "next/image";
import { getOrders, formatMoney, formatDate, type OrderListItem } from "@/lib/shopify-admin";

function StatusBadge({ status, type }: { status: string; type: "financial" | "fulfillment" }) {
  const getColors = () => {
    const s = status.toLowerCase();
    
    if (type === "financial") {
      if (s === "paid") return "bg-[#1a4d2e] text-[#4ade80]";
      if (s === "pending") return "bg-[#4d3800] text-[#fbbf24]";
      if (s === "refunded" || s === "partially_refunded") return "bg-[#4d1a1a] text-[#f87171]";
      return "bg-[#333] text-[#999]";
    }
    
    if (s === "fulfilled") return "bg-[#1a4d2e] text-[#4ade80]";
    if (s === "unfulfilled") return "bg-[#4d3800] text-[#fbbf24]";
    if (s === "partially_fulfilled") return "bg-[#1a3d4d] text-[#38bdf8]";
    return "bg-[#333] text-[#999]";
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getColors()}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function OrderRow({ order }: { order: OrderListItem }) {
  return (
    <tr className="border-b border-[#333] hover:bg-[#252525] transition-colors">
      <td className="py-3 px-4">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-[#444] bg-[#2a2a2a] text-gold focus:ring-gold/50 focus:ring-offset-0"
        />
      </td>
      <td className="py-3 px-4">
        <Link 
          href={`/admin/orders/${order.orderNumber}`}
          className="text-[#6d9eff] hover:underline font-medium"
        >
          {order.name}
        </Link>
        {order.isTest && (
          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#4d3800] text-[#fbbf24]">
            Test
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-[#b5b5b5]">
        {formatDate(order.createdAt)}
      </td>
      <td className="py-3 px-4">
        <Link 
          href={`/admin/customers/${encodeURIComponent(order.customerEmail)}`}
          className="text-[#b5b5b5] hover:text-white transition-colors"
        >
          {order.customerName}
        </Link>
      </td>
      <td className="py-3 px-4 text-[#b5b5b5]">
        {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={order.financialStatus} type="financial" />
      </td>
      <td className="py-3 px-4">
        <StatusBadge status={order.fulfillmentStatus} type="fulfillment" />
      </td>
      <td className="py-3 px-4 text-right font-medium text-white">
        {formatMoney(order.total, order.currency)}
      </td>
    </tr>
  );
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const { status, q } = searchParams;
  
  const orders = await getOrders({
    first: 50,
    status: status as "open" | "closed" | "cancelled" | "any" | undefined,
    query: q,
  });

  const unfulfilledCount = orders.filter(
    (o) => o.fulfillmentStatus.toLowerCase() === "unfulfilled"
  ).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Orders</h1>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#2a2a2a] border border-[#444] rounded-lg hover:bg-[#333] transition-colors">
            Export
          </button>
          <a
            href={`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/orders`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium text-white bg-[#2a2a2a] border border-[#444] rounded-lg hover:bg-[#333] transition-colors inline-flex items-center gap-2"
          >
            Open in Shopify
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-[#333]">
        <Link
          href="/admin/orders"
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            !status
              ? "text-white border-white"
              : "text-[#888] border-transparent hover:text-white"
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/orders?status=open"
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            status === "open"
              ? "text-white border-white"
              : "text-[#888] border-transparent hover:text-white"
          }`}
        >
          Unfulfilled
          {unfulfilledCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-[#4d3800] text-[#fbbf24]">
              {unfulfilledCount}
            </span>
          )}
        </Link>
        <Link
          href="/admin/orders?status=closed"
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            status === "closed"
              ? "text-white border-white"
              : "text-[#888] border-transparent hover:text-white"
          }`}
        >
          Completed
        </Link>
        <Link
          href="/admin/orders?status=cancelled"
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            status === "cancelled"
              ? "text-white border-white"
              : "text-[#888] border-transparent hover:text-white"
          }`}
        >
          Cancelled
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <form>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-[#444] rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-sm"
            />
          </form>
        </div>
        <button className="px-3 py-2 text-sm font-medium text-[#b5b5b5] bg-[#2a2a2a] border border-[#444] rounded-lg hover:bg-[#333] transition-colors inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter
        </button>
        <button className="px-3 py-2 text-sm font-medium text-[#b5b5b5] bg-[#2a2a2a] border border-[#444] rounded-lg hover:bg-[#333] transition-colors inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          Sort
        </button>
      </div>

      {/* Orders table */}
      <div className="bg-[#222] border border-[#333] rounded-xl overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <svg
              className="w-12 h-12 mx-auto text-[#444] mb-4"
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
            <h3 className="text-lg font-medium text-white mb-1">No orders found</h3>
            <p className="text-[#888]">
              {q ? `No orders match "${q}"` : "Orders will appear here once customers make purchases."}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#333] bg-[#1a1a1a]">
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[#444] bg-[#2a2a2a] text-gold focus:ring-gold/50 focus:ring-offset-0"
                  />
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-[#888] uppercase tracking-wider">
                  Order
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-[#888] uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-[#888] uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-[#888] uppercase tracking-wider">
                  Items
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-[#888] uppercase tracking-wider">
                  Payment
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-[#888] uppercase tracking-wider">
                  Fulfillment
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-[#888] uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination info */}
      {orders.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-[#888]">
          <p>Showing {orders.length} orders</p>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="px-3 py-1.5 rounded border border-[#444] bg-[#2a2a2a] text-[#666] cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled
              className="px-3 py-1.5 rounded border border-[#444] bg-[#2a2a2a] text-[#666] cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
