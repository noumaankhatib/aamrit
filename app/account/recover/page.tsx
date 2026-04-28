"use client";

import { useActionState } from "react";
import Link from "next/link";
import { recoverPasswordAction } from "../actions";

export default function RecoverPage() {
  const [state, formAction, isPending] = useActionState(recoverPasswordAction, {
    error: null,
    success: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white flex items-center justify-center px-4 py-16 pt-32">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-leaf/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative w-full max-w-md">

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_60px_rgba(0,0,0,0.08)] border border-white/50 p-8 sm:p-10">
          {state.success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-leaf/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-leaf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="font-serif text-2xl text-charcoal mb-3">Check your email</h1>
              <p className="text-charcoal/60 mb-6">
                We&apos;ve sent you instructions to reset your password. Please check your inbox.
              </p>
              <Link
                href="/account/login"
                className="inline-flex items-center gap-2 text-saffron hover:text-saffron-600 font-medium transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="font-serif text-3xl text-charcoal">Reset password</h1>
                <p className="mt-2 text-charcoal/60">
                  Enter your email and we&apos;ll send you a reset link
                </p>
              </div>

              {/* Error message */}
              {state.error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  {state.error}
                </div>
              )}

              <form action={formAction} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full btn-gold py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-cream-100 text-center">
                <Link
                  href="/account/login"
                  className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal text-sm transition-colors"
                >
                  <svg className="w-4 h-4 rotate-180" aria-hidden="true">
                    <use href="#i-arrow" />
                  </svg>
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
