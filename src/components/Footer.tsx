import Image from "next/image";
import Link from "next/link";

import { SanityImage } from "@/components/SanityImage";
import { client } from "@/sanity/lib/client";
import { brandsNavQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import type { BrandNavItem, SiteSettings } from "@/sanity/lib/types";

export async function Footer() {
  const [settings, brands] = await Promise.all([
    client.fetch<SiteSettings | null>(siteSettingsQuery),
    client.fetch<BrandNavItem[]>(brandsNavQuery),
  ]);

  /* inline-flex + min-h-11 dao ao link a altura minima de toque sem
     mudar a aparencia do texto. */
  const linkClass =
    "text-white/80 transition-colors hover:text-white inline-flex min-h-11 items-center";

  return (
    <footer className="bg-brand-teal text-white">
      <div className="container-mtdna grid gap-10 py-14 md:grid-cols-4">
        <div className="flex flex-col gap-6">
          <div className="relative h-16 w-36">
            {settings?.logoFooter || settings?.logo ? (
              <SanityImage
                image={settings.logoFooter ?? settings.logo}
                alt="My Travel DNA"
                sizes="144px"
                className="object-contain object-left"
              />
            ) : null}
          </div>

          <div className="flex gap-3">
            {settings?.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="-m-2 flex h-11 w-11 items-center justify-center"
              >
                <Image
                  src="/icons/instagram-outline.svg"
                  alt=""
                  width={30}
                  height={30}
                  unoptimized
                />
              </a>
            )}
            {settings?.linkedinUrl && (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className="-m-2 flex h-11 w-11 items-center justify-center"
              >
                <Image
                  src="/icons/linkedin-outline.svg"
                  alt=""
                  width={30}
                  height={30}
                  unoptimized
                />
              </a>
            )}
          </div>
        </div>

        <nav aria-label="Menu do rodapé">
          <h2 className="mb-4 font-bold">Menu</h2>
          <ul className="flex flex-col text-sm">
            <li>
              <Link href="/marcas" className={linkClass}>
                Marcas
              </Link>
            </li>
            <li>
              <Link href="/publicacoes" className={linkClass}>
                Publicações
              </Link>
            </li>
            <li>
              <Link href="/sobre" className={linkClass}>
                Sobre
              </Link>
            </li>
            <li>
              <Link href="/contato" className={linkClass}>
                Contato
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Marcas">
          <h2 className="mb-4 font-bold">Marcas</h2>
          <ul className="flex flex-col text-sm">
            {brands?.map((brand) => (
              <li key={brand._id}>
                <Link href={`/marcas/${brand.slug}`} className={linkClass}>
                  {brand.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 font-bold">Contato</h2>
          <ul className="flex flex-col text-sm">
            {settings?.phone && (
              <li className="flex min-h-11 items-center text-white/80">
                {settings.phone}
              </li>
            )}
            {settings?.email && (
              <li>
                <a href={`mailto:${settings.email}`} className={linkClass}>
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {settings?.footerCredit && (
        <div className="container-mtdna pb-10">
          <p className="text-sm font-bold whitespace-pre-line text-white">
            {settings.footerCredit}
          </p>
        </div>
      )}
    </footer>
  );
}
