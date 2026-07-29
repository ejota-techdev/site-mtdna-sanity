"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SanityImage } from "@/components/SanityImage";
import type { SanityImage as SanityImageType } from "@/sanity/lib/types";

/**
 * Carrossel das propriedades da marca.
 *
 * O movimento e scroll nativo com `scroll-snap`, nao transform via JS: assim
 * funciona com toque, roda do mouse e teclado de graca, e continua utilizavel
 * se o JavaScript falhar. Os botoes so empurram o scroll.
 */
export function BrandGallery({
  images,
  title,
  brandName,
}: {
  images: SanityImageType[];
  title?: string;
  brandName: string;
}) {
  const trilho = useRef<HTMLUListElement>(null);
  const [noInicio, setNoInicio] = useState(true);
  const [noFim, setNoFim] = useState(false);

  const conferirLimites = useCallback(() => {
    const el = trilho.current;
    if (!el) return;
    setNoInicio(el.scrollLeft <= 2);
    setNoFim(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    conferirLimites();
    const el = trilho.current;
    if (!el) return;
    el.addEventListener("scroll", conferirLimites, { passive: true });
    window.addEventListener("resize", conferirLimites);
    return () => {
      el.removeEventListener("scroll", conferirLimites);
      window.removeEventListener("resize", conferirLimites);
    };
  }, [conferirLimites]);

  function deslizar(direcao: 1 | -1) {
    const el = trilho.current;
    if (!el) return;
    const passo = el.clientWidth * 0.8;
    el.scrollBy({ left: passo * direcao, behavior: "smooth" });
  }

  if (!images.length) return null;

  return (
    <section className="container-mtdna pb-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        {title ? (
          <h2 className="text-brand-navy text-2xl font-bold">{title}</h2>
        ) : (
          <span />
        )}

        <div className="flex gap-2">
          <BotaoSeta
            direcao="anterior"
            desativado={noInicio}
            onClick={() => deslizar(-1)}
          />
          <BotaoSeta
            direcao="proxima"
            desativado={noFim}
            onClick={() => deslizar(1)}
          />
        </div>
      </div>

      <ul
        ref={trilho}
        tabIndex={0}
        aria-label={`Imagens de propriedades — ${brandName}`}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-coral"
      >
        {images.map((imagem, i) => (
          <li
            key={i}
            className="w-[85%] shrink-0 snap-start sm:w-[48%] lg:w-[32%]"
          >
            <div className="corner-br-flat relative aspect-[16/9] overflow-hidden">
              <SanityImage
                image={imagem}
                alt={`${brandName} — propriedade ${i + 1}`}
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 85vw"
                className="object-cover"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BotaoSeta({
  direcao,
  desativado,
  onClick,
}: {
  direcao: "anterior" | "proxima";
  desativado: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desativado}
      aria-label={direcao === "anterior" ? "Imagens anteriores" : "Próximas imagens"}
      className="border-brand-teal text-brand-teal hover:bg-brand-teal flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={direcao === "anterior" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
