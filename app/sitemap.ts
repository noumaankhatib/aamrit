import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/shopify";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.appUrl.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/cart",
    "/orders",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  let slugs: string[] = [];
  try {
    slugs = await getAllProductSlugs();
  } catch {
    // Shopify not reachable at build — fall back to static routes only.
  }

  return [
    ...staticRoutes,
    ...slugs.map((slug) => ({
      url: `${base}/shop/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
