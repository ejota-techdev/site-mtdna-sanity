"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useRef } from "react";

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

  return (
    <section aria-label="Destaques" className="relative overflow-hidden py-6">
      <div
        className={`flex ${
          isTransitioning ? "transition-transform duration-700 ease-out" : ""
        }`}
        style={
          {
            "--slide": "min(81vw, 1172px)",
            transform: `translateX(calc(50% - ${index} * var(--slide) - var(--slide) / 2))`,
          } as React.CSSProperties
        }
      >
        {extendedSlides.map((slide, i) => {
          const isActive = i === index;
          const href = slide.brand?.slug
            ? `/marcas/${slide.brand.slug}`
            : undefined;

          const cardClass = `focus-visible:outline-brand-coral relative block aspect-[16/7] overflow-hidden rounded-[2rem] transition-opacity duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 ${
            isActive ? "opacity-100" : "opacity-60"
          }`;

          const conteudo = (
            <>
              <SanityImage
                image={slide.image}
                /*
                  Decorativa quando o card e um link: quem nomeia o link e o
                  `aria-label` la embaixo. Sem isso o leitor de tela leria o
                  alt da foto + o alt do logo + a frase, tudo emendado.
                */
                alt={slide.brand ? "" : (slide.tagline ?? "")}
                sizes="84vw"
                className="object-cover"
                priority={i === totalOriginal}
              />

              {/* Sombra na base para o texto ter contraste sobre a foto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute right-5 bottom-5 left-5 flex flex-col gap-2 sm:right-8 sm:bottom-8 sm:left-8 sm:gap-4">
                {slide.brand?.logoLight ?? slide.brand?.logo ? (
                  <div className="relative h-10 w-40 sm:h-14 sm:w-56">
                    <SanityImage
                      image={slide.brand.logoLight ?? slide.brand.logo}
                      alt={slide.brand.name}
                      sizes="(min-width: 640px) 224px, 160px"
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

          return (
            <div
              key={i}
              /*
                `inert` no lugar de `aria-hidden`: agora ha um link dentro do
                card, e um elemento focavel dentro de um container aria-hidden
                fica alcancavel pelo Tab mas invisivel para o leitor de tela.
                Aqui isso pesa o dobro, porque o loop triplica os slides: sem
                `inert` o mesmo link da marca apareceria 3x na navegacao por
                teclado. `inert` resolve foco, arvore de acessibilidade e
                clique de uma vez, deixando so o card centralizado ativo.
              */
              inert={!isActive}
              className="w-[var(--slide)] shrink-0 px-3"
            >
              {/*
                Slide sem marca associada no Sanity continua sendo so imagem,
                sem link.
              */}
              {href ? (
                <Link
                  href={href}
                  /*
                    O nome do link vem daqui, e nao do conteudo: o alt gravado
                    no Sanity descreve a foto ("Veiculo Europcar em estrada a
                    beira de um lago"), util como imagem mas pessimo como
                    rotulo de link.
                  */
                  aria-label={[slide.brand?.name, slide.tagline]
                    .filter(Boolean)
                    .join(" — ")}
                  className={cardClass}
                >
                  {conteudo}
                </Link>
              ) : (
                <div className={cardClass}>{conteudo}</div>
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