"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "../actions";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, { error: null });

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white flex items-center justify-center px-4 py-16 pt-32">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-leaf/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative w-full max-w-md">

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_60px_rgba(0,0,0,0.08)] border border-white/50 p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-charcoal">Create account</h1>
            <p className="mt-2 text-charcoal/60">Join us for fresh mangoes</p>
          </div>

          {/* Error message */}
          {state.error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-charcoal mb-2">
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  autoComplete="given-name"
                  className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-charcoal mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  autoComplete="family-name"
                  className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                Email address <span className="text-red-500">*</span>
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

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-2">
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                autoComplete="tel"
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                placeholder="••••••••"
              />
              <p className="mt-1.5 text-xs text-charcoal/50">
                Must be at least 8 characters
              </p>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptsMarketing"
                name="acceptsMarketing"
                className="mt-1 w-4 h-4 rounded border-cream-300 text-gold focus:ring-gold/30"
              />
              <label htmlFor="acceptsMarketing" className="text-sm text-charcoal/70">
                Send me updates about new products, seasonal offers, and farm news
              </label>
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
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>

            <p className="text-xs text-charcoal/50 text-center">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-saffron hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-saffron hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>

          <div className="mt-8 pt-6 border-t border-cream-100 text-center">
            <p className="text-charcoal/60 text-sm">
              Already have an account?{" "}
              <Link
                href="/account/login"
                className="text-saffron hover:text-saffron-600 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
