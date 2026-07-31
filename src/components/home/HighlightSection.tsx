"use client";

import { useState } from "react";

import { SanityImage } from "@/components/SanityImage";
import type {
  HighlightCard,
  SanityImage as SanityImageType,
} from "@/sanity/lib/types";

/*
 * Medidas tiradas dos wireframes 10, 11 e 12 (canvas de 1440px):
 *
 *   foto grande .......... 526x418, cantos sup-esq e inf-dir com raio 53px
 *   card fechado ......... 527x200, apenas inf-dir com raio 47px
 *   intervalo entre cards. 18px      (200 + 18 + 200 = 418, igual a foto)
 *   coluna x coluna ...... 52px
 *
 *   card aberto (wf 10/12) ocupa os mesmos 418px:
 *     faixa de imagem .... 125px, inf-dir arredondado
 *     caixa de texto ..... resto, borda 1px #10485B, inf-dir raio 44px
 *
 * A altura total da secao nao muda entre fechado e aberto — por isso a foto
 * ao lado nunca se mexe.
 */
const ALTURA = "md:h-[418px]";

export function HighlightSection({
  image,
  cards,
}: {
  image?: SanityImageType;
  cards?: HighlightCard[];
}) {
  const [aberto, setAberto] = useState<number | null>(null);

  if (!cards?.length) return null;

  return (
    <section className="container-mtdna grid gap-8 py-16 md:grid-cols-2 md:gap-[52px]">
      <div
        className={`relative h-[320px] self-start overflow-hidden rounded-tl-[52px] rounded-br-[52px] ${ALTURA}`}
      >
        <SanityImage
          image={image}
          alt=""
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className={`flex flex-col gap-[18px] ${ALTURA}`}>
        {cards.map((card, i) => {
          const estaAberto = aberto === i;

          // Enquanto um card esta aberto, ele ocupa a coluna inteira —
          // e como os wireframes 10 e 12 mostram o estado expandido.
          if (aberto !== null && !estaAberto) return null;

          return (
            <article
              key={i}
              className={estaAberto ? "flex min-h-0 flex-1 flex-col" : "flex-1"}
            >
              <button
                type="button"
                onClick={() => setAberto(estaAberto ? null : i)}
                aria-expanded={estaAberto}
                className={`group relative w-full shrink-0 overflow-hidden rounded-br-[48px] text-left ${
                  estaAberto ? "h-[125px]" : "h-full min-h-[160px]"
                }`}
              >
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
                    estaAberto ? "rotate-45" : ""
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>

              {estaAberto && card.body && (
                <div className="border-brand-teal min-h-0 flex-1 overflow-y-auto rounded-br-[44px] border px-6 py-6">
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
