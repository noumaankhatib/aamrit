import Link from "next/link";
import { getOrders, formatMoney, formatDate, type OrderListItem, type OrdersPageInfo } from "@/lib/shopify-admin";

function StatusBadge({ status, type }: { status: string; type: "financial" | "fulfillment" }) {
  const getColors = () => {
    const s = status.toLowerCase();
    
    if (type === "financial") {
      if (s === "paid") return "bg-leaf/10 text-leaf-700";
      if (s === "pending") return "bg-gold/10 text-saffron";
      if (s === "refunded" || s === "partially_refunded") return "bg-red-50 text-red-600";
      return "bg-cream-100 text-charcoal/60";
    }
    
    if (s === "fulfilled") return "bg-leaf/10 text-leaf-700";
    if (s === "unfulfilled") return "bg-gold/10 text-saffron";
    if (s === "partially_fulfilled") return "bg-blue-50 text-blue-600";
    return "bg-cream-100 text-charcoal/60";
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getColors()}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function OrderRow({ order }: { order: OrderListItem }) {
  return (
    <tr className="border-b border-cream-100 hover:bg-cream-50/50 transition-colors">
      <td className="py-3.5 px-4">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold/30 focus:ring-offset-0"
        />
      </td>
      <td className="py-3.5 px-4">
        <Link 
          href={`/admin/orders/${order.orderNumber}`}
          className="text-saffron hover:text-saffron-700 font-medium"
        >
          {order.name}
        </Link>
        {order.isTest && (
          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gold/10 text-saffron uppercase">
            Test
          </span>
        )}
      </td>
      <td className="py-3.5 px-4 text-charcoal/60">
        {formatDate(order.createdAt)}
      </td>
      <td className="py-3.5 px-4">
        <Link 
          href={`/admin/customers/${encodeURIComponent(order.customerEmail)}`}
          className="text-charcoal/70 hover:text-charcoal transition-colors"
        >
          {order.customerName}
        </Link>
      </td>
      <td className="py-3.5 px-4 text-charcoal/60">
        {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
      </td>
      <td className="py-3.5 px-4">
        <StatusBadge status={order.financialStatus} type="financial" />
      </td>
      <td className="py-3.5 px-4">
        <StatusBadge status={order.fulfillmentStatus} type="fulfillment" />
      </td>
      <td className="py-3.5 px-4 text-right font-medium text-charcoal">
        {formatMoney(order.total, order.currency)}
      </td>
    </tr>
  );
}

const ORDERS_PER_PAGE = 25;

function buildPaginationUrl(
  baseParams: { status?: string; q?: string },
  cursor: string | null,
  direction: "after" | "before"
): string {
  const params = new URLSearchParams();
  if (baseParams.status) params.set("status", baseParams.status);
  if (baseParams.q) params.set("q", baseParams.q);
  if (cursor) params.set(direction, cursor);
  const queryString = params.toString();
  return `/admin/orders${queryString ? `?${queryString}` : ""}`;
}

function Pagination({
  pageInfo,
  totalCount,
  currentCount,
  baseParams,
}: {
  pageInfo: OrdersPageInfo;
  totalCount: number;
  currentCount: number;
  baseParams: { status?: string; q?: string };
}) {
  const prevUrl = buildPaginationUrl(baseParams, pageInfo.startCursor, "before");
  const nextUrl = buildPaginationUrl(baseParams, pageInfo.endCursor, "after");

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-charcoal/50">
      <p>
        Showing {currentCount} of {totalCount > 250 ? "250+" : totalCount} orders
      </p>
      <div className="flex items-center gap-2">
        {pageInfo.hasPreviousPage ? (
          <Link
            href={prevUrl}
            className="px-3 py-1.5 rounded-lg border border-cream-200 bg-white text-charcoal hover:border-gold/40 hover:shadow-e1 transition-all inline-flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Link>
        ) : (
          <span className="px-3 py-1.5 rounded-lg border border-cream-200 bg-white text-charcoal/40 cursor-not-allowed inline-flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </span>
        )}
        {pageInfo.hasNextPage ? (
          <Link
            href={nextUrl}
            className="px-3 py-1.5 rounded-lg border border-cream-200 bg-white text-charcoal hover:border-gold/40 hover:shadow-e1 transition-all inline-flex items-center gap-1.5"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span className="px-3 py-1.5 rounded-lg border border-cream-200 bg-white text-charcoal/40 cursor-not-allowed inline-flex items-center gap-1.5">
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string; after?: string; before?: string };
}) {
  const { status, q, after, before } = searchParams;
  
  const { orders, pageInfo, totalCount } = await getOrders({
    first: before ? undefined : ORDERS_PER_PAGE,
    last: before ? ORDERS_PER_PAGE : undefined,
    after: after || undefined,
    before: before || undefined,
    status: status as "open" | "closed" | "cancelled" | "any" | undefined,
    query: q,
  });

  const unfulfilledCount = orders.filter(
    (o) => o.fulfillmentStatus.toLowerCase() === "unfulfilled"
  ).length;

  const baseParams = { status, q };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Orders</h1>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 text-sm font-medium text-charcoal bg-white border border-cream-200 rounded-xl hover:border-gold/40 hover:shadow-e1 transition-all">
            Export
          </button>
          <a
            href={`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/orders`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-gold-300 to-gold rounded-xl hover:shadow-glow transition-all inline-flex items-center gap-2"
          >
            Open in Shopify
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-cream-200">
        <Link
          href="/admin/orders"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            !status
              ? "text-saffron border-saffron"
              : "text-charcoal/50 border-transparent hover:text-charcoal"
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/orders?status=open"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            status === "open"
              ? "text-saffron border-saffron"
              : "text-charcoal/50 border-transparent hover:text-charcoal"
          }`}
        >
          Unfulfilled
          {unfulfilledCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gold/10 text-saffron font-semibold">
              {unfulfilledCount}
            </span>
          )}
        </Link>
        <Link
          href="/admin/orders?status=closed"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            status === "closed"
              ? "text-saffron border-saffron"
              : "text-charcoal/50 border-transparent hover:text-charcoal"
          }`}
        >
          Completed
        </Link>
        <Link
          href="/admin/orders?status=cancelled"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            status === "cancelled"
              ? "text-saffron border-saffron"
              : "text-charcoal/50 border-transparent hover:text-charcoal"
          }`}
        >
          Cancelled
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40"
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
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-cream-200 rounded-xl text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm"
            />
          </form>
        </div>
        <button className="px-4 py-2.5 text-sm font-medium text-charcoal/70 bg-white border border-cream-200 rounded-xl hover:border-gold/40 transition-colors inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter
        </button>
        <button className="px-4 py-2.5 text-sm font-medium text-charcoal/70 bg-white border border-cream-200 rounded-xl hover:border-gold/40 transition-colors inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          Sort
        </button>
      </div>

      {/* Orders table */}
      <div className="bg-white border border-cream-200 rounded-2xl overflow-hidden shadow-soft">
        {orders.length === 0 ? (
          <div className="py-16 text-center">
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
            <h3 className="text-lg font-serif font-medium text-charcoal mb-1">No orders found</h3>
            <p className="text-charcoal/50">
              {q ? `No orders match "${q}"` : "Orders will appear here once customers make purchases."}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100 bg-cream-50/50">
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold/30 focus:ring-offset-0"
                  />
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
                  Order
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
                  Items
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
                  Payment
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
                  Fulfillment
                </th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
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

      {/* Pagination */}
      {orders.length > 0 && (
        <Pagination
          pageInfo={pageInfo}
          totalCount={totalCount}
          currentCount={orders.length}
          baseParams={baseParams}
        />
      )}
    </div>
  );
}
