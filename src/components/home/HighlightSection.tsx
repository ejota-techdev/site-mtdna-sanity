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
/** Altura da foto — fixa, para nao acompanhar o card ao lado. */
const ALTURA_FOTO = "md:h-[418px]";

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
        className={`relative h-[320px] self-start overflow-hidden rounded-tl-[52px] rounded-br-[52px] ${ALTURA_FOTO}`}
      >
        <SanityImage
          image={image}
          alt=""
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {/*
        A coluna nao tem altura travada: as pecas somam os 418px do wireframe
        quando o texto cabe, e crescem quando nao cabe. Travar a altura
        obrigaria a barra de rolagem — e o texto vem do painel, entao o
        comprimento nao esta sob nosso controle. Como a foto ao lado usa
        `self-start` com altura propria, ela nao se mexe de qualquer forma.
      */}
      <div className="flex flex-col gap-[18px]">
        {cards.map((card, i) => {
          const estaAberto = aberto === i;

          // Enquanto um card esta aberto, ele ocupa a coluna inteira —
          // e como os wireframes 10 e 12 mostram o estado expandido.
          if (aberto !== null && !estaAberto) return null;

          return (
            <article
              key={i}
              className="flex flex-col"
              /*
                A BORDA FICA AQUI, no card inteiro — nao na caixa de texto.
                Medido no wireframe 10: em y=270 e y=285 ha pixel de borda em
                x=1270, mas nessas alturas a imagem ja curvou para x~1263 e
                x~1248 por causa do canto inferior direito arredondado. Ou
                seja, a caixa com borda comeca no TOPO da imagem e a imagem
                fica por cima; onde o canto dela recua, aparece a borda por
                tras. Com a borda so na caixa de texto (como estava), a linha
                nascia embaixo da foto e nao encostava nela.

                Sem borda em cima: no topo a imagem cobre a largura toda, e o
                wireframe nao mostra traco algum ali.
              */
              style={
                estaAberto
                  ? {
                      borderWidth: "0 1px 1px 1px",
                      borderStyle: "solid",
                      borderColor: "var(--color-brand-teal)",
                      borderBottomRightRadius: "44px",
                      background: "#fff",
                    }
                  : undefined
              }
            >
              <button
                type="button"
                onClick={() => setAberto(estaAberto ? null : i)}
                aria-expanded={estaAberto}
                /*
                  Altura no `style` para poder animar entre dois valores
                  concretos — `h-full` nao transiciona, o navegador nao sabe
                  para onde ir.

                  A foto sangra 1px para cada lado, cobrindo as bordas
                  laterais do card — no wireframe a borda esquerda e a lateral
                  da foto estao no mesmo x (744), a foto nao fica para dentro
                  da linha.

                  Precisa da largura explicita junto com a margem negativa: so
                  a margem nao resolve, porque `w-full` trava a largura em 100%
                  e ai a margem negativa da direita nao alarga nada — desloca
                  o elemento sem estica-lo, e sobrava um fio da borda a direita.
                */
                style={{
                  height: estaAberto ? "125px" : "200px",
                  marginLeft: estaAberto ? "-1px" : undefined,
                  width: estaAberto ? "calc(100% + 2px)" : undefined,
                }}
                className="capa-expansivel group relative w-full shrink-0 overflow-hidden rounded-br-[48px] text-left"
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

              {/*
                Sempre montado (quando ha texto), e nao `estaAberto && ...`:
                um elemento que nasce ja aberto nao tem de onde animar. Quem
                abre e fecha e o `data-aberto`.
              */}
              {card.body && (
                <div
                  className="painel-expansivel"
                  data-aberto={estaAberto ? "true" : "false"}
                >
                  <div>
                    {/*
                      Sem borda propria: quem desenha e o `article`. Aqui so o
                      respiro interno. `min-height` reproduz os 293px do
                      wireframe e cresce se o texto pedir.
                    */}
                    <div
                      className="painel-conteudo px-6 py-6"
                      style={{ minHeight: "293px" }}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line text-neutral-700">
                        {card.body}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}