import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function UnauthorizedPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 flex items-center justify-center px-4 py-12 pt-32">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-red-50/30 via-transparent to-transparent" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-red-100/20 blur-3xl" />
      </div>
      
      <div className="relative w-full max-w-md text-center">
        <div className="bg-white rounded-3xl shadow-e3 p-8 sm:p-10 border border-cream-100/50">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow-lg shadow-red-100/50 transform -rotate-3">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-serif font-semibold text-charcoal mb-3">
            Access Denied
          </h1>
          <p className="text-charcoal/60 mb-2 leading-relaxed">
            You don&apos;t have permission to access the admin panel.
          </p>
          {session?.user?.email && (
            <p className="text-sm text-charcoal/40 mb-6 px-4 py-2 bg-cream-50 rounded-xl inline-block">
              Signed in as: <span className="font-medium text-charcoal/60">{session.user.email}</span>
            </p>
          )}

          <div className="space-y-3 mt-6">
            <Link
              href="/"
              className="block w-full px-5 py-4 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-white font-semibold rounded-2xl shadow-lg shadow-gold/25 hover:shadow-gold/35 transition-all"
            >
              Go to Shop
            </Link>

            {session && (
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="w-full px-5 py-4 border-2 border-cream-200 text-charcoal/70 font-semibold rounded-2xl hover:bg-cream-50 hover:border-cream-300 transition-all"
                >
                  Sign out
                </button>
              </form>
            )}
          </div>
        </div>
        
        {/* Help link */}
        <p className="mt-8 text-sm text-charcoal/50">
          Need admin access?{" "}
          <a href="mailto:hello@aamrit.in" className="text-gold-600 hover:underline font-medium">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
