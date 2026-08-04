"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SanityImage } from "@/components/SanityImage";
import type { AboutLanguage, BrandNavItem, SanityImage as SanityImageType } from "@/sanity/lib/types";

type Props = {
  logo?: SanityImageType;
  brands: BrandNavItem[];
  languages: AboutLanguage[];
};

const LANGUAGE_PATHS: Record<AboutLanguage["language"], string> = {
  pt: "/sobre",
  es: "/sobre-nosotros",
  en: "/about",
};

export function HeaderNav({ logo, brands, languages }: Props) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<"brands" | "about" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Fecha os dropdowns ao navegar.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Fecha ao clicar fora ou apertar Esc.
  useEffect(() => {
    if (!openMenu) return;

    function handleClick(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenu(null);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openMenu]);

  const linkClass = "text-brand-navy transition-colors hover:text-brand-teal";
  const linkMobile = `${linkClass} flex min-h-11 items-center`;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm w-full">
      <nav
        ref={navRef}
        aria-label="Principal"
        /*
         * Corrigido: Removido o 'container-mtdna'.
         * Devolvemos os paddings laterais (px-5, md:px-6, lg:px-7) originais 
         * para que o menu estique 100% da tela e alinhe com o carrossel.
         */
        className="flex items-center w-full gap-6 px-5 py-4 md:px-6 lg:gap-[147px] lg:px-7 lg:py-6"
      >
        {/* A logo continua em 'rem' para preservar o zoom maravilhoso de 120% */}
        <Link
          href="/"
          className="relative block h-16 w-[7.875rem] shrink-0 lg:h-[6.5rem] lg:w-[12.8125rem]"
        >
          {logo ? (
            <SanityImage
              image={logo}
              alt="My Travel DNA"
              sizes="(min-width: 1024px) 205px, 126px"
              className="object-contain object-left"
              priority
            />
          ) : (
            <span className="text-brand-navy font-bold">My Travel DNA</span>
          )}
        </Link>

        {/* Menu — desktop */}
        <ul className="hidden items-center gap-8 md:flex lg:gap-20">
          <li>
            <Link href="/" className={linkClass}>
              Home
            </Link>
          </li>

          <li className="relative">
            <button
              type="button"
              className={`flex items-center gap-1 ${linkClass}`}
              aria-expanded={openMenu === "brands"}
              aria-haspopup="true"
              onClick={() =>
                setOpenMenu((prev) => (prev === "brands" ? null : "brands"))
              }
            >
              Marcas
              <Chevron open={openMenu === "brands"} />
            </button>
            {openMenu === "brands" && (
              <Dropdown>
                {brands.map((brand) => (
                  <DropdownLink
                    key={brand._id}
                    href={`/marcas/${brand.slug}`}
                    label={brand.name}
                  />
                ))}
              </Dropdown>
            )}
          </li>

          <li>
            <Link href="/publicacoes" className={linkClass}>
              Publicações
            </Link>
          </li>

          <li className="relative">
            <button
              type="button"
              className={`flex items-center gap-1 ${linkClass}`}
              aria-expanded={openMenu === "about"}
              aria-haspopup="true"
              onClick={() =>
                setOpenMenu((prev) => (prev === "about" ? null : "about"))
              }
            >
              Sobre
              <Chevron open={openMenu === "about"} />
            </button>
            {openMenu === "about" && (
              <Dropdown>
                {languages.map((language) => (
                  <DropdownLink
                    key={language._id}
                    href={LANGUAGE_PATHS[language.language]}
                    label={language.menuLabel}
                  />
                ))}
              </Dropdown>
            )}
          </li>

          <li>
            <Link href="/contato" className={linkClass}>
              Contato
            </Link>
          </li>
        </ul>

        {/* Botao do menu — mobile */}
        <button
          type="button"
          className="text-brand-navy -mr-2.5 ml-auto flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Menu — mobile */}
      {mobileOpen && (
        <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-neutral-200 px-5 pb-6 md:hidden">
          <ul className="flex flex-col">
            <li>
              <Link href="/" className={linkMobile}>
                Home
              </Link>
            </li>
            <li>
              <p className="text-brand-teal mt-3 mb-1 text-sm font-medium">
                Marcas
              </p>
              <ul className="flex flex-col pl-4">
                {brands.map((brand) => (
                  <li key={brand._id}>
                    <Link href={`/marcas/${brand.slug}`} className={linkMobile}>
                      {brand.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link href="/publicacoes" className={linkMobile}>
                Publicações
              </Link>
            </li>
            <li>
              <p className="text-brand-teal mt-3 mb-1 text-sm font-medium">
                Sobre
              </p>
              <ul className="flex flex-col pl-4">
                {languages.map((language) => (
                  <li key={language._id}>
                    <Link
                      href={LANGUAGE_PATHS[language.language]}
                      className={linkMobile}
                    >
                      {language.menuLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link href="/contato" className={linkMobile}>
                Contato
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Dropdown({ children }: { children: React.ReactNode }) {
  return (
    <ul className="absolute left-0 top-full z-10 mt-2 min-w-48 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black/5">
      {children}
    </ul>
  );
}

function DropdownLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-brand-navy hover:bg-brand-cream block px-4 py-2 text-sm transition-colors"
      >
        {label}
      </Link>
    </li>
  );
}