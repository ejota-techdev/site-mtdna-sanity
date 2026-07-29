"use client";

import { useState } from "react";

import { SanityImage } from "@/components/SanityImage";
import type { HighlightCard, SanityImage as SanityImageType } from "@/sanity/lib/types";

/**
 * Imagem grande a esquerda e dois cards a direita. Os cards abrem ao clicar
 * no "+", revelando o texto — como indicado no wireframe.
 */
export function HighlightSection({
  image,
  cards,
}: {
  image?: SanityImageType;
  cards?: HighlightCard[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  if (!cards?.length) return null;

  return (
    <section className="container-mtdna grid gap-6 py-16 md:grid-cols-2">
      <div className="corner-br-flat relative min-h-[320px] overflow-hidden md:min-h-[420px]">
        <SanityImage
          image={image}
          alt=""
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-6">
        {cards.map((card, i) => {
          const isOpen = open === i;

          return (
            <article
              key={i}
              className={`overflow-hidden transition-all ${
                isOpen ? "ring-brand-teal corner-br-flat ring-1" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="corner-br-flat group relative block h-40 w-full overflow-hidden text-left"
              >
                {/*
                  A imagem vem colorida do CMS e e exibida em P&B. O hover
                  (e o foco por teclado) devolve a cor. `motion-reduce`
                  respeita quem pediu menos animacao no sistema.
                */}
                <SanityImage
                  image={card.image}
                  alt=""
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover grayscale transition-[filter,transform] duration-500 ease-out group-hover:scale-[1.03] group-hover:grayscale-0 group-focus-visible:grayscale-0 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />

                <span className="absolute bottom-4 left-6 font-bold text-white">
                  {card.title}
                </span>

                <span
                  className={`text-brand-coral absolute top-4 right-6 text-3xl leading-none transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>

              {isOpen && card.body && (
                <div className="px-6 py-6">
                  <p className="text-sm leading-relaxed whitespace-pre-line text-neutral-700">
                    {card.body}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
