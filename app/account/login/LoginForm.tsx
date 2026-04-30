"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/account";
  const registered = searchParams.get("registered");
  const error = searchParams.get("error");

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect to Shopify's Customer Account OAuth (which has Google configured)
  const shopifyOAuthUrl = `/api/auth/shopify-account/start${
    redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
  }`;

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    // Redirect to Shopify OAuth which handles Google login
    window.location.href = shopifyOAuthUrl;
  };

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEmailLoading(true);
    setFormError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setFormError(data.error || "Invalid email or password.");
        setIsEmailLoading(false);
      } else {
        window.location.href = redirectTo;
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
      setIsEmailLoading(false);
    }
  };

  const getErrorMessage = (err: string | null) => {
    if (!err) return null;
    switch (err) {
      case "oauth_not_configured":
        return "Google sign-in is being set up. Please use email login for now.";
      case "missing_shop_domain":
        return "Store configuration error. Please contact support.";
      case "discovery_failed":
        return "Could not connect to authentication service. Please try again.";
      default:
        return "Login failed. Please try again.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-gold/5 flex items-center justify-center px-4 py-16 pt-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-gold/20 to-saffron/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-leaf/10 to-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gold/5 to-transparent rounded-full" />
        
        {/* Floating mango shapes */}
        <motion.div
          className="absolute top-1/4 right-1/4 text-6xl opacity-10"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          🥭
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-1/5 text-4xl opacity-10"
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          🥭
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-4xl mb-2"
            >
              🥭
            </motion.div>
            <span className="font-serif text-2xl text-charcoal tracking-wide">Aamrit</span>
          </Link>
        </div>

        {/* Main card */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-white/60 p-8 sm:p-10 relative overflow-hidden">
          {/* Card accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-saffron to-gold" />
          
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl sm:text-4xl text-charcoal"
            >
              Welcome back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-charcoal/60"
            >
              Sign in to access your account
            </motion.p>
          </div>

          {/* Success message */}
          {registered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-leaf/10 to-emerald-50 border border-leaf/20 text-leaf-700 text-sm flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-leaf/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-leaf" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Account created successfully! Sign in below.</span>
            </motion.div>
          )}

          {/* Error message */}
          {(formError || error) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 text-red-600 text-sm flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <span>{formError || getErrorMessage(error)}</span>
            </motion.div>
          )}

          {/* Google Sign In - Primary */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-cream-200 rounded-2xl font-semibold text-charcoal hover:border-gold/50 hover:shadow-xl hover:shadow-gold/10 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            {isGoogleLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin text-charcoal/60" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Redirecting to Shopify...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="relative z-10">Continue with Google</span>
                <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </motion.button>

          {/* Quick & secure badge */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-charcoal/40">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure sign-in via Shopify</span>
          </div>

          {/* Toggle email form */}
          {!showEmailForm ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-center"
            >
              <button
                onClick={() => setShowEmailForm(true)}
                className="text-sm text-charcoal/50 hover:text-charcoal transition-colors inline-flex items-center gap-2 group"
              >
                <span>Use email instead</span>
                <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cream-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white/70 text-xs text-charcoal/40 uppercase tracking-wider font-medium">
                    Or use email
                  </span>
                </div>
              </div>

              <form onSubmit={handleEmailSignIn} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                    Email address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 pl-11 rounded-xl border-2 border-cream-200 bg-white/80 focus:outline-none focus:ring-0 focus:border-gold transition-colors placeholder:text-charcoal/30"
                      placeholder="you@example.com"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30 group-focus-within:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-charcoal">
                      Password
                    </label>
                    <Link
                      href="/account/recover"
                      className="text-sm text-saffron hover:text-saffron-600 transition-colors font-medium"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative group">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3.5 pl-11 rounded-xl border-2 border-cream-200 bg-white/80 focus:outline-none focus:ring-0 focus:border-gold transition-colors placeholder:text-charcoal/30"
                      placeholder="••••••••"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30 group-focus-within:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isEmailLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-gradient-to-r from-gold via-saffron to-gold bg-[length:200%_100%] hover:bg-right py-3.5 rounded-xl font-semibold text-white transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30"
                >
                  {isEmailLoading ? (
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
                </motion.button>
              </form>

              <button
                onClick={() => setShowEmailForm(false)}
                className="mt-4 w-full text-center text-sm text-charcoal/40 hover:text-charcoal transition-colors"
              >
                Back to Google sign-in
              </button>
            </motion.div>
          )}

          {/* Create account link */}
          <div className="mt-8 pt-6 border-t border-cream-100/50 text-center">
            <p className="text-charcoal/60 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/account/register"
                className="text-saffron hover:text-saffron-600 font-semibold transition-colors inline-flex items-center gap-1 group"
              >
                Create one
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </p>
          </div>
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-6 text-xs text-charcoal/40"
        >
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Privacy Protected</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
