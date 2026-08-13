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

type OpcoesDeLayout = {
  pageLayout: "padrao" | "unlock";
  featureImageSide: "esquerda" | "direita";
  featureCtaAlign: "esquerda" | "centro";
};

/*
 * Valores usados enquanto os campos novos nao forem preenchidos no Studio.
 *
 * As tres marcas ja estavam cadastradas quando `pageLayout`,
 * `featureImageSide` e `featureCtaAlign` passaram a existir, e o
 * `initialValue` da schema so vale para documento novo — elas chegam aqui sem
 * valor nenhum. Sem esta tabela a Europcar renderizaria com o layout da
 * Goldcar ate alguem abrir o painel.
 *
 * Os valores saem dos wireframes `Marcas - Europcar/Goldcar/UnLock.png`.
 *
 * ISTO E TRANSITORIO: assim que os campos estiverem preenchidos nas marcas,
 * a tabela pode ser apagada. O que vem do painel sempre tem prioridade.
 */
const PADRAO_POR_SLUG: Record<string, OpcoesDeLayout> = {
  europcar: {
    pageLayout: "padrao",
    featureImageSide: "direita",
    featureCtaAlign: "esquerda",
  },
  goldcar: {
    pageLayout: "padrao",
    featureImageSide: "esquerda",
    featureCtaAlign: "centro",
  },
  unlock: {
    pageLayout: "unlock",
    featureImageSide: "direita",
    featureCtaAlign: "esquerda",
  },
};

const PADRAO_GERAL: OpcoesDeLayout = {
  pageLayout: "padrao",
  featureImageSide: "direita",
  featureCtaAlign: "esquerda",
};

/*
 * Canto da foto do bloco de destaque: 3 arestas a 90 graus + o inferior
 * direito arredondado.
 *
 * 88px medidos nos wireframes `Marcas - Europcar`, `Marcas - Goldcar` e
 * `Marcas - UnLock` (canvas de 1440px). O perfil do arco e identico nos tres
 * — recuo de 0, 2, 4, 8, 13, 19, 27, 38, 54 e 86px nos ultimos 90px de
 * altura —, entao e o mesmo raio para todas as marcas. Estava 120px nas duas
 * primeiras e 100px na Unlock.
 *
 * No `style` e nao em `rounded-br-[88px]`: utilitaria nova nao chega ao CSS
 * gerado neste projeto.
 */
const RAIO_FOTO_DESTAQUE = "0 0 88px 0";

/** `[superior-esq, superior-dir, inferior-dir, inferior-esq]`, como no CSS. */
type Cantos = [number, number, number, number];

/*
 * Caixas de destaque (os retangulos de borda coral).
 *
 * Medidos nos wireframes da Europcar e da Goldcar: borda de 4px e raio de
 * 22px nos cantos arredondados. O codigo usava 3px de borda e raios de 30px
 * e 60px.
 *
 * O desenho e diagonal e depende de quantas caixas existem, nao do lado da
 * imagem: com 3 caixas numa fileira, so a primeira (superior esquerdo) e a
 * ultima (inferior direito) arredondam; com 6 em duas fileiras, arredondam os
 * quatro cantos externos do conjunto. Por isso sao duas tabelas e nao uma
 * formula — com 3 caixas os cantos `tr` e `bl` do conjunto ficam retos, o que
 * uma formula de "cantos externos" nao pegaria.
 */
const RAIO_CAIXA = 22;
const BORDA_CAIXA = "4px";

const CANTOS_CAIXAS_3: Cantos[] = [
  [RAIO_CAIXA, 0, 0, 0], // 1ª: superior esquerdo
  [0, 0, 0, 0], // 2ª: reta
  [0, 0, RAIO_CAIXA, 0], // 3ª: inferior direito
];

const CANTOS_CAIXAS_6: Cantos[] = [
  [RAIO_CAIXA, 0, 0, 0], // 1ª: superior esquerdo
  [0, 0, 0, 0],
  [0, RAIO_CAIXA, 0, 0], // 3ª: superior direito
  [0, 0, 0, RAIO_CAIXA], // 4ª: inferior esquerdo
  [0, 0, 0, 0],
  [0, 0, RAIO_CAIXA, 0], // 6ª: inferior direito
];

