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
    <div className="p-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Products</h1>
          <p className="text-[#888] mt-1">
            Catalogue preview from the Storefront API · edit inventory in Shopify Admin
          </p>
        </div>
        {domain && (
          <a
            href={`https://${domain}/admin/products`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2a2a2a] border border-[#444] text-sm font-medium text-white hover:bg-[#333] transition-colors"
          >
            <svg
              className="w-4 h-4 text-[#aaa]"
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

      {fetchError && (
        <div className="mb-6 rounded-xl border border-[#5c3310] bg-[#2a2110] px-4 py-3 text-sm text-[#fbbf24]">
          {fetchError}
        </div>
      )}

      {!fetchError && products.length === 0 && (
        <div className="rounded-xl border border-[#333] bg-[#222] p-12 text-center">
          <p className="text-[#b5b5b5] mb-2">No active products returned from the API.</p>
          <p className="text-sm text-[#666]">
            Publish products in Shopify or enable Storefront API access for your catalogue.
          </p>
        </div>
      )}

      {products.length > 0 && (
        <div className="rounded-xl border border-[#333] overflow-hidden bg-[#1a1a1a]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#222] text-[#888] text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-medium">Product</th>
                  <th className="py-3 px-4 font-medium">Price</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Collection</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
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
                      className="border-t border-[#333] hover:bg-[#252525] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#2a2a2a] shrink-0">
                            {p.imageUrl ? (
                              <Image
                                src={p.imageUrl}
                                alt=""
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <span className="absolute inset-0 flex items-center justify-center text-[#555] text-[10px]">
                                No img
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-white truncate">{p.name}</p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {p.featured && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#4d3800] text-[#fbbf24] font-semibold uppercase">
                                  Featured
                                </span>
                              )}
                              {!p.active && (
                                <span className="text-[10px] text-[#888]">Unavailable</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#ddd] whitespace-nowrap">
                        {formatINR(p.priceCents)}
                      </td>
                      <td className="py-3 px-4 text-[#999] hidden md:table-cell">
                        {p.category?.name ?? "—"}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/shop/${p.slug}`}
                          className="text-[#6d9eff] hover:underline mr-3"
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
                            className="text-[#aaa] hover:text-white"
                          >
                            Shopify
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
