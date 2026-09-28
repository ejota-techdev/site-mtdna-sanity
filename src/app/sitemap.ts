import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/siteUrl";
import { client } from "@/sanity/lib/client";
import { brandSlugsQuery, postSlugsQuery } from "@/sanity/lib/queries";

// Novas publicacoes entram no sitemap sem precisar de novo deploy.
export const revalidate = 3600;

const STATIC_PATHS = [
  "",
  "/marcas",
  "/publicacoes",
  "/sobre",
  "/sobre-nosotros",
  "/about",
  "/contato",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Se o Sanity estiver fora do ar no momento do build, o sitemap sai so com
  // as paginas fixas em vez de derrubar o deploy.
  const [brandSlugs, postSlugs] = await Promise.all([
    client.fetch<string[]>(brandSlugsQuery).catch(() => []),
    client.fetch<string[]>(postSlugsQuery).catch(() => []),
  ]);

  const paths = [
    ...STATIC_PATHS,
    ...(brandSlugs ?? []).map((slug) => `/marcas/${slug}`),
    ...(postSlugs ?? []).map((slug) => `/publicacoes/${slug}`),
  ];

  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
