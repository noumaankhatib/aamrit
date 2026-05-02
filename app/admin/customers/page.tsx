import Link from "next/link";

export default function CustomersPage() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN ?? "";

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Customers</h1>
          <p className="text-charcoal/60 mt-1">
            Manage customers through Shopify Admin
          </p>
        </div>
        {domain && (
          <a
            href={`https://${domain}/admin/customers`}
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
            Open in Shopify
          </a>
        )}
      </div>

      <div className="bg-white border border-cream-200 rounded-2xl p-12 text-center shadow-soft">
        <div className="w-20 h-20 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-charcoal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="font-serif text-xl text-charcoal mb-2">Customer Management</h2>
        <p className="text-charcoal/60 mb-6 max-w-md mx-auto">
          Customer data is managed through Shopify Admin. Click the button below to view and manage your customers.
        </p>
        {domain && (
          <a
            href={`https://${domain}/admin/customers`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Go to Shopify Customers
          </a>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/orders"
          className="flex items-center gap-4 p-5 bg-white border border-cream-200 rounded-2xl hover:border-gold/40 hover:shadow-e1 transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-charcoal">View Orders</p>
            <p className="text-sm text-charcoal/50">See customer orders here</p>
          </div>
        </Link>

        <Link
          href="/admin"
          className="flex items-center gap-4 p-5 bg-white border border-cream-200 rounded-2xl hover:border-gold/40 hover:shadow-e1 transition-all group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-charcoal">Back to Dashboard</p>
            <p className="text-sm text-charcoal/50">Return to admin home</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
