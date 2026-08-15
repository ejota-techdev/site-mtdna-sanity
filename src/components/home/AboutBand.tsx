import Link from "next/link";

import { DecorGrid, Star } from "@/components/DecorGrid";
import type { Cta } from "@/sanity/lib/types";

export function AboutBand({
  text,
  cta,
}: {
  text?: string[];
  cta?: Cta;
}) {
  return (
    <section className="bg-brand-teal relative overflow-hidden py-24">
      {/* 485px e a largura do bloco de texto medida no wireframe. */}
      <div className="relative mx-auto flex max-w-[485px] flex-col items-center gap-12 px-6">
        {/*
          Grafismos laterais.
          Ancorados ao bloco de texto (`right-full` / `left-full`), nunca a
          bordas fixas da janela: `right-full` encosta a borda direita da
          grade na borda esquerda do texto, entao a sobreposicao e impossivel
          por construcao, seja qual for a largura da tela ou do texto.
          O `overflow-hidden` da secao corta o que sangra para fora.
        */}
        <DecorGrid
          stroke="#F4C70B"
          strokeWidth={3}
          rounded={["tr", "bl"]}
          className="pointer-events-none absolute top-1/2 right-full mr-12 hidden h-[calc(100%+4rem)] w-[500px] -translate-y-1/2 lg:block"
        />
        <DecorGrid
          stroke="#F4C70B"
          strokeWidth={3}
          rounded={["tl", "br"]}
          className="pointer-events-none absolute top-1/2 left-full ml-12 hidden h-[calc(100%+4rem)] w-[500px] -translate-y-1/2 scale-x-[-1] lg:block"
        />
        <div className="flex flex-col gap-6 text-left">
          {text?.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-white">
              {paragraph}
            </p>
          ))}
        </div>

        {cta && (
          <Link
            href={cta.href}
            className="border-brand-coral text-brand-coral hover:bg-brand-coral inline-flex items-center gap-4 rounded-full border-2 px-14 py-5 text-xl font-medium transition-colors hover:text-white"
          >
            <Star className="text-brand-yellow h-5 w-5" />
            {cta.label}
            <Star className="text-brand-yellow h-5 w-5" />
          </Link>
        )}
      </div>
    </section>
  );
}