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
      {/* Grafismos laterais — topo visível, sangram pela lateral e pela base */}
      <DecorGrid
        stroke="#F4C70B"
        strokeWidth={3}
        className="pointer-events-none absolute top-1/2 -left-32 hidden h-[calc(100%+2rem)] w-[500px] -translate-y-1/2 lg:block"
      />
      <DecorGrid
        stroke="#F4C70B"
        strokeWidth={3}
        className="pointer-events-none absolute top-1/2 -right-32 hidden h-[calc(100%+2rem)] w-[500px] -translate-y-1/2 scale-x-[-1] lg:block"
      />

      <div className="relative mx-auto flex max-w-[800px] flex-col items-center gap-12 px-6">
        <div className="flex flex-col gap-6 text-left">
          {text?.map((paragraph, i) => (
            <p key={i} className="text-[25px] leading-relaxed text-white">
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