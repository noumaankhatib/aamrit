import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import { formatINR } from "@/lib/money";

export const revalidate = 60;

function productGidToLegacyId(gid: string): string {
  return gid.split("/").pop() ?? "";
}

export default async function AdminProductsPage() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN ?? "";
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let fetchError: string | null = null;

  try {
    products = await getProducts({ first: 50 });
  } catch {
    fetchError =
      "Could not load products from Shopify. Check SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.";
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-charcoal">Products</h1>
          <p className="text-charcoal/60 mt-1">
            Catalogue preview · manage inventory in store settings
          </p>
        </div>
        {domain && (
          <a
            href={`https://${domain}/admin/products`}
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
            Manage Products
          </a>
        )}
      </div>

      {fetchError && (
        <div className="mb-6 rounded-2xl border border-saffron/30 bg-gold/10 px-5 py-4 text-sm text-saffron">
          {fetchError}
        </div>
      )}

      {!fetchError && products.length === 0 && (
        <div className="rounded-2xl border border-cream-200 bg-white p-12 text-center shadow-soft">
          <div className="w-16 h-16 mx-auto rounded-full bg-cream-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-charcoal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-charcoal/70 font-medium mb-2">No active products returned from the API.</p>
          <p className="text-sm text-charcoal/50">
            Publish products or enable API access for your catalogue.
          </p>
        </div>
      )}

      {products.length > 0 && (
        <div className="rounded-2xl border border-cream-200 overflow-hidden bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-cream-50/50 text-charcoal/50 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Price</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">Collection</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const legacyId = productGidToLegacyId(p.id);
                  const adminHref = domain
                    ? `https://${domain}/admin/products/${legacyId}`
                    : null;

                  return (
                    <tr
                      key={p.id}
                      className="border-t border-cream-100 hover:bg-cream-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-100 shrink-0">
                            {p.imageUrl ? (
                              <Image
                                src={p.imageUrl}
                                alt=""
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <span className="absolute inset-0 flex items-center justify-center text-charcoal/30 text-[10px]">
                                No img
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-charcoal truncate">{p.name}</p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {p.featured && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/10 text-saffron font-semibold uppercase">
                                  Featured
                                </span>
                              )}
                              {!p.active && (
                                <span className="text-[10px] text-charcoal/40">Unavailable</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-charcoal whitespace-nowrap font-medium">
                        {formatINR(p.priceCents)}
                      </td>
                      <td className="py-3.5 px-4 text-charcoal/50 hidden md:table-cell">
                        {p.category?.name ?? "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/shop/${p.slug}`}
                          className="text-saffron hover:text-saffron-700 font-medium mr-4"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Store
                        </Link>
                        {adminHref ? (
                          <a
                            href={adminHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-charcoal/50 hover:text-charcoal font-medium"
                          >
                            Edit
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