const raio = ([tl, tr, br, bl]: Cantos) => `${tl}px ${tr}px ${br}px ${bl}px`;

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

  // O que vem do painel manda; a tabela so cobre marca ainda sem os campos.
  const padrao = PADRAO_POR_SLUG[slug] ?? PADRAO_GERAL;
  const layout = brand.pageLayout ?? padrao.pageLayout;
  const ladoDaImagem = brand.featureImageSide ?? padrao.featureImageSide;
  const alinhamentoCta = brand.featureCtaAlign ?? padrao.featureCtaAlign;

  const cantosDasCaixas =
    (brand.highlights?.length ?? 0) <= 3 ? CANTOS_CAIXAS_3 : CANTOS_CAIXAS_6;

  // 📝 Lógica para dividir o texto da Unlock e remover espaços fantasmas
  let unlockTopText = "";
  let unlockSideText = "";
  if (layout === "unlock" && brand.featureText) {
    const parts = brand.featureText.split(/\n+/).map(p => p.trim()).filter((p) => p !== "");
    unlockTopText = parts[0] || ""; // O primeiro parágrafo
    unlockSideText = parts.slice(1).join("\n\n"); // O restante dos parágrafos
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

        {/* ====================================================================== */}
        {/* BIFURCAÇÃO DE LAYOUT: UNLOCK vs OUTRAS MARCAS */}
        {/* ====================================================================== */}

        {layout === "unlock" ? (
          /* ================= LAYOUT EXCLUSIVO DA UNLOCK ================= */
          <>
            {/* Bloco 1: Apenas o Mapa */}
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

            {/* Bloco 2: Destaque, Botão e Imagem (Embaixo) */}
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
                
                {/* Lado Esquerdo (Ocupa 4 colunas) */}
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

                {/*
                  Lado direito (8 colunas). O canto vem de `RAIO_FOTO_DESTAQUE`,
                  o mesmo das outras marcas — o wireframe da Unlock tem o
                  arco identico ao da Europcar e da Goldcar.
                */}
                <div
                  className="relative aspect-video w-full overflow-hidden md:col-span-8 order-1 md:order-2"
                  style={{ borderRadius: RAIO_FOTO_DESTAQUE }}
                >
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
            {/* ---------- Destaque em duas colunas (Imagem esq / Intro dir) ---------- */}
            {(brand.introTitle || brand.introText || brand.featureImage) && (
              <section className="container-mtdna py-12 md:py-16">
                {/*
                  A ordem das colunas vem do painel (`Lado da imagem no bloco
                  de destaque`). No wireframe da Europcar a foto fica a
                  direita; no da Goldcar, a esquerda. `order` em vez de
                  reordenar o JSX para o texto continuar vindo antes da imagem
                  na ordem de leitura do documento.
                */}
                <div className="grid gap-10 items-center md:grid-cols-2 lg:gap-16">
                  <div
                    className="relative aspect-[4/3] w-full overflow-hidden md:aspect-video"
                    style={{
                      order: ladoDaImagem === "esquerda" ? 0 : 1,
                      borderRadius: RAIO_FOTO_DESTAQUE,
                    }}
                  >
                    {brand.featureImage && (
                      <SanityImage
                        image={brand.featureImage}
                        alt={brand.name}
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>

                  <div
                    className="flex flex-col gap-6"
                    style={{ order: ladoDaImagem === "esquerda" ? 1 : 0 }}
                  >
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

                {brand.featureCta && (
                  /*
                    Alinhamento do botao vem do painel: no wireframe da
                    Europcar ele fica encostado a esquerda, no da Goldcar
                    centralizado. `justifyContent` no `style` porque
                    `justify-start` nao esta no CSS gerado deste projeto.
                  */
                  <div
                    className="mt-12 flex md:mt-16"
                    style={{
                      justifyContent:
                        alinhamentoCta === "centro" ? "center" : "flex-start",
                    }}
                  >
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

            {/* ---------- Destinos (Mapa) ---------- */}
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

        {/* ---------- Caixas de destaque ---------- */}
        {brand.highlights?.length ? (
          <section className="container-mtdna pb-16">
            <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {brand.highlights.map((item, index) => (
                <li
                  key={item}
                  /*
                    Borda e cantos no `style`: os valores medidos (4px e 22px)
                    virariam `border-[4px]`/`rounded-tl-[22px]`, utilitarias
                    novas que nao chegam ao CSS gerado neste projeto. Caixa
                    alem da tabela fica reta.
                  */
                  style={{
                    borderWidth: BORDA_CAIXA,
                    borderStyle: "solid",
                    borderColor: "var(--color-brand-coral)",
                    borderRadius: raio(cantosDasCaixas[index] ?? [0, 0, 0, 0]),
                  }}
                  className="text-brand-navy flex min-h-[140px] items-center justify-center px-5 py-6 text-center text-sm leading-snug font-bold md:text-base"
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