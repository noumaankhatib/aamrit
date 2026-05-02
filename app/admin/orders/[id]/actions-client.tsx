"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fulfillOrderAction, cancelOrderAction, updateTrackingAction } from "../actions";

export function FulfillOrderForm({
  orderId,
  orderNumber,
}: {
  orderId: string;
  orderNumber: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await fulfillOrderAction(orderId, formData);
      if (result.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        alert(result.error || "Failed to fulfill order");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-leaf hover:bg-leaf-600 rounded-xl transition-colors"
      >
        Mark as fulfilled
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm">
      <div className="bg-white border border-cream-200 rounded-2xl w-full max-w-md mx-4 shadow-e3">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-100">
          <h3 className="font-serif font-semibold text-charcoal">Fulfill order #{orderNumber}</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-charcoal/40 hover:text-charcoal transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form action={handleSubmit} className="p-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Tracking company (optional)
              </label>
              <input
                type="text"
                name="trackingCompany"
                placeholder="e.g., Delhivery, BlueDart"
                className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Tracking number (optional)
              </label>
              <input
                type="text"
                name="trackingNumber"
                placeholder="e.g., AWB123456789"
                className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Tracking URL (optional)
              </label>
              <input
                type="url"
                name="trackingUrl"
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm"
              />
            </div>
            <label className="flex items-center gap-2.5 text-sm text-charcoal/70">
              <input
                type="checkbox"
                name="notifyCustomer"
                defaultChecked
                className="w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold/30 focus:ring-offset-0"
              />
              Send notification email to customer
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-charcoal bg-white border border-cream-200 rounded-xl hover:border-charcoal/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium text-white bg-leaf hover:bg-leaf-600 rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoading ? "Fulfilling..." : "Fulfill items"}
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
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await updateTrackingAction(fulfillmentId, formData);
      if (result.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        alert(result.error || "Failed to update tracking");
      }
    } catch {
      alert("An error occurred");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm">
      <div className="bg-white border border-cream-200 rounded-2xl w-full max-w-md mx-4 shadow-e3">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-100">
          <h3 className="font-serif font-semibold text-charcoal">Update tracking information</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-charcoal/40 hover:text-charcoal transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form action={handleSubmit} className="p-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Courier / Shipping company
              </label>
              <select
                name="trackingCompany"
                defaultValue={currentCompany || ""}
                className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm"
              >
                <option value="">Select courier...</option>
                <option value="Delhivery">Delhivery</option>
                <option value="BlueDart">BlueDart</option>
                <option value="DTDC">DTDC</option>
                <option value="Ecom Express">Ecom Express</option>
                <option value="FedEx">FedEx</option>
                <option value="India Post">India Post</option>
                <option value="Xpressbees">Xpressbees</option>
                <option value="Shadowfax">Shadowfax</option>
                <option value="Amazon Shipping">Amazon Shipping</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                AWB / Tracking number
              </label>
              <input
                type="text"
                name="trackingNumber"
                defaultValue={currentNumber || ""}
                placeholder="e.g., AWB123456789"
                className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Tracking URL
              </label>
              <input
                type="url"
                name="trackingUrl"
                defaultValue={currentUrl || ""}
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm"
              />
              <p className="mt-1.5 text-xs text-charcoal/50">
                If left empty, a default tracking URL will be generated based on the courier
              </p>
            </div>
            <label className="flex items-center gap-2.5 text-sm text-charcoal/70 p-3 bg-cream-50 rounded-xl">
              <input
                type="checkbox"
                name="notifyCustomer"
                defaultChecked
                className="w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold/30 focus:ring-offset-0"
              />
              <div>
                <span className="font-medium text-charcoal">Send notification to customer</span>
                <p className="text-xs text-charcoal/50 mt-0.5">Customer will receive email with updated tracking</p>
              </div>
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-charcoal bg-white border border-cream-200 rounded-xl hover:border-charcoal/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium text-white bg-saffron hover:bg-saffron-600 rounded-xl transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
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
