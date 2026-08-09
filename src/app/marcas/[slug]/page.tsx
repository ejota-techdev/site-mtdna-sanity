import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { BrandHero } from "@/components/BrandHero";
import { DecorGrid } from "@/components/DecorGrid";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SanityImage } from "@/components/SanityImage";
import { client } from "@/sanity/lib/client";
import { brandBySlugQuery, brandSlugsQuery } from "@/sanity/lib/queries";
import type { Brand } from "@/sanity/lib/types";

export const revalidate = 60;

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

  // Se a marca for a Goldcar, aplica o layout específico do Figma:
  if (slug === "goldcar") {
    bordaDosQuadrados = [
      "rounded-tl-[30px]",  // 1º Quadrado: Canto superior esquerdo
      "rounded-none",       // 2º Quadrado: Reto
      "rounded-tr-none rounded-br-[60px]",  // 3º Quadrado: Canto inferior direito
    ];
  } else {
    // Se for qualquer outra marca, mantém o padrão antigo que você tinha:
    bordaDosQuadrados = [
      "rounded-tl-[30px]",       // 1º Quadrado
      "rounded-none",            // 2º Quadrado
      "rounded-tr-[30px]",       // 3º Quadrado
      "rounded-bl-[30px]",       // 4º Quadrado
      "rounded-none",            // 5º Quadrado
      "rounded-br-[30px]",       // 6º Quadrado
    ];
  }

  return (
    <>
      <Header />

      <main>
        {/* ---------- Topo ---------- */}
        <BrandHero
          images={[brand.heroImage, ...(brand.gallery ?? [])].filter(
            (img): img is NonNullable<typeof img> => Boolean(img?.asset),
          )}
          brandName={brand.name}
          logo={brand.logoLight ?? brand.logo}
          tagline={brand.tagline}
        />

        {/* ---------- Destaque em duas colunas (Imagem esq / Intro dir) ---------- */}
        {(brand.introTitle || brand.introText || brand.featureImage) && (
          <section className="container-mtdna py-12 md:py-16">
            <div className="grid gap-10 items-center md:grid-cols-2 lg:gap-16">
              
              {/* Imagem com corte exclusivo no canto inferior direito */}
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

              {/* Título e Texto lateral */}
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

        {/* ---------- Textos Adicionais & CTA ---------- */}
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

            {/* CTA Centralizado */}
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

        {/* ---------- Destinos (Unlock - Mapa) ---------- */}
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

        {/* ---------- Caixas de destaque ---------- */}
        {brand.highlights?.length ? (
          <section className="container-mtdna pb-16">
            <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {brand.highlights.map((item, index) => (
                <li
                  key={item}
                  /* 👇 A grossura global agora voltou para border-[3px] (mais grossa)! */
                  className={`border-brand-coral border-[4px] text-brand-navy flex min-h-[140px] items-center justify-center px-5 py-6 text-center text-sm font-bold md:text-base leading-snug ${bordaDosQuadrados[index] || "rounded-[20px]"}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ---------- Benefícios ---------- */}
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

        {/* ---------- Faixa de contato ---------- */}
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