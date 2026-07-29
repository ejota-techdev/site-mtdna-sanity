import { client } from "@/sanity/lib/client";
import { aboutLanguagesQuery, brandsNavQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import type { AboutLanguage, BrandNavItem, SiteSettings } from "@/sanity/lib/types";

import { HeaderNav } from "./HeaderNav";

/**
 * Busca o que o menu precisa do Sanity e entrega para o componente
 * interativo. As marcas e os idiomas de "Sobre" sao dinamicos: se o cliente
 * criar uma marca nova, ela aparece no menu sozinha.
 */
export async function Header() {
  const [settings, brands, languages] = await Promise.all([
    client.fetch<SiteSettings | null>(siteSettingsQuery),
    client.fetch<BrandNavItem[]>(brandsNavQuery),
    client.fetch<AboutLanguage[]>(aboutLanguagesQuery),
  ]);

  return (
    <HeaderNav
      logo={settings?.logo}
      brands={brands ?? []}
      languages={languages ?? []}
    />
  );
}
