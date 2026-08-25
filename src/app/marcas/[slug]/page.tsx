import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script"; // 👇 Adicionado o Script nativo do Next.js

import { DecorGrid } from "@/components/DecorGrid";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SanityImage } from "@/components/SanityImage";
import { client } from "@/sanity/lib/client";
import { brandBySlugQuery, brandSlugsQuery } from "@/sanity/lib/queries";
import type { Brand, SanityImage as SanityImageType } from "@/sanity/lib/types";

type CarouselSlide = { image?: SanityImageType; tagline?: string; _key?: string };

export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(brandSlugsQuery);
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await client.fetch<Brand | null>(brandBySlugQuery, { slug });

  if (!brand) return { title: "Marca não encontrada" };

  return { title: brand.name, description: brand.tagline };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = await client.fetch<Brand | null>(brandBySlugQuery, { slug });

  if (!brand) notFound();

  // 🎨 ARREDONDAMENTOS INDIVIDUAIS DINÂMICOS:
  let bordaDosQuadrados: string[] = [];

  if (slug === "goldcar") {
    bordaDosQuadrados = [
      "rounded-tl-[30px]",  // 1º Quadrado
      "rounded-none",       // 2º Quadrado
      "rounded-tr-none rounded-br-[60px]",  // 3º Quadrado
    ];
  } else {
    bordaDosQuadrados = [
      "rounded-tl-[30px]",       // 1º Quadrado
      "rounded-none",            // 2º Quadrado
      "rounded-tr-[30px]",       // 3º Quadrado
      "rounded-bl-[30px]",       // 4º Quadrado
      "rounded-none",            // 5º Quadrado
      "rounded-br-[30px]",       // 6º Quadrado
    ];
  }

  // 📝 Lógica para dividir o texto da Unlock e remover espaços fantasmas
  let unlockTopText = "";
  let unlockSideText = "";
  if (slug === "unlock" && brand.featureText) {
    const parts = brand.featureText.split(/\n+/).map(p => p.trim()).filter((p) => p !== "");
    unlockTopText = parts[0] || ""; 
    unlockSideText = parts.slice(1).join("\n\n"); 
  }

  // 📸 LÓGICA ESTRITA: Puxa EXCLUSIVAMENTE os slides novos do painel do Sanity
  let carouselSlides: CarouselSlide[] = [];

  if (brand.slides && brand.slides.length > 0) {
    carouselSlides = brand.slides.filter(
      (slide): slide is CarouselSlide => Boolean(slide?.image),
    );
  }

  // TRAVA DE SEGURANÇA
  if (carouselSlides.length === 0) {
    carouselSlides.push({
      _key: "fallback-empty",
      tagline: brand.tagline,
    });
  }

  return (
    <>
      <Header />

      <main>
        {/* ====================================================================== */}
        {/* TOPO: CARROSSEL DE IMAGENS                                             */}
        {/* ====================================================================== */}
        <section className="relative w-full h-[65vh] min-h-[500px] md:h-[80vh] bg-brand-navy overflow-hidden">
          
          {/* Scroll Container do Carrossel (APENAS AS IMAGENS ROLAM AQUI DENTRO) */}
          <div 
            id="brand-carousel"
            className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {carouselSlides.map((slide, idx) => (
              <div key={slide._key || idx} className="relative h-full w-full flex-shrink-0 snap-center">
                {slide.image && (
                  <SanityImage
                    image={slide.image}
                    alt={`${brand.name} - Slide ${idx + 1}`}
                    sizes="100vw"
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            ))}
          </div>

          {/* 👇 ELEMENTOS FIXOS (Fora do container de rolagem) 👇 */}

          {/* Gradiente Escuro no Rodapé (Fixo) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Conteúdo sobreposto FIXO (Logo, Tagline e Botão Próxima) */}
          <div className="absolute inset-0 flex items-end pb-12 md:pb-16 pointer-events-none">
            <div className="container-mtdna w-full pointer-events-auto flex items-end justify-between">
              
              {/* Lado Esquerdo: Logo e Texto */}
              <div className="flex-1 pr-4">
                {(brand.logoLight || brand.logo) && (
                  <div className="relative h-14 w-56 md:h-20 md:w-72 mb-4">
                    <SanityImage
                      image={brand.logoLight ?? brand.logo}
                      alt={brand.name}
                      sizes="(min-width: 768px) 288px, 224px"
                      className="object-contain object-left w-full h-full"
                    />
                  </div>
                )}
                {/* Pega a Tagline do primeiro slide, ou usa a geral da marca */}
                {(carouselSlides[0]?.tagline || brand.tagline) && (
                  <p className="text-white text-base md:text-lg opacity-90 max-w-2xl drop-shadow-md">
                    {carouselSlides[0]?.tagline || brand.tagline}
                  </p>
                )}
              </div>

              {/* Lado Direito: Botão de próximo */}
              {carouselSlides.length > 1 && (
                <button 
                  id="carousel-next-btn"
                  type="button"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer animate-pulse shrink-0 pb-1"
                  aria-label="Próxima imagem"
                >
                  <span className="text-xs uppercase tracking-widest font-semibold md:hidden">Deslize</span>
                  <span className="text-xs uppercase tracking-widest font-semibold hidden md:inline">Próxima</span>
                  <span aria-hidden="true" className="text-xl">→</span>
                </button>
              )}
            </div>
          </div>

          {/* 👇 MUDANÇA AQUI: SCRIPT NATIVO usando componente oficial do Next.js */}
          {carouselSlides.length > 1 && (
            <Script id="carousel-logic" strategy="afterInteractive">
              {`
                if (!window.carouselListenerAdded) {
                  window.carouselListenerAdded = true;
                  document.addEventListener('click', function(e) {
                    const btn = e.target.closest('#carousel-next-btn');
                    if (!btn) return;
                    
                    const carousel = document.getElementById('brand-carousel');
                    if (!carousel) return;
                    
                    const isEnd = carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth - 10);
                    if (isEnd) {
                      carousel.scrollTo({ left: 0, behavior: 'smooth' }); // Volta pro início
                    } else {
                      carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' }); // Avança
                    }
                  });
                }
              `}
            </Script>
          )}
        </section>

        {/* ====================================================================== */}
        {/* BIFURCAÇÃO DE LAYOUT: UNLOCK vs OUTRAS MARCAS */}
        {/* ====================================================================== */}

        {slug === "unlock" ? (
          /* ================= LAYOUT EXCLUSIVO DA UNLOCK ================= */
          <>
            <section className="container-mtdna pt-0 pb-12 md:pt-2 md:pb-16">
              {brand.showLocationMap && (
                <figure className="mx-auto mb-10 max-w-5xl">
                  <Image
                    src="/decor/mapa-unlock.png"
                    alt={`Mapa de Portugal com os destinos da ${brand.name}`}
                    width={1068}
                    height={1511}
                    className="h-auto w-full"
                    sizes="(min-width: 1024px) 1024px, 100vw"
                    unoptimized
                  />
                  <figcaption className="sr-only">
                    Destinos: {brand.locations?.join(", ")}.
                  </figcaption>
                </figure>
              )}

              {brand.locationsIntro && (
                <div className="mb-8 max-w-5xl">
                  <p className="text-neutral-700 leading-relaxed text-base md:text-lg">
                    {brand.locationsIntro}
                  </p>
                </div>
              )}
            </section>

            <section className="container-mtdna pb-16">
              <div className="mb-10">
                {brand.featureTitle && (
                  <h2 className="text-brand-navy text-3xl font-bold mb-6">
                    {brand.featureTitle}
                  </h2>
                )}
                {unlockTopText && (
                  <p className="text-neutral-700 whitespace-pre-line text-lg leading-relaxed opacity-90 md:text-xl text-left">
                    {unlockTopText}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                <div className="flex flex-col items-start text-left w-full gap-6 md:col-span-4 order-2 md:order-1">
                  {unlockSideText && (
                    <p className="text-neutral-700 whitespace-pre-line text-lg leading-relaxed opacity-90 md:text-xl w-full">
                      {unlockSideText}
                    </p>
                  )}

                  {brand.featureCta && (
                    <div className="mt-2">
                      <a
                        href={brand.featureCta.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="bg-brand-coral inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-white transition-transform hover:scale-105 hover:opacity-90"
                      >
                        {brand.featureCta.label}
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  )}
                  {brand.featureNote && (
                    <p className="text-neutral-500 text-xs leading-relaxed max-w-sm mt-1">
                      {brand.featureNote}
                    </p>
                  )}
                </div>

                <div className="relative aspect-video w-full overflow-hidden rounded-tl-[100px] rounded-tr-[0px] rounded-br-[100px] rounded-bl-[0px] md:col-span-8 order-1 md:order-2">
                  {brand.featureImage && (
                    <SanityImage
                      image={brand.featureImage}
                      alt={brand.name}
                      sizes="(min-width: 768px) 70vw, 100vw"
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
              </div>
            </section>
          </>
        ) : (
          /* ================= LAYOUT PADRÃO (Goldcar, Europcar) ================= */
          <>
            {(brand.introTitle || brand.introText || brand.featureImage) && (
              <section className="container-mtdna py-12 md:py-16">
                <div className="grid gap-10 items-center md:grid-cols-2 lg:gap-16">
                  
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-br-[120px] md:aspect-video">
                    {brand.featureImage && (
                      <SanityImage
                        image={brand.featureImage}
                        alt={brand.name}
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-6">
                    {brand.introTitle && (
                      <h2 className="text-brand-navy text-3xl font-bold leading-tight md:text-4xl">
                        {brand.introTitle}
                      </h2>
                    )}
                    {brand.introText && (
                      <p className="text-neutral-700 whitespace-pre-line text-base leading-relaxed opacity-90 md:text-lg">
                        {brand.introText}
                      </p>
                    )}
                  </div>

                </div>
              </section>
            )}

            {(brand.featureText || brand.featureCta) && (
              <section className="container-mtdna pb-16">
                <div className="mx-auto flex max-w-5xl flex-col gap-8 md:mx-0">
                  {brand.featureText && (
                    <p className="text-neutral-700 whitespace-pre-line text-base leading-relaxed opacity-90 md:text-lg">
                      {brand.featureText}
                    </p>
                  )}
                  {brand.featureNote && (
                    <p className="text-neutral-500 text-xs leading-relaxed">
                      {brand.featureNote}
                    </p>
                  )}
                </div>

                {brand.featureCta && (
                  <div className="mt-12 flex justify-center md:mt-16">
                    <a
                      href={brand.featureCta.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="bg-brand-coral inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-white transition-transform hover:scale-105 hover:opacity-90"
                    >
                      {brand.featureCta.label}
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                )}
              </section>
            )}

            {brand.showLocationMap && brand.locations?.length ? (
              <section className="container-mtdna pb-16">
                <figure className="mx-auto max-w-xl">
                  <Image
                    src="/decor/mapa-unlock.png"
                    alt={`Mapa de Portugal com os destinos da ${brand.name}`}
                    width={1068}
                    height={1511}
                    className="h-auto w-full"
                    sizes="(min-width: 768px) 576px, 100vw"
                    unoptimized
                  />
                  <figcaption className="sr-only">
                    Destinos: {brand.locations.join(", ")}.
                  </figcaption>
                </figure>

                {brand.locationsIntro && (
                  <p className="text-neutral-700 mt-10 leading-relaxed">
                    {brand.locationsIntro}
                  </p>
                )}
              </section>
            ) : null}
          </>
        )}

        {/* ====================================================================== */}
        {/* BLOCOS COMUNS A TODAS AS MARCAS                                        */}
        {/* ====================================================================== */}

        {brand.highlights?.length ? (
          <section className="container-mtdna pb-16">
            <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {brand.highlights.map((item, index) => (
                <li
                  key={item}
                  className={`border-brand-coral border-[4px] text-brand-navy flex min-h-[140px] items-center justify-center px-5 py-6 text-center text-sm font-bold md:text-base leading-snug ${bordaDosQuadrados[index] || "rounded-[20px]"}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {brand.benefits?.length ? (
          <section className="mb-16 grid items-stretch overflow-hidden md:grid-cols-3">
            <div className="bg-brand-teal flex flex-col justify-center gap-6 rounded-tr-[40px] rounded-br-[40px] px-8 py-14 md:col-span-2 md:px-16">
              <h2 className="text-2xl font-bold text-white">
                {brand.benefitsTitle ?? "Benefícios para você e seu cliente"}
              </h2>
              <ul className="flex flex-col gap-2">
                {brand.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-white">
                    <span aria-hidden="true">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden items-center justify-end pl-8 pr-0 md:col-span-1 md:flex">
              <DecorGrid 
                stroke="#10485B" 
                className="h-auto w-full max-w-[474px]" 
                rounded={["bl"]} 
              />
            </div>
          </section>
        ) : null}

        <section className="bg-brand-yellow">
          <ul className="container-mtdna flex flex-col gap-4 py-10">
            {brand.website && (
              <li className="flex items-center gap-4">
                <Image
                  src="/icons/globe.svg"
                  alt=""
                  width={26}
                  height={26}
                  unoptimized
                />
                <a
                  href={brand.websiteUrl ?? `https://${brand.website}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-brand-navy inline-flex min-h-11 items-center text-sm font-medium"
                >
                  {brand.website}
                </a>
              </li>
            )}
            {brand.phone && (
              <li className="flex items-center gap-4">
                <Image
                  src="/icons/phone-outline.svg"
                  alt=""
                  width={26}
                  height={26}
                  unoptimized
                />
                <span className="text-brand-navy text-sm font-medium">
                  {brand.phone}
                </span>
              </li>
            )}
            {brand.email && (
              <li className="flex items-center gap-4">
                <Image
                  src="/icons/mail-outline.svg"
                  alt=""
                  width={26}
                  height={26}
                  unoptimized
                />
                <a
                  href={`mailto:${brand.email}`}
                  className="text-brand-navy inline-flex min-h-11 items-center text-sm font-medium"
                >
                  {brand.email}
                </a>
              </li>
            )}
          </ul>
        </section>
      </main>

      <Footer />
    </>
  );
}