import Link from "next/link";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link has expired or has already been used.",
    OAuthSignin: "Error in the OAuth sign-in process.",
    OAuthCallback: "Error in the OAuth callback.",
    OAuthCreateAccount: "Could not create OAuth account.",
    EmailCreateAccount: "Could not create email account.",
    Callback: "Error in the callback handler.",
    OAuthAccountNotLinked: "This email is already linked to another account.",
    Default: "An unexpected error occurred.",
  };

  const error = searchParams.error || "Default";
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 flex items-center justify-center px-4 py-12 pt-32">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-red-50/30 via-transparent to-transparent" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-red-100/20 blur-3xl" />
      </div>
      
      <div className="relative w-full max-w-md text-center">
        <div className="bg-white rounded-3xl shadow-e3 p-8 sm:p-10 border border-cream-100/50">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow-lg shadow-red-100/50 transform rotate-3">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-serif font-semibold text-charcoal mb-3">
            Authentication Error
          </h1>
          <p className="text-charcoal/60 mb-8 leading-relaxed">{errorMessage}</p>

          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full px-5 py-4 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-white font-semibold rounded-2xl shadow-lg shadow-gold/25 hover:shadow-gold/35 transition-all"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full px-5 py-4 border-2 border-cream-200 text-charcoal/70 font-semibold rounded-2xl hover:bg-cream-50 hover:border-cream-300 transition-all"
            >
              Go to Shop
            </Link>
          </div>
        </div>
        
        {/* Help link */}
        <p className="mt-8 text-sm text-charcoal/50">
          Still having trouble?{" "}
          <a href="mailto:hello@aamrit.in" className="text-gold-600 hover:underline font-medium">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
