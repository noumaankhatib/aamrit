import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  const session = await auth();

  if (session) {
    redirect(searchParams.callbackUrl || "/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 flex items-center justify-center px-4 py-12 pt-32">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-gold-50/60 via-transparent to-leaf/5" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gold-100/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-leaf/5 blur-3xl" />
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-e3 p-8 sm:p-10 border border-cream-100/50">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-semibold text-charcoal tracking-tight">
              Sign In
            </h1>
            <p className="mt-2 text-charcoal/60">Sign in to your account</p>
          </div>

          {/* Error message */}
          {searchParams.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>
                {searchParams.error === "OAuthAccountNotLinked"
                  ? "This email is already associated with another account."
                  : "An error occurred during sign in. Please try again."}
              </span>
            </div>
          )}

          {/* OAuth buttons */}
          <div className="space-y-3">
            <form
              action={async () => {
                "use server";
                await signIn("google", {
                  redirectTo: searchParams.callbackUrl || "/",
                });
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-white border-2 border-cream-200 rounded-2xl font-semibold text-charcoal hover:bg-cream-50 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10 transition-all duration-200 group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="group-hover:translate-x-0.5 transition-transform">Continue with Google</span>
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-xs text-charcoal/40 uppercase tracking-wider">Secure login</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 text-xs text-charcoal/50">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-leaf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              SSL Secure
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-leaf" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Privacy Protected
            </span>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-charcoal/40 leading-relaxed">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-gold-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-gold-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
