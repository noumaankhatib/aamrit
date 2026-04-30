"use client";

import { useState, useTransition, useActionState, useEffect } from "react";
import type { ShopifyAddress, ShopifyCustomer } from "@/lib/shopify-customer";
import {
  addAddressAction,
  updateAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/app/account/actions";

type Mode = { kind: "closed" } | { kind: "add" } | { kind: "edit"; address: ShopifyAddress };

export default function AddressManager({ customer }: { customer: ShopifyCustomer }) {
  const [mode, setMode] = useState<Mode>({ kind: "closed" });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-charcoal/70">
          {customer.addresses.length === 0
            ? "Add a delivery address to speed up checkout."
            : `${customer.addresses.length} saved ${customer.addresses.length === 1 ? "address" : "addresses"}`}
        </p>
        <button
          type="button"
          onClick={() => setMode({ kind: "add" })}
          className="btn-gold px-5 py-2.5 rounded-xl text-white text-sm font-medium inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add address
        </button>
      </div>

      {customer.addresses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-cream-100">
          <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-charcoal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="font-serif text-xl text-charcoal mb-2">No saved addresses</h3>
          <p className="text-charcoal/60">Add one to make checkout faster next time.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {customer.addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isDefault={customer.defaultAddress?.id === address.id}
              onEdit={() => setMode({ kind: "edit", address })}
            />
          ))}
        </div>
      )}

      {mode.kind !== "closed" && (
        <AddressDialog
          mode={mode}
          onClose={() => setMode({ kind: "closed" })}
        />
      )}
    </div>
  );
}

function AddressCard({
  address,
  isDefault,
  onEdit,
}: {
  address: ShopifyAddress;
  isDefault: boolean;
  onEdit: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const fullName = [address.firstName, address.lastName].filter(Boolean).join(" ");
  const lines = [
    address.address1,
    address.address2,
    [address.city, address.province, address.zip].filter(Boolean).join(", "),
    address.country,
  ].filter(Boolean);

  function handleDelete() {
    if (!confirm("Delete this address?")) return;
    setError(null);
    startTransition(async () => {
      const res = await deleteAddressAction(address.id);
      if (res.error) setError(res.error);
    });
  }

  function handleSetDefault() {
    setError(null);
    startTransition(async () => {
      const res = await setDefaultAddressAction(address.id);
      if (res.error) setError(res.error);
    });
  }

  return (
    <div className={`relative bg-white rounded-2xl border p-6 transition-colors ${isDefault ? "border-gold" : "border-cream-100"}`}>
      {isDefault && (
        <span className="absolute top-4 right-4 px-2 py-1 rounded-full bg-gold/10 text-saffron text-xs font-medium">
          Default
        </span>
      )}

      {fullName && <p className="font-semibold text-charcoal mb-2">{fullName}</p>}

      <div className="text-sm text-charcoal/70 space-y-0.5">
        {lines.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
        {address.phone && <p className="pt-2">{address.phone}</p>}
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-600">{error}</p>
      )}

      <div className="mt-5 pt-4 border-t border-cream-100 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onEdit}
          disabled={isPending}
          className="text-sm font-medium text-charcoal hover:text-saffron disabled:opacity-50"
        >
          Edit
        </button>
        {!isDefault && (
          <button
            type="button"
            onClick={handleSetDefault}
            disabled={isPending}
            className="text-sm font-medium text-charcoal/70 hover:text-saffron disabled:opacity-50"
          >
            Set default
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="ml-auto text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          {isPending ? "Working…" : "Delete"}
        </button>
      </div>
    </div>
  );
}

function AddressDialog({ mode, onClose }: { mode: Mode; onClose: () => void }) {
  const isEdit = mode.kind === "edit";
  const initial = isEdit ? mode.address : null;

  const action = isEdit
    ? updateAddressAction.bind(null, initial!.id)
    : addAddressAction;

  const [state, formAction, isPending] = useActionState(action, { error: null, success: false });

  useEffect(() => {
    if (state.success) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-charcoal/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-2xl shadow-e3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-cream-100 flex items-center justify-between">
          <h2 className="font-serif text-xl text-charcoal">
            {isEdit ? "Edit address" : "Add address"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full inline-flex items-center justify-center hover:bg-cream-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-charcoal/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form action={formAction} className="p-6 space-y-4">
          {state.error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" name="firstName" defaultValue={initial?.firstName ?? ""} />
            <Field label="Last name" name="lastName" defaultValue={initial?.lastName ?? ""} />
          </div>

          <Field label="Company (optional)" name="company" defaultValue={initial?.company ?? ""} />
          <Field label="Address line 1" name="address1" defaultValue={initial?.address1 ?? ""} required />
          <Field label="Address line 2 (optional)" name="address2" defaultValue={initial?.address2 ?? ""} />

          <div className="grid grid-cols-2 gap-3">
            <Field label="City" name="city" defaultValue={initial?.city ?? ""} required />
            <Field label="PIN code" name="zip" defaultValue={initial?.zip ?? ""} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="State" name="zoneCode" defaultValue={initial?.provinceCode ?? ""} placeholder="MH" />
            <Field label="Country code" name="territoryCode" defaultValue={initial?.countryCode ?? "IN"} placeholder="IN" />
          </div>

          <Field label="Phone" name="phoneNumber" type="tel" defaultValue={initial?.phone ?? ""} />

          <label className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              name="setDefault"
              className="mt-1 w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold/30"
            />
            <span className="text-sm text-charcoal/70">Set as default delivery address</span>
          </label>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="btn-gold px-6 py-3 rounded-xl text-white font-medium disabled:opacity-50"
            >
              {isPending ? "Saving…" : isEdit ? "Save changes" : "Add address"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-cream-200 hover:border-charcoal/40 text-charcoal/80 hover:text-charcoal text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | null;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-charcoal mb-1.5">
        {label}
        {required && <span className="text-saffron"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
      />
    </div>
  );
}
