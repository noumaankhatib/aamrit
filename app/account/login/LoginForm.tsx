"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction } from "../actions";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const registered = searchParams.get("registered");

  const [state, formAction, isPending] = useActionState(loginAction, { error: null });

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white flex items-center justify-center px-4 py-16 pt-32">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-leaf/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative w-full max-w-md">

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_60px_rgba(0,0,0,0.08)] border border-white/50 p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-charcoal">Welcome back</h1>
            <p className="mt-2 text-charcoal/60">
              Sign in to your account to continue.
            </p>
          </div>

          {registered && (
            <div className="mb-6 p-4 rounded-xl bg-leaf/10 border border-leaf/20 text-leaf-700 text-sm">
              Account created successfully! Sign in below.
            </div>
          )}

          {state.error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-charcoal">
                  Password
                </label>
                <Link
                  href="/account/recover"
                  className="text-sm text-saffron hover:text-saffron-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                placeholder="••••••••"
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
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-cream-100 text-center">
            <p className="text-charcoal/60 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/account/register"
                className="text-saffron hover:text-saffron-600 font-medium transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
