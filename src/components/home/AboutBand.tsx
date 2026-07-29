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
    <section className="bg-brand-teal relative overflow-hidden py-20">
      {/* Grafismos laterais — decorativos, escondidos no mobile */}
      <DecorGrid
        stroke="#F4C70B"
        className="pointer-events-none absolute -top-4 -left-24 hidden h-[420px] w-[470px] lg:block"
      />
      <DecorGrid
        stroke="#F4C70B"
        className="pointer-events-none absolute -top-4 -right-24 hidden h-[420px] w-[470px] lg:block"
      />

      {/* 485px e a largura do bloco de texto medida no wireframe. */}
      <div className="relative mx-auto flex max-w-[485px] flex-col items-center gap-8 px-6 text-center">
        <div className="flex flex-col gap-5 text-left">
          {text?.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-white">
              {paragraph}
            </p>
          ))}
        </div>

        {cta && (
          <Link
            href={cta.href}
            className="border-brand-coral text-brand-coral hover:bg-brand-coral inline-flex items-center gap-3 rounded-full border px-8 py-3 font-medium transition-colors hover:text-white"
          >
            <Star className="text-brand-yellow h-3 w-3" />
            {cta.label}
            <Star className="text-brand-yellow h-3 w-3" />
          </Link>
        )}
      </div>
    </section>
  );
}
