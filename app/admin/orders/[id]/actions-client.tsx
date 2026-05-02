"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fulfillOrderAction, cancelOrderAction, updateTrackingAction } from "../actions";

const COURIER_OPTIONS = [
  { value: "", label: "Select courier..." },
  { value: "Delhivery", label: "Delhivery", trackingUrl: "https://www.delhivery.com/track/package/" },
  { value: "BlueDart", label: "BlueDart", trackingUrl: "https://www.bluedart.com/tracking/" },
  { value: "DTDC", label: "DTDC", trackingUrl: "https://www.dtdc.in/tracking.asp?awbno=" },
  { value: "Ecom Express", label: "Ecom Express", trackingUrl: "https://www.ecomexpress.in/tracking/" },
  { value: "FedEx", label: "FedEx", trackingUrl: "https://www.fedex.com/fedextrack/?trknbr=" },
  { value: "India Post", label: "India Post", trackingUrl: "https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx?ConsignmentNo=" },
  { value: "Xpressbees", label: "Xpressbees", trackingUrl: "https://www.xpressbees.com/track/" },
  { value: "Shadowfax", label: "Shadowfax", trackingUrl: "https://www.shadowfax.in/track/" },
  { value: "Amazon Shipping", label: "Amazon Shipping", trackingUrl: "" },
  { value: "Shiprocket", label: "Shiprocket", trackingUrl: "https://www.shiprocket.in/tracking/" },
  { value: "Ekart", label: "Ekart Logistics", trackingUrl: "https://ekartlogistics.com/track/" },
  { value: "Other", label: "Other", trackingUrl: "" },
];

function generateTrackingUrl(company: string, trackingNumber: string): string {
  const courier = COURIER_OPTIONS.find(c => c.value === company);
  if (courier?.trackingUrl && trackingNumber) {
    return courier.trackingUrl + trackingNumber;
  }
  return "";
}

