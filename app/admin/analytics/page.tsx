import Link from "next/link";

export default function AnalyticsPage() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN ?? "";

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Analytics</h1>
          <p className="text-charcoal/60 mt-1">
            View detailed store analytics and reports
          </p>
        </div>
        {domain && (
          <a
            href={`https://${domain}/admin/analytics`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-b from-gold-300 to-gold text-sm font-medium text-white hover:shadow-glow transition-all"
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
                strokeWidth={1.5}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            View Analytics
          </a>
        )}
      </div>

      <div className="bg-white border border-cream-200 rounded-2xl p-12 text-center shadow-soft">
        <div className="w-20 h-20 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-charcoal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="font-serif text-xl text-charcoal mb-2">Store Analytics</h2>
        <p className="text-charcoal/60 mb-6 max-w-md mx-auto">
          Detailed analytics, reports, and insights are available in the store dashboard. Click the button below to access your analytics.
        </p>
        {domain && (
          <a
            href={`https://${domain}/admin/analytics`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Analytics Dashboard
          </a>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href={domain ? `https://${domain}/admin/reports` : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-5 bg-white border border-cream-200 rounded-2xl hover:border-gold/40 hover:shadow-e1 transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-charcoal">Reports</p>
            <p className="text-sm text-charcoal/50">Sales & finance reports</p>
          </div>
        </a>

        <a
          href={domain ? `https://${domain}/admin/analytics/dashboards` : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-5 bg-white border border-cream-200 rounded-2xl hover:border-gold/40 hover:shadow-e1 transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-charcoal">Dashboards</p>
            <p className="text-sm text-charcoal/50">Visual data overview</p>
          </div>
        </a>

        <a
          href={domain ? `https://${domain}/admin/shopify_audiences` : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-5 bg-white border border-cream-200 rounded-2xl hover:border-gold/40 hover:shadow-e1 transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-charcoal">Audiences</p>
            <p className="text-sm text-charcoal/50">Customer segments</p>
          </div>
        </a>
      </div>

      <div className="mt-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-saffron hover:text-saffron-700 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
