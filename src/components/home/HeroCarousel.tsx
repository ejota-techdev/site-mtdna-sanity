"use client";

import { useCallback, useEffect, useState } from "react";

import { SanityImage } from "@/components/SanityImage";
import type { HeroSlide } from "@/sanity/lib/types";

/**
 * Carrossel do topo. O slide ativo fica centralizado e os vizinhos aparecem
 * cortados nas laterais, como no wireframe.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const go = useCallback(
    (direction: number) => setIndex((i) => (i + direction + total) % total),
    [total],
  );

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => go(1), 6000);
    return () => clearInterval(timer);
  }, [go, total]);

  if (total === 0) return null;

  return (
    <section aria-label="Destaques" className="relative overflow-hidden py-6">
      {/*
        A largura do slide e `min(81vw, 1172px)`.
        Ate 1440px vale o 81vw do wireframe (1166px, dando um card de ~1142px).
        Acima disso o teto entra: sem ele, num monitor de 2560px o slide ia a
        2050px e as imagens de origem (1440px de largura) apareciam ampliadas.
        O calculo do deslocamento usa a mesma variavel para nao sair do lugar.
      */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={
          {
            "--slide": "min(81vw, 1172px)",
            transform: `translateX(calc(50% - ${index} * var(--slide) - var(--slide) / 2))`,
          } as React.CSSProperties
        }
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            aria-hidden={i !== index}
            className="w-[var(--slide)] shrink-0 px-3"
          >
            <div
              className={`relative aspect-[16/7] overflow-hidden rounded-[2rem] transition-opacity duration-500 ${
                i === index ? "opacity-100" : "opacity-60"
              }`}
            >
              <SanityImage
                image={slide.image}
                alt={slide.brand?.name ?? slide.tagline ?? ""}
                sizes="84vw"
                className="object-cover"
                priority={i === 0}
              />

              {/* Sombra na base para o texto ter contraste sobre a foto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute right-5 bottom-5 left-5 flex flex-col gap-2 sm:right-8 sm:bottom-8 sm:left-8 sm:gap-4">
                {/*
                  Cai para `logo` quando a versao clara nao existe — sem isso
                  o slide fica sem logo nenhum, que foi o que acontecia.
                */}
                {slide.brand?.logoLight ?? slide.brand?.logo ? (
                  <div className="relative h-8 w-32 sm:h-12 sm:w-48">
                    <SanityImage
                      image={slide.brand.logoLight ?? slide.brand.logo}
                      alt={slide.brand.name}
                      sizes="(min-width: 640px) 192px, 128px"
                      className="object-contain object-left"
                    />
                  </div>
                ) : null}
                {slide.tagline && (
                  <p className="text-sm text-white drop-shadow-sm sm:text-lg">
                    {slide.tagline}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/*
        O ponto continua pequeno visualmente, mas o botao tem 44px de altura
        e 6px de folga lateral — area suficiente para o dedo.
      */}
      {total > 1 && (
        <div className="mt-2 flex items-center justify-center">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para o slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className="flex h-11 items-center px-1.5"
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  i === index
                    ? "bg-brand-coral w-8"
                    : "w-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
