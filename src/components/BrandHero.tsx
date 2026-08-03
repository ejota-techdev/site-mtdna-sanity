"use client";

import { useCallback, useEffect, useState } from "react";

import { SanityImage } from "@/components/SanityImage";
import type { SanityImage as SanityImageType } from "@/sanity/lib/types";

/**
 * Topo da pagina de marca.
 *
 * Com uma imagem so, renderiza estatico — sem JavaScript de troca, sem
 * controles. Os controles aparecem apenas quando ha mais de uma.
 *
 * O logo e a frase ficam fixos por cima; so o fundo troca. Assim o texto
 * nao "pula" entre os slides.
 */
export function BrandHero({
  images,
  brandName,
  logo,
  tagline,
}: {
  images: SanityImageType[];
  brandName: string;
  logo?: SanityImageType;
  tagline?: string;
}) {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const total = images.length;

  const irPara = useCallback(
    (i: number) => setAtual(((i % total) + total) % total),
    [total],
  );

  useEffect(() => {
    if (total <= 1 || pausado) return;

    // Respeita quem pediu menos animacao no sistema.
    const menosMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (menosMovimento) return;

    const t = setInterval(() => setAtual((i) => (i + 1) % total), 6000);
    return () => clearInterval(t);
  }, [total, pausado]);

  if (total === 0) return null;

  return (
    <section
      className="relative h-[380px] w-full overflow-hidden md:h-[700px]"
      aria-roledescription={total > 1 ? "carrossel" : undefined}
      aria-label={total > 1 ? `Imagens de ${brandName}` : undefined}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
    >
      {images.map((imagem, i) => (
        <div
          key={i}
          aria-hidden={i !== atual}
          className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
            i === atual ? "opacity-100" : "opacity-0"
          }`}
        >
          <SanityImage
            image={imagem}
            alt={i === 0 ? brandName : ""}
            sizes="100vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

      <div className="absolute right-0 bottom-10 left-0 container-mtdna flex flex-col gap-4">
        {logo && (
          <div className="relative h-10 w-40 md:h-14 md:w-56">
            <SanityImage
              image={logo}
              alt={brandName}
              sizes="(min-width: 768px) 224px, 160px"
              className="object-contain object-left"
            />
          </div>
        )}
        {tagline && (
          <p className="text-sm text-white drop-shadow-sm md:text-base">
            {tagline}
          </p>
        )}

        {total > 1 && (
          <div className="mt-2 flex items-center">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => irPara(i)}
                aria-label={`Ir para a imagem ${i + 1} de ${total}`}
                aria-current={i === atual}
                className="flex h-11 items-center px-1.5"
              >
                <span
                  className={`block h-2 rounded-full transition-all ${
                    i === atual ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