export function FulfillOrderForm({
  orderId,
  orderNumber,
}: {
  orderId: string;
  orderNumber: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourier, setSelectedCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [customTrackingUrl, setCustomTrackingUrl] = useState("");
  const router = useRouter();

  const autoTrackingUrl = generateTrackingUrl(selectedCourier, trackingNumber);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("trackingCompany", selectedCourier);
    formData.set("trackingNumber", trackingNumber);
    formData.set("trackingUrl", customTrackingUrl || autoTrackingUrl);

    try {
      const result = await fulfillOrderAction(orderId, formData);
      if (result.success) {
        setIsOpen(false);
        setSelectedCourier("");
        setTrackingNumber("");
        setCustomTrackingUrl("");
        router.refresh();
      } else {
        setError(result.error || "Failed to fulfill order");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-leaf hover:bg-leaf-600 rounded-xl transition-colors inline-flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Mark as fulfilled
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4">
      <div className="bg-white border border-cream-200 rounded-2xl w-full max-w-lg shadow-e3">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-100">
          <div>
            <h3 className="font-serif font-semibold text-charcoal">Fulfill order #{orderNumber}</h3>
            <p className="text-xs text-charcoal/50 mt-0.5">Add tracking details and mark as shipped</p>
          </div>
          <button
            onClick={() => { setIsOpen(false); setError(null); }}
            className="text-charcoal/40 hover:text-charcoal transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            <div className="p-4 bg-cream-50 rounded-xl border border-cream-100">
              <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-3">
                Shipping Information
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    Courier / Shipping carrier
                  </label>
                  <select
                    value={selectedCourier}
                    onChange={(e) => setSelectedCourier(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-cream-200 rounded-xl text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm"
                  >
                    {COURIER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    AWB / Tracking number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g., 1234567890"
                    className="w-full px-4 py-2.5 bg-white border border-cream-200 rounded-xl text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm font-mono"
                  />
                </div>

                {(selectedCourier === "Other" || selectedCourier === "Amazon Shipping") && (
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">
                      Tracking URL
                    </label>
                    <input
                      type="url"
                      value={customTrackingUrl}
                      onChange={(e) => setCustomTrackingUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-white border border-cream-200 rounded-xl text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm"
                    />
                  </div>
                )}

                {autoTrackingUrl && !customTrackingUrl && (
                  <div className="p-3 bg-leaf/5 border border-leaf/20 rounded-lg">
                    <p className="text-xs text-leaf-700 font-medium mb-1">Auto-generated tracking link:</p>
                    <a 
                      href={autoTrackingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-saffron hover:underline break-all"
                    >
                      {autoTrackingUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-cream-50 rounded-xl border border-cream-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="notifyCustomer"
                  defaultChecked
                  className="mt-0.5 w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold/30 focus:ring-offset-0"
                />
                <div>
                  <span className="text-sm font-medium text-charcoal">Notify customer via email</span>
                  <p className="text-xs text-charcoal/50 mt-0.5">
                    Customer will receive shipment confirmation with tracking details
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-cream-100">
            <button
              type="button"
              onClick={() => { setIsOpen(false); setError(null); }}
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium text-charcoal bg-white border border-cream-200 rounded-xl hover:border-charcoal/20 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-leaf hover:bg-leaf-600 rounded-xl transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Fulfill order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function UpdateTrackingForm({
  fulfillmentId,
  currentCompany,
  currentNumber,
  currentUrl,
}: {
  fulfillmentId: string;
  currentCompany?: string | null;
  currentNumber?: string | null;
  currentUrl?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourier, setSelectedCourier] = useState(currentCompany || "");
  const [trackingNumber, setTrackingNumber] = useState(currentNumber || "");
  const [customTrackingUrl, setCustomTrackingUrl] = useState(currentUrl || "");
  const router = useRouter();

  const autoTrackingUrl = generateTrackingUrl(selectedCourier, trackingNumber);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("trackingCompany", selectedCourier);
    formData.set("trackingNumber", trackingNumber);
    formData.set("trackingUrl", customTrackingUrl || autoTrackingUrl);
    formData.set("notifyCustomer", "on");

    try {
      const result = await updateTrackingAction(fulfillmentId, formData);
      if (result.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setError(result.error || "Failed to update tracking");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 text-xs font-medium text-saffron bg-gold/10 hover:bg-gold/20 rounded-lg transition-colors inline-flex items-center gap-1.5"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Edit tracking
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4">
      <div className="bg-white border border-cream-200 rounded-2xl w-full max-w-lg shadow-e3">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-100">
          <div>
            <h3 className="font-serif font-semibold text-charcoal">Update tracking</h3>
            <p className="text-xs text-charcoal/50 mt-0.5">Modify shipment tracking details</p>
          </div>
          <button
            onClick={() => { setIsOpen(false); setError(null); }}
            className="text-charcoal/40 hover:text-charcoal transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Courier / Shipping carrier
              </label>
              <select
                value={selectedCourier}
                onChange={(e) => setSelectedCourier(e.target.value)}
                className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm"
              >
                {COURIER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                AWB / Tracking number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g., 1234567890"
                className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm font-mono"
              />
            </div>

            {(selectedCourier === "Other" || selectedCourier === "Amazon Shipping" || !autoTrackingUrl) && (
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Tracking URL
                </label>
                <input
                  type="url"
                  value={customTrackingUrl}
                  onChange={(e) => setCustomTrackingUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm"
                />
              </div>
            )}

            {autoTrackingUrl && !customTrackingUrl && (
              <div className="p-3 bg-leaf/5 border border-leaf/20 rounded-lg">
                <p className="text-xs text-leaf-700 font-medium mb-1">Auto-generated tracking link:</p>
                <a 
                  href={autoTrackingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-saffron hover:underline break-all"
                >
                  {autoTrackingUrl}
                </a>
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer p-3 bg-cream-50 rounded-xl">
              <input
                type="checkbox"
                name="notifyCustomer"
                defaultChecked
                className="mt-0.5 w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold/30 focus:ring-offset-0"
              />
              <div>
                <span className="text-sm font-medium text-charcoal">Notify customer</span>
                <p className="text-xs text-charcoal/50 mt-0.5">Send email with updated tracking info</p>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-cream-100">
            <button
              type="button"
              onClick={() => { setIsOpen(false); setError(null); }}
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium text-charcoal bg-white border border-cream-200 rounded-xl hover:border-charcoal/20 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-saffron hover:bg-saffron-600 rounded-xl transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Update tracking"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CancelOrderButton({
  orderId,
  orderNumber,
}: {
  orderId: string;
  orderNumber: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this order? This will also refund the customer.")) {
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await cancelOrderAction(orderId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to cancel order");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={isLoading}
      className="w-full px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
    >
      {isLoading ? "Cancelling..." : "Cancel order"}
    </button>
  );
}
