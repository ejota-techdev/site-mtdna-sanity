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

  return (
    <>
      <Header />

      <main>
        {/*
          ---------- Topo ----------
          A imagem principal e sempre o primeiro slide; as do carrossel vem
          depois. Com uma imagem so, o componente renderiza estatico.
        */}
        <BrandHero
          images={[brand.heroImage, ...(brand.gallery ?? [])].filter(
            (img): img is NonNullable<typeof img> => Boolean(img?.asset),
          )}
          brandName={brand.name}
          logo={brand.logoLight ?? brand.logo}
          tagline={brand.tagline}
        />

        {/* ---------- Abertura ---------- */}
        {(brand.introTitle || brand.introText) && (
          <section className="container-mtdna py-16">
            {brand.introTitle && (
              <h1 className="text-brand-navy mb-5 text-2xl leading-snug font-bold md:text-3xl">
                {brand.introTitle}
              </h1>
            )}
            {brand.introText && (
              <p className="leading-relaxed whitespace-pre-line text-neutral-700">
                {brand.introText}
              </p>
            )}
          </section>
        )}

        {/*
          ---------- Destinos (Unlock) ----------
          No wireframe o mapa vem logo apos a abertura, antes do bloco
          "Unlock your dreams".
        */}
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

              {/*
                Os nomes das localidades estao gravados na imagem, entao
                leitor de tela nao os alcanca. A lista abaixo repoe isso —
                invisivel na tela, disponivel para tecnologia assistiva.
              */}
              <figcaption className="sr-only">
                Destinos: {brand.locations.join(", ")}.
              </figcaption>
            </figure>

            {brand.locationsIntro && (
              <p className="mt-10 leading-relaxed text-neutral-700">
                {brand.locationsIntro}
              </p>
            )}
          </section>
        ) : null}

        {/* ---------- Destaque em duas colunas ---------- */}
        {(brand.featureTitle || brand.featureImage) && (
          <section className="container-mtdna grid items-center gap-10 pb-16 md:grid-cols-2">
            <div className="flex flex-col gap-5">
              {brand.featureTitle && (
                <h2 className="text-brand-navy text-2xl leading-snug font-bold">
                  {brand.featureTitle}
                </h2>
              )}
              {brand.featureText && (
                <p className="text-sm leading-relaxed whitespace-pre-line text-neutral-700">
                  {brand.featureText}
                </p>
              )}

              {brand.featureCta && (
                <a
                  href={brand.featureCta.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="bg-brand-coral mt-2 inline-flex w-fit items-center gap-3 rounded-full px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  {brand.featureCta.label}
                  <span aria-hidden="true">→</span>
                </a>
              )}

              {brand.featureNote && (
                <p className="text-xs leading-relaxed text-neutral-500">
                  {brand.featureNote}
                </p>
              )}
            </div>

            <div className="corner-br-flat relative min-h-[320px] overflow-hidden">
              <SanityImage
                image={brand.featureImage}
                alt={brand.name}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </section>
        )}

        {/* ---------- Caixas de destaque ---------- */}
        {brand.highlights?.length ? (
          <section className="container-mtdna pb-16">
            <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {brand.highlights.map((item) => (
                <li
                  key={item}
                  className="border-brand-coral text-brand-navy flex items-center justify-center rounded-xl border px-5 py-6 text-center text-sm font-bold"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ---------- Benefícios ---------- */}
        {brand.benefits?.length ? (
          <section className="grid items-stretch md:grid-cols-2">
            <div className="bg-brand-teal corner-br-flat flex flex-col justify-center gap-6 px-8 py-14 md:px-16">
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

            <div className="hidden items-center justify-center p-10 md:flex">
              <DecorGrid stroke="#10485B" className="h-[280px] w-[320px]" />
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
