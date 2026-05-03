"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  fulfillOrderAction, 
  cancelOrderAction, 
  updateTrackingAction,
  addOrderNoteAction,
  updateOrderTagsAction,
  closeOrderAction,
  openOrderAction,
  markOrderAsPaidAction,
  cancelFulfillmentAction
} from "../actions";

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

export function EditNoteForm({
  orderId,
  currentNote,
}: {
  orderId: string;
  currentNote: string | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState(currentNote || "");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [isEditing]);

  async function handleSave() {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await addOrderNoteAction(orderId, note);
      if (result.success) {
        setIsEditing(false);
        router.refresh();
      } else {
        setError(result.error || "Failed to save note");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isEditing) {
    return (
      <div className="group">
        {currentNote ? (
          <div className="relative">
            <p className="text-charcoal/70 text-sm whitespace-pre-wrap">{currentNote}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 px-3 py-1.5 text-xs font-medium text-saffron bg-gold/10 hover:bg-gold/20 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit note
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-3 text-sm text-charcoal/40 hover:text-charcoal/60 border-2 border-dashed border-cream-200 hover:border-gold/40 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add note
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-2.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note about this order..."
        rows={4}
        className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-charcoal placeholder-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold text-sm resize-none"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setNote(currentNote || "");
            setError(null);
          }}
          disabled={isLoading}
          className="px-3 py-1.5 text-xs font-medium text-charcoal bg-white border border-cream-200 rounded-lg hover:border-charcoal/20 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-3 py-1.5 text-xs font-medium text-white bg-saffron hover:bg-saffron-600 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : "Save note"}
        </button>
      </div>
    </div>
  );
}

export function TagsEditor({
  orderId,
  currentTags,
}: {
  orderId: string;
  currentTags: string[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>(currentTags);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const SUGGESTED_TAGS = [
    "Priority",
    "VIP Customer", 
    "Gift",
    "Fragile",
    "Rush",
    "COD",
    "Prepaid",
    "B2B",
    "Wholesale",
    "Return",
    "Exchange",
    "Follow-up",
  ];

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  function handleAddTag(tag: string) {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setNewTag("");
  }

  function handleRemoveTag(tagToRemove: string) {
    setTags(tags.filter(t => t !== tagToRemove));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(newTag);
    } else if (e.key === "Backspace" && !newTag && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  }

  async function handleSave() {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await updateOrderTagsAction(orderId, tags);
      if (result.success) {
        setIsEditing(false);
        router.refresh();
      } else {
        setError(result.error || "Failed to update tags");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  const unusedSuggestions = SUGGESTED_TAGS.filter(t => !tags.includes(t));

  if (!isEditing) {
    return (
      <div>
        {currentTags.length > 0 ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {currentTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-medium bg-cream-100 text-charcoal/70 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 text-xs font-medium text-saffron bg-gold/10 hover:bg-gold/20 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit tags
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-3 text-sm text-charcoal/40 hover:text-charcoal/60 border-2 border-dashed border-cream-200 hover:border-gold/40 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Add tags
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-2.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      <div className="p-3 bg-cream-50 border border-cream-200 rounded-xl">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-gold/10 text-saffron rounded-full group"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-saffron/60 hover:text-saffron transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? "Add a tag..." : ""}
            className="flex-1 min-w-[100px] px-2 py-1 bg-transparent text-charcoal placeholder-charcoal/40 focus:outline-none text-xs"
          />
        </div>
        <p className="text-xs text-charcoal/40">Press Enter or comma to add</p>
      </div>

      {unusedSuggestions.length > 0 && (
        <div>
          <p className="text-xs text-charcoal/50 mb-2">Suggested tags:</p>
          <div className="flex flex-wrap gap-1.5">
            {unusedSuggestions.slice(0, 6).map((tag) => (
              <button
                key={tag}
                onClick={() => handleAddTag(tag)}
                className="px-2 py-1 text-xs text-charcoal/60 bg-cream-100 hover:bg-cream-200 rounded-full transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setTags(currentTags);
            setNewTag("");
            setError(null);
          }}
          disabled={isLoading}
          className="px-3 py-1.5 text-xs font-medium text-charcoal bg-white border border-cream-200 rounded-lg hover:border-charcoal/20 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-3 py-1.5 text-xs font-medium text-white bg-saffron hover:bg-saffron-600 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : "Save tags"}
        </button>
      </div>
    </div>
  );
}

export function OrderActionsMenu({
  orderId,
  orderNumber,
  isFulfilled,
  isPaid,
  isClosed,
  isCancelled,
}: {
  orderId: string;
  orderNumber: number;
  isFulfilled: boolean;
  isPaid: boolean;
  isClosed: boolean;
  isCancelled: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleAction(action: string) {
    setIsLoading(action);
    
    try {
      let result;
      switch (action) {
        case "close":
          result = await closeOrderAction(orderId);
          break;
        case "open":
          result = await openOrderAction(orderId);
          break;
        case "markPaid":
          result = await markOrderAsPaidAction(orderId);
          break;
        default:
          return;
      }
      
      if (result.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        alert(result.error || `Failed to ${action} order`);
      }
    } catch {
      alert("An error occurred");
    } finally {
      setIsLoading(null);
    }
  }

  if (isCancelled) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2.5 text-sm font-medium text-charcoal bg-white border border-cream-200 rounded-xl hover:border-gold/40 hover:shadow-e1 transition-all"
      >
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-cream-200 rounded-xl shadow-e2 py-2 z-50">
          <div className="px-3 py-1.5 text-xs font-semibold text-charcoal/40 uppercase tracking-wider">
            Order Actions
          </div>
          
          {!isPaid && (
            <button
              onClick={() => handleAction("markPaid")}
              disabled={isLoading === "markPaid"}
              className="w-full px-3 py-2 text-left text-sm text-charcoal hover:bg-cream-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading === "markPaid" ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-leaf-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              Mark as paid
            </button>
          )}
          
          {isClosed ? (
            <button
              onClick={() => handleAction("open")}
              disabled={isLoading === "open"}
              className="w-full px-3 py-2 text-left text-sm text-charcoal hover:bg-cream-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading === "open" ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
              Reopen order
            </button>
          ) : (
            <button
              onClick={() => handleAction("close")}
              disabled={isLoading === "close"}
              className="w-full px-3 py-2 text-left text-sm text-charcoal hover:bg-cream-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading === "close" ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-charcoal/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              )}
              Archive order
            </button>
          )}

          <div className="my-2 border-t border-cream-100" />
          
          <a
            href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/orders/${orderNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-3 py-2 text-left text-sm text-charcoal hover:bg-cream-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-charcoal/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View in Shopify
          </a>
        </div>
      )}
    </div>
  );
}

export function CancelFulfillmentButton({
  fulfillmentId,
}: {
  fulfillmentId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this fulfillment? This will mark the order as unfulfilled again.")) {
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await cancelFulfillmentAction(fulfillmentId);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to cancel fulfillment");
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
      className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
      title="Cancel fulfillment"
    >
      {isLoading ? (
        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      Cancel
    </button>
  );
}
