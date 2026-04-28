import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getOrderByNumber,
  formatMoney,
  formatDate,
  type ShopifyOrder,
} from "@/lib/shopify-admin";
import { FulfillOrderForm, CancelOrderButton } from "./actions-client";

function StatusBadge({
  status,
  type,
  size = "default",
}: {
  status: string;
  type: "financial" | "fulfillment";
  size?: "default" | "large";
}) {
  const getColors = () => {
    const s = status.toLowerCase();

    if (type === "financial") {
      if (s === "paid") return "bg-[#1a4d2e] text-[#4ade80]";
      if (s === "pending") return "bg-[#4d3800] text-[#fbbf24]";
      if (s === "refunded" || s === "partially_refunded")
        return "bg-[#4d1a1a] text-[#f87171]";
      return "bg-[#333] text-[#999]";
    }

    if (s === "fulfilled") return "bg-[#1a4d2e] text-[#4ade80]";
    if (s === "unfulfilled") return "bg-[#4d3800] text-[#fbbf24]";
    if (s === "partially_fulfilled") return "bg-[#1a3d4d] text-[#38bdf8]";
    return "bg-[#333] text-[#999]";
  };

  const sizeClasses =
    size === "large" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded font-medium ${getColors()} ${sizeClasses}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

function Card({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="bg-[#222] border border-[#333] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#333]">
        <h3 className="font-medium text-white">{title}</h3>
        {actions}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const orderNumber = parseInt(params.id, 10);

  if (isNaN(orderNumber)) {
    notFound();
  }

  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  const lineItems = order.lineItems.edges.map((e) => e.node);
  const isFulfilled =
    order.displayFulfillmentStatus.toLowerCase() === "fulfilled";
  const isPaid = order.displayFinancialStatus.toLowerCase() === "paid";
  const isCancelled = !!order.cancelledAt;

  const subtotal = parseFloat(order.subtotalPriceSet.shopMoney.amount);
  const shipping = parseFloat(order.totalShippingPriceSet.shopMoney.amount);
  const tax = parseFloat(order.totalTaxSet.shopMoney.amount);
  const total = parseFloat(order.totalPriceSet.shopMoney.amount);
  const currency = order.totalPriceSet.shopMoney.currencyCode;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/orders"
              className="text-[#888] hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-2xl font-semibold text-white">{order.name}</h1>
            <StatusBadge
              status={order.displayFinancialStatus}
              type="financial"
              size="large"
            />
            <StatusBadge
              status={order.displayFulfillmentStatus}
              type="fulfillment"
              size="large"
            />
            {order.test && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-[#4d3800] text-[#fbbf24]">
                Test order
              </span>
            )}
          </div>
          <p className="text-[#888] text-sm">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#2a2a2a] border border-[#444] rounded-lg hover:bg-[#333] transition-colors">
            Refund
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#2a2a2a] border border-[#444] rounded-lg hover:bg-[#333] transition-colors">
            Edit
          </button>
          <div className="relative group">
            <button className="px-3 py-2 text-sm font-medium text-white bg-[#2a2a2a] border border-[#444] rounded-lg hover:bg-[#333] transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Test order banner */}
      {order.test && (
        <div className="mb-6 px-4 py-3 bg-[#4d3800]/50 border border-[#4d3800] rounded-xl">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-[#fbbf24]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="font-medium text-[#fbbf24]">Test order</p>
              <p className="text-sm text-[#fbbf24]/70">
                Your payment gateway is in test mode. This order won&apos;t be
                charged.
              </p>
            </div>
            <a
              href={`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/settings/payments`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto px-3 py-1.5 text-sm font-medium text-[#fbbf24] border border-[#fbbf24]/30 rounded-lg hover:bg-[#fbbf24]/10 transition-colors"
            >
              View payment settings
            </a>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main content - 2 columns */}
        <div className="col-span-2 space-y-6">
          {/* Fulfillment card */}
          <Card
            title={`${isFulfilled ? "Fulfilled" : "Unfulfilled"} (${lineItems.length})`}
            actions={
              !isFulfilled &&
              !isCancelled && (
                <FulfillOrderForm orderId={order.id} orderNumber={orderNumber} />
              )
            }
          >
            {order.shippingAddress && (
              <div className="flex items-center gap-2 mb-4 text-sm text-[#888]">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  {order.shippingAddress.city}, {order.shippingAddress.province}
                </span>
              </div>
            )}

            <div className="space-y-3">
              {lineItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-[#1a1a1a] rounded-lg"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#333] flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image.url}
                        alt={item.image.altText || item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#666]">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {item.title}
                    </p>
                    {item.variantTitle && (
                      <p className="text-sm text-[#888]">{item.variantTitle}</p>
                    )}
                    {item.sku && (
                      <p className="text-xs text-[#666]">SKU: {item.sku}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[#888]">
                      {formatMoney(
                        item.discountedUnitPriceSet.shopMoney.amount,
                        currency
                      )}{" "}
                      × {item.quantity}
                    </p>
                    <p className="font-medium text-white">
                      {formatMoney(
                        parseFloat(
                          item.discountedUnitPriceSet.shopMoney.amount
                        ) * item.quantity,
                        currency
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Fulfillment info */}
            {order.fulfillments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#333]">
                {order.fulfillments.map((fulfillment) => (
                  <div key={fulfillment.id} className="text-sm">
                    <p className="text-[#888]">
                      Fulfilled on {formatDate(fulfillment.createdAt)}
                    </p>
                    {fulfillment.trackingInfo.map((tracking, i) => (
                      <div key={i} className="mt-2">
                        {tracking.company && (
                          <p className="text-white">{tracking.company}</p>
                        )}
                        {tracking.number && (
                          <p className="text-[#6d9eff]">
                            {tracking.url ? (
                              <a
                                href={tracking.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {tracking.number}
                              </a>
                            ) : (
                              tracking.number
                            )}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Payment card */}
          <Card title={isPaid ? "Paid" : "Payment pending"}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#888]">
                <span>Subtotal</span>
                <span>
                  {lineItems.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
                <span className="text-white">
                  {formatMoney(subtotal, currency)}
                </span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>Shipping</span>
                <span className="text-white">
                  {formatMoney(shipping, currency)}
                </span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>Tax (IGST 18%)</span>
                <span className="text-white">{formatMoney(tax, currency)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#333] font-medium text-white">
                <span>Total</span>
                <span>{formatMoney(total, currency)}</span>
              </div>
            </div>

            {/* Transactions */}
            {order.transactions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#333]">
                <p className="text-xs font-medium text-[#888] uppercase tracking-wider mb-2">
                  Transactions
                </p>
                {order.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <div>
                      <p className="text-white capitalize">
                        {tx.kind.replace(/_/g, " ")}
                      </p>
                      <p className="text-[#888] text-xs">
                        {formatDate(tx.createdAt)} · {tx.gateway}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">
                        {formatMoney(tx.amountSet.shopMoney.amount, currency)}
                      </p>
                      <p
                        className={`text-xs ${
                          tx.status === "SUCCESS"
                            ? "text-[#4ade80]"
                            : "text-[#888]"
                        }`}
                      >
                        {tx.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Notes */}
          <Card title="Notes">
            {order.note ? (
              <p className="text-[#b5b5b5] text-sm">{order.note}</p>
            ) : (
              <p className="text-[#666] text-sm">No notes from customer</p>
            )}
          </Card>

          {/* Customer */}
          <Card title="Customer">
            {order.customer ? (
              <div>
                <p className="font-medium text-white">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="text-sm text-[#888]">
                  {order.customer.ordersCount === "1"
                    ? "No orders"
                    : `${parseInt(order.customer.ordersCount) - 1} previous orders`}
                </p>
                <div className="mt-3 pt-3 border-t border-[#333]">
                  <p className="text-xs font-medium text-[#888] uppercase tracking-wider mb-2">
                    Contact information
                  </p>
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="text-sm text-[#6d9eff] hover:underline block"
                  >
                    {order.customer.email}
                  </a>
                  {order.customer.phone && (
                    <a
                      href={`tel:${order.customer.phone}`}
                      className="text-sm text-[#6d9eff] hover:underline block mt-1"
                    >
                      {order.customer.phone}
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-[#888] text-sm">No customer information</p>
            )}
          </Card>

          {/* Shipping address */}
          {order.shippingAddress && (
            <Card
              title="Shipping address"
              actions={
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${order.shippingAddress.address1}, ${order.shippingAddress.city}, ${order.shippingAddress.province} ${order.shippingAddress.zip}, ${order.shippingAddress.country}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#6d9eff] hover:underline"
                >
                  View map
                </a>
              }
            >
              <address className="text-sm text-[#b5b5b5] not-italic">
                <p className="font-medium text-white">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && (
                  <p>{order.shippingAddress.address2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                  {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="mt-2">
                    <a
                      href={`tel:${order.shippingAddress.phone}`}
                      className="text-[#6d9eff] hover:underline"
                    >
                      {order.shippingAddress.phone}
                    </a>
                  </p>
                )}
              </address>
            </Card>
          )}

          {/* Billing address */}
          {order.billingAddress && (
            <Card title="Billing address">
              <address className="text-sm text-[#b5b5b5] not-italic">
                <p className="font-medium text-white">
                  {order.billingAddress.firstName}{" "}
                  {order.billingAddress.lastName}
                </p>
                <p>{order.billingAddress.address1}</p>
                {order.billingAddress.address2 && (
                  <p>{order.billingAddress.address2}</p>
                )}
                <p>
                  {order.billingAddress.city}, {order.billingAddress.province}{" "}
                  {order.billingAddress.zip}
                </p>
                <p>{order.billingAddress.country}</p>
              </address>
            </Card>
          )}

          {/* Tags */}
          <Card title="Tags">
            {order.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {order.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium bg-[#333] text-[#b5b5b5] rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[#666] text-sm">No tags</p>
            )}
          </Card>

          {/* Cancel order */}
          {!isCancelled && (
            <CancelOrderButton orderId={order.id} orderNumber={orderNumber} />
          )}
        </div>
      </div>
    </div>
  );
}
