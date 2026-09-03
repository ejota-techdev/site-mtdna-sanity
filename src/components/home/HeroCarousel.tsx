"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";

import { SanityImage } from "@/components/SanityImage";
import type { HeroSlide } from "@/sanity/lib/types";

/**
 * Carrossel do topo com loop infinito fluido.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const totalOriginal = slides.length;
  
  // Duplicamos os slides para criar o efeito de loop infinito sem saltos secos
  const extendedSlides = [...slides, ...slides, ...slides];
  
  // Começamos no meio (no segundo conjunto) para permitir navegação livre para ambos os lados
  const [index, setIndex] = useState(totalOriginal);
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const go = useCallback(
    (direction: number) => {
      setIndex((prevIndex) => prevIndex + direction);
    },
    [],
  );

  // Auto-play a cada 6 segundos
  useEffect(() => {
    if (totalOriginal <= 1) return;
    const timer = setInterval(() => go(1), 6000);
    return () => clearInterval(timer);
  }, [go, totalOriginal]);

  // Efeito para resetar a posição de forma invisível quando chega nas pontas da duplicação
  useEffect(() => {
    if (totalOriginal <= 1) return;

    if (index >= totalOriginal * 2) {
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setIndex((prev) => prev - totalOriginal);
      }, 700); // Deve bater com a duração da transição do CSS (duration-700)
    } else if (index < totalOriginal) {
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setIndex((prev) => prev + totalOriginal);
      }, 700);
    } else {
      setIsTransitioning(true);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, totalOriginal]);

  if (totalOriginal === 0) return null;

  // Índice real para iluminar a bolinha certa na paginação (0 até totalOriginal - 1)
  const realIndex = ((index - totalOriginal) % totalOriginal + totalOriginal) % totalOriginal;

  // Sem respiro vertical no mobile: o card ocupa a tela cheia, colado no header.
  return (
    <section aria-label="Destaques" className="relative overflow-hidden py-0 md:py-6">
      {/*
        `.hero-track` define `--slide` por media query (100vw no mobile,
        min(81vw,1172px) do md para cima) — ver globals.css. `style` nao
        aceita breakpoint, entao a variavel nao pode ser definida so aqui.
      */}
      <div
        className={`hero-track flex ${
          isTransitioning ? "transition-transform duration-700 ease-out" : ""
        }`}
        style={
          {
            transform: `translateX(calc(50% - ${index} * var(--slide) - var(--slide) / 2))`,
          } as React.CSSProperties
        }
      >
        {extendedSlides.map((slide, i) => {
          const isActive = i === index;
          const hasLink = Boolean(slide.brand?.slug);
          const linkHref = slide.brand?.slug ? `/marcas/${slide.brand.slug}` : "#";
          
          const slug = slide.brand?.slug;

          // 📱 Ajuste fino do enquadramento apenas no mobile (telas < 768px)
          let customPositionClass = "object-cover";
          if (slug === "europcar") {
            // Desloca o corte para a direita no mobile, enquadrando o carro perfeitamente
            customPositionClass = "object-cover max-md:object-[75%_center]";
          } else if (slug === "unlock") {
            // Ajusta levemente o centro no mobile para a esquerda conforme o corte vertical
            customPositionClass = "object-cover max-md:object-[65%_center]";
          }

          // Agrupamos o conteúdo interno para não repetir código
          const slideContent = (
            <>
              <SanityImage
                image={slide.image}
                alt={slide.brand?.name ?? slide.tagline ?? ""}
                sizes="84vw"
                className={customPositionClass}
                priority={i === totalOriginal}
              />

              {/* Sombra na base para o texto ter contraste sobre a foto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute right-5 bottom-5 left-5 flex flex-col gap-2 sm:right-8 sm:bottom-8 sm:left-8 sm:gap-4">
                {(slide.brand?.logoLight ?? slide.brand?.logo) ? (
                  <div className="relative h-12 w-48 sm:h-16 sm:w-64">
                    <SanityImage
                      image={slide.brand.logoLight ?? slide.brand.logo}
                      alt={slide.brand.name}
                      sizes="(min-width: 640px) 256px, 192px"
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
            </>
          );

          /*
            Mobile: cheio da tela, sem cantos, altura imersiva — igual ao
            topo da pagina de marca da Unlock (h-[65vh] min-h-[500px], sem
            padding lateral, sem raio). Do `md` para cima, volta ao card com
            proporcao 16/7 e cantos de 2rem, como no wireframe do Figma.
          */
          const slideClasses = `relative block h-[65vh] min-h-[500px] w-full overflow-hidden md:aspect-[16/7] md:h-auto md:min-h-0 md:rounded-[2rem] transition-all duration-500 ${
            isActive ? "opacity-100" : "opacity-60"
          } ${hasLink ? "hover:scale-[1.01] hover:shadow-lg" : ""}`;

          return (
            <div
              key={i}
              aria-hidden={!isActive}
              className="w-[var(--slide)] shrink-0 px-0 md:px-3"
            >
              {hasLink ? (
                <Link href={linkHref} className={slideClasses}>
                  {slideContent}
                </Link>
              ) : (
                <div className={slideClasses}>
                  {slideContent}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Paginação baseada nos slides reais */}
      {totalOriginal > 1 && (
        <div className="mt-2 flex items-center justify-center">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para o slide ${i + 1}`}
              aria-current={i === realIndex}
              onClick={() => {
                // Salta diretamente para o bloco do meio equivalente ao índice clicado
                setIndex(totalOriginal + i);
              }}
              className="flex h-11 items-center px-1.5"
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  i === realIndex
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