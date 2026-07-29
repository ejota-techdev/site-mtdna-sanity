"use client";

import { useState } from "react";

import { Star } from "@/components/DecorGrid";

/**
 * Blocos expansiveis da pagina "Sobre Nos". Abre um por vez, como no
 * wireframe (o bloco aberto mostra o titulo em negrito e o texto abaixo).
 */
export function Accordion({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-5">
      {items.map((item, i) => {
        const isOpen = open === i;

        return (
          <div
            key={item.title}
            className="border-brand-teal/40 overflow-hidden rounded-2xl border shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-7 py-6 text-left"
            >
              <span
                className={`text-brand-navy ${isOpen ? "font-bold" : ""}`}
              >
                {item.title}
              </span>
              <Star
                className={`text-brand-yellow h-5 w-5 shrink-0 transition-transform ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-7 pb-7">
                <p className="leading-relaxed text-neutral-700">{item.body}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
