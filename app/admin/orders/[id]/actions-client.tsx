"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fulfillOrderAction, cancelOrderAction } from "../actions";

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
        className="px-3 py-1.5 text-sm font-medium text-white bg-[#1a4d2e] hover:bg-[#22633a] rounded-lg transition-colors"
      >
        Mark as fulfilled
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#222] border border-[#333] rounded-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#333]">
          <h3 className="font-medium text-white">Fulfill order #{orderNumber}</h3>
          <button
            onClick={() => setIsOpen(false)}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form action={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#888] mb-1">
                Tracking company (optional)
              </label>
              <input
                type="text"
                name="trackingCompany"
                placeholder="e.g., Delhivery, BlueDart"
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#444] rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#888] mb-1">
                Tracking number (optional)
              </label>
              <input
                type="text"
                name="trackingNumber"
                placeholder="e.g., AWB123456789"
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#444] rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#888] mb-1">
                Tracking URL (optional)
              </label>
              <input
                type="url"
                name="trackingUrl"
                placeholder="https://..."
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#444] rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-[#b5b5b5]">
              <input
                type="checkbox"
                name="notifyCustomer"
                defaultChecked
                className="w-4 h-4 rounded border-[#444] bg-[#2a2a2a] text-gold focus:ring-gold/50 focus:ring-offset-0"
              />
              Send notification email to customer
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-[#2a2a2a] border border-[#444] rounded-lg hover:bg-[#333] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1a4d2e] hover:bg-[#22633a] rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? "Fulfilling..." : "Fulfill items"}
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
  const [isOpen, setIsOpen] = useState(false);
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
      className="w-full px-4 py-2 text-sm font-medium text-[#f87171] bg-[#4d1a1a]/50 border border-[#4d1a1a] rounded-lg hover:bg-[#4d1a1a] transition-colors disabled:opacity-50"
    >
      {isLoading ? "Cancelling..." : "Cancel order"}
    </button>
  );
}
