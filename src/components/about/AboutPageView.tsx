import Link from "next/link";
import { notFound } from "next/navigation";

import { Accordion } from "@/components/Accordion";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SanityImage } from "@/components/SanityImage";
import { client } from "@/sanity/lib/client";
import { aboutPageByLanguageQuery } from "@/sanity/lib/queries";
import type { AboutPage } from "@/sanity/lib/types";

/**
 * Layout unico da pagina "Sobre Nos". As tres rotas de idioma
 * (/sobre, /sobre-nosotros, /about) renderizam este componente,
 * mudando apenas qual documento e buscado.
 */
export async function AboutPageView({
  language,
}: {
  language: "pt" | "es" | "en";
}) {
  const about = await client.fetch<AboutPage | null>(aboutPageByLanguageQuery, {
    language,
  });

  if (!about) notFound();

  return (
    <>
      <Header />

      <main>
        {/* ---------- Topo ---------- */}
        <section className="relative h-[300px] w-full md:h-[380px]">
          <SanityImage
            image={about.heroImage}
            alt=""
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute right-0 bottom-10 left-0 container-mtdna">
            <h1 className="text-4xl font-bold text-white drop-shadow-sm md:text-5xl">
              {about.title}
            </h1>
          </div>
        </section>

        {/* ---------- Quem somos ---------- */}
        <section className="container-mtdna py-16">
          {about.introTitle && (
            <h2 className="text-brand-navy mb-6 text-3xl font-bold">
              {about.introTitle}
            </h2>
          )}
          {about.introText && (
            <p className="mb-12 leading-relaxed text-neutral-700">
              {about.introText}
            </p>
          )}

          {about.accordion?.length ? (
            <Accordion items={about.accordion} />
          ) : null}
        </section>

        {/* ---------- Serviços ---------- */}
        {about.services?.length ? (
          <section className="bg-brand-navy py-16">
            <div className="container-mtdna">
              <h2 className="mb-12 text-center text-3xl font-bold text-white">
                {about.servicesTitle}
              </h2>

              <ul className="grid grid-cols-2 gap-5 md:grid-cols-5">
                {about.services.map((service) => (
                  <li
                    key={service.title}
                    /* 
                     * 🎨 CORREÇÃO DE RESPONSIVIDADE:
                     * `last:col-span-2` faz o 5º card ocupar a linha inteira no mobile (centralizando o conteúdo).
                     * `md:last:col-span-1` garante que em computadores ele volte a ocupar apenas 1 coluna normal.
                     */
                    className="bg-brand-yellow flex flex-col items-center justify-start gap-4 p-5 text-center last:col-span-2 md:last:col-span-1"
                  >
                    {service.icon && (
                      <span className="relative block h-14 w-14 shrink-0">
                        <SanityImage
                          image={service.icon}
                          alt=""
                          sizes="56px"
                          className="object-contain"
                        />
                      </span>
                    )}
                    <span className="text-brand-navy text-sm leading-snug font-medium">
                      {service.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* ---------- Chamada final ---------- */}
        {about.ctaTitle && (
          <section className="container-mtdna py-16">
            <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-lg">
              <SanityImage
                image={about.ctaImage}
                alt=""
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/35" />

              <div className="relative flex flex-col items-center gap-6 px-6 text-center">
                <h2 className="text-3xl font-bold text-white drop-shadow-sm md:text-4xl">
                  {about.ctaTitle}
                </h2>
                {about.ctaButton && (
                  <Link
                    href={about.ctaButton.href}
                    className="bg-brand-coral rounded-lg px-10 py-3 font-medium text-white transition-opacity hover:opacity-90"
                  >
                    {about.ctaButton.label}
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
