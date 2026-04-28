import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_60px_rgba(0,0,0,0.08)] border border-white/50 p-8 sm:p-10">
          <div className="animate-pulse">
            <div className="h-8 bg-cream-200 rounded w-40 mx-auto mb-4" />
            <div className="h-4 bg-cream-200 rounded w-32 mx-auto mb-8" />
            <div className="space-y-5">
              <div className="h-12 bg-cream-200 rounded-xl" />
              <div className="h-12 bg-cream-200 rounded-xl" />
              <div className="h-12 bg-cream-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
