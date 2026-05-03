import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getOrderByNumber,
  formatMoney,
  formatDate,
  type ShopifyOrder,
} from "@/lib/shopify-admin";
import { 
  FulfillOrderForm, 
  CancelOrderButton, 
  UpdateTrackingForm,
  EditNoteForm,
  TagsEditor,
  OrderActionsMenu,
  CancelFulfillmentButton
} from "./actions-client";

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
      if (s === "paid") return "bg-leaf/10 text-leaf-700";
      if (s === "pending") return "bg-gold/10 text-saffron";
      if (s === "refunded" || s === "partially_refunded")
        return "bg-red-50 text-red-600";
      return "bg-cream-100 text-charcoal/60";
    }

    if (s === "fulfilled") return "bg-leaf/10 text-leaf-700";
    if (s === "unfulfilled") return "bg-gold/10 text-saffron";
    if (s === "partially_fulfilled") return "bg-blue-50 text-blue-600";
    return "bg-cream-100 text-charcoal/60";
  };

  const sizeClasses =
    size === "large" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${getColors()} ${sizeClasses}`}
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
    <div className="bg-white border border-cream-200 rounded-2xl overflow-hidden shadow-soft">
      <div className="flex items-center justify-between px-5 py-4 border-b border-cream-100">
        <h3 className="font-serif font-semibold text-charcoal">{title}</h3>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderNumber = parseInt(id, 10);

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
  const isClosed = order.displayFulfillmentStatus.toLowerCase() === "fulfilled" && isPaid;

  const subtotal = parseFloat(order.subtotalPriceSet.shopMoney.amount);
  const shipping = parseFloat(order.totalShippingPriceSet.shopMoney.amount);
  const tax = parseFloat(order.totalTaxSet.shopMoney.amount);
  const total = parseFloat(order.totalPriceSet.shopMoney.amount);
  const currency = order.totalPriceSet.shopMoney.currencyCode;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/orders"
              className="text-charcoal/50 hover:text-charcoal transition-colors"
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
            <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">{order.name}</h1>
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
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gold/10 text-saffron">
                Test order
              </span>
            )}
          </div>
          <p className="text-charcoal/50 text-sm">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/orders/${orderNumber}/refund`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 text-sm font-medium text-charcoal bg-white border border-cream-200 rounded-xl hover:border-gold/40 hover:shadow-e1 transition-all"
          >
            Refund
          </a>
          <OrderActionsMenu
            orderId={order.id}
            orderNumber={orderNumber}
            isFulfilled={isFulfilled}
            isPaid={isPaid}
            isClosed={isClosed}
            isCancelled={isCancelled}
          />
        </div>
      </div>

      {/* Test order banner */}
      {order.test && (
        <div className="mb-6 px-5 py-4 bg-gold/10 border border-gold/30 rounded-2xl">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-saffron"
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
              <p className="font-medium text-saffron">Test order</p>
              <p className="text-sm text-saffron/70">
                Your payment gateway is in test mode. This order won&apos;t be
                charged.
              </p>
            </div>
            <a
              href={`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/settings/payments`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto px-4 py-2 text-sm font-medium text-saffron border border-saffron/30 rounded-xl hover:bg-saffron/10 transition-colors"
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
              <div className="flex items-center gap-2 mb-4 text-sm text-charcoal/50">
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
                  className="flex items-center gap-4 p-4 bg-cream-50 rounded-xl"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image.url}
                        alt={item.image.altText || item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-charcoal/30">
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
                    <p className="font-medium text-charcoal truncate">
                      {item.title}
                    </p>
                    {item.variantTitle && (
                      <p className="text-sm text-charcoal/50">{item.variantTitle}</p>
                    )}
                    {item.sku && (
                      <p className="text-xs text-charcoal/40">SKU: {item.sku}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-charcoal/50 text-sm">
                      {formatMoney(
                        item.discountedUnitPriceSet.shopMoney.amount,
                        currency
                      )}{" "}
                      × {item.quantity}
                    </p>
                    <p className="font-medium text-charcoal">
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
              <div className="mt-4 pt-4 border-t border-cream-100 space-y-4">
                {order.fulfillments.map((fulfillment) => {
                  const tracking = fulfillment.trackingInfo[0];
                  const canCancel = fulfillment.status === "SUCCESS" || fulfillment.status === "PENDING";
                  return (
                    <div key={fulfillment.id} className="p-4 bg-leaf/5 border border-leaf/20 rounded-xl">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-leaf/10 text-leaf-700">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {fulfillment.status.replace(/_/g, " ")}
                            </span>
                            <span className="text-xs text-charcoal/50">
                              {formatDate(fulfillment.createdAt)}
                            </span>
                          </div>
                          {tracking ? (
                            <div className="space-y-1">
                              {tracking.company && (
                                <p className="text-sm font-medium text-charcoal flex items-center gap-2">
                                  <svg className="w-4 h-4 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                  </svg>
                                  {tracking.company}
                                </p>
                              )}
                              {tracking.number && (
                                <p className="text-sm text-charcoal/70 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                  </svg>
                                  {tracking.url ? (
                                    <a
                                      href={tracking.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-saffron hover:underline font-medium"
                                    >
                                      {tracking.number}
                                    </a>
                                  ) : (
                                    <span className="font-mono">{tracking.number}</span>
                                  )}
                                </p>
                              )}
                              {tracking.url && (
                                <a
                                  href={tracking.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs text-saffron hover:text-saffron-700 font-medium mt-1"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  Track shipment
                                </a>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-charcoal/50 italic">No tracking information added</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <UpdateTrackingForm
                            fulfillmentId={fulfillment.id}
                            currentCompany={tracking?.company}
                            currentNumber={tracking?.number}
                            currentUrl={tracking?.url}
                          />
                          {canCancel && (
                            <CancelFulfillmentButton fulfillmentId={fulfillment.id} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Payment card */}
          <Card title={isPaid ? "Paid" : "Payment pending"}>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-charcoal/60">
                <span>Subtotal</span>
                <span>
                  {lineItems.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
                <span className="text-charcoal font-medium">
                  {formatMoney(subtotal, currency)}
                </span>
              </div>
              <div className="flex justify-between text-charcoal/60">
                <span>Shipping</span>
                <span className="text-charcoal font-medium">
                  {formatMoney(shipping, currency)}
                </span>
              </div>
              <div className="flex justify-between text-charcoal/60">
                <span>Tax (IGST 18%)</span>
                <span className="text-charcoal font-medium">{formatMoney(tax, currency)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-cream-100 font-semibold text-charcoal">
                <span>Total</span>
                <span>{formatMoney(total, currency)}</span>
              </div>
            </div>

            {/* Transactions */}
            {order.transactions.length > 0 && (
              <div className="mt-5 pt-5 border-t border-cream-100">
                <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-3">
                  Transactions
                </p>
                {order.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <div>
                      <p className="text-charcoal font-medium capitalize">
                        {tx.kind.replace(/_/g, " ")}
                      </p>
                      <p className="text-charcoal/50 text-xs">
                        {formatDate(tx.createdAt)} · {tx.gateway}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-charcoal font-medium">
                        {formatMoney(tx.amountSet.shopMoney.amount, currency)}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          tx.status === "SUCCESS"
                            ? "text-leaf-700"
                            : "text-charcoal/50"
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
            <EditNoteForm orderId={order.id} currentNote={order.note} />
          </Card>

          {/* Customer */}
          <Card title="Customer">
            {order.customer ? (
              <div>
                <p className="font-medium text-charcoal">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="text-sm text-charcoal/50">
                  {order.customer.ordersCount === "1"
                    ? "No orders"
                    : `${parseInt(order.customer.ordersCount) - 1} previous orders`}
                </p>
                <div className="mt-4 pt-4 border-t border-cream-100">
                  <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-2">
                    Contact information
                  </p>
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="text-sm text-saffron hover:underline block"
                  >
                    {order.customer.email}
                  </a>
                  {order.customer.phone && (
                    <a
                      href={`tel:${order.customer.phone}`}
                      className="text-sm text-saffron hover:underline block mt-1"
                    >
                      {order.customer.phone}
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-charcoal/40 text-sm">No customer information</p>
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
                  className="text-xs text-saffron hover:underline font-medium"
                >
                  View map
                </a>
              }
            >
              <address className="text-sm text-charcoal/70 not-italic">
                <p className="font-medium text-charcoal">
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
                      className="text-saffron hover:underline"
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
              <address className="text-sm text-charcoal/70 not-italic">
                <p className="font-medium text-charcoal">
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
            <TagsEditor orderId={order.id} currentTags={order.tags} />
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
