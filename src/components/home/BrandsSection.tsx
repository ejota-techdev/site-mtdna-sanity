import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";
import type { HomeBrand } from "@/sanity/lib/types";

/** Raio dos cantos arredondados da grade, em px. */
const R = 48;

/** `[superior-esq, superior-dir, inferior-dir, inferior-esq]`, como no CSS. */
type Cantos = [number, number, number, number];

/**
 * Cantos arredondados de cada celula da grade de marcas.
 *
 * Medidos no wireframe `Home.png` a 1440px: 3 linhas de 272px numa grade de
 * 1103px com 4px de gap, e raios entre 40 e 52px — 48px aqui.
 */
const CANTOS: Record<number, { texto: Cantos; foto: Cantos }> = {
  //    marca            [ tl, tr, br, bl ]
  0: { texto: [0, 0, R, 0], foto: [0, R, 0, R] },
  1: { texto: [R, 0, 0, R], foto: [0, R, R, 0] },
  2: { texto: [0, R, 0, 0], foto: [R, 0, 0, 0] },
};

/**
 * 📱 Lógica de Ordem Responsiva (CSS Order)
 * 
 * Mapeamos as ordens de renderização de forma que em telas de celular (max-md),
 * o card de texto sempre apareça ANTES da foto da marca correspondente.
 * No desktop (md), a Goldcar (index 1) volta a colocar a Foto antes do Card
 * para manter o efeito zigue-zague elegante do Figma.
 */
const ORDER_CLASSES: Record<number, { texto: string; foto: string }> = {
  0: { texto: "order-1", foto: "order-2" },
  1: { texto: "max-md:order-3 md:order-4", foto: "max-md:order-4 md:order-3" },
  2: { texto: "order-5", foto: "order-6" },
};

const ORDER_CLASSES_PADRAO = { texto: "", foto: "" };

/** Para a 4a marca em diante, cadastrada depois no Sanity. */
const CANTOS_PADRAO: { texto: Cantos; foto: Cantos } = {
  texto: [0, 0, R, 0],
  foto: [R, 0, 0, 0],
};

/** Monta o `border-radius` a partir da tupla. */
const raio = ([tl, tr, br, bl]: Cantos) =>
  `${tl}px ${tr}px ${br}px ${bl}px`;

/**
 * Caixa do logo dentro do card, por marca.
 */
const CAIXA_LOGO: Record<string, { largura: string; altura: string; sizes: string }> = {
  unlock: { largura: "16rem", altura: "4rem", sizes: "307px" },
};

const CAIXA_LOGO_PADRAO = { largura: "11rem", altura: "2.5rem", sizes: "176px" };

/**
 * Faixa de logos + grade alternada de marcas.
 */
export function BrandsSection({
  title,
  brands,
  destaques,
}: {
  title?: string;
  brands: HomeBrand[];
  destaques?: React.ReactNode;
}) {
  if (!brands.length) return null;

  return (
    <>
      <section
        aria-label="Marcas parceiras"
        className="container-mtdna flex flex-wrap items-center justify-center gap-12 pt-16 pb-8 md:gap-20 md:pt-24 md:pb-12"
      >
        {brands.map((brand) => (
          <Link
            key={brand._id}
            href={`/marcas/${brand.slug}`}
            className="relative block h-14 w-32 transition-opacity hover:opacity-70 sm:h-16 sm:w-40"
          >
            <SanityImage
              image={brand.logo}
              alt={brand.name}
              sizes="160px"
              className="object-contain"
            />
          </Link>
        ))}
      </section>

      {destaques}

      <section className="container-mtdna py-8">
        <h2 className="text-brand-teal mb-8 text-3xl font-bold">{title}</h2>

        <div className="grid gap-1 md:grid-cols-2">
          {brands.map((brand, i) => {
            const textFirst = i % 2 === 0;
            const cantos = CANTOS[i] ?? CANTOS_PADRAO;
            const order = ORDER_CLASSES[i] ?? ORDER_CLASSES_PADRAO;
            const caixaLogo = CAIXA_LOGO[brand.slug] ?? CAIXA_LOGO_PADRAO;

            const renderCard = (cantosDaCelula: Cantos) => (
              <Link
                href={`/marcas/${brand.slug}`}
                /*
                  `minWidth: 0` libera o item do grid a encolher para evitar bugs em telas menores.
                */
                style={{ borderRadius: raio(cantosDaCelula), minWidth: 0 }}
                className={`bg-brand-teal group relative flex min-h-[280px] flex-col justify-center gap-5 p-8 text-white transition-all duration-300 hover:opacity-95 ${order.texto}`}
              >
                <span
                  className="absolute top-6 right-8 text-3xl leading-none text-white/90"
                  aria-hidden="true"
                >
                  +
                </span>

                <span
                  className="relative block"
                  style={{
                    width: caixaLogo.largura,
                    height: caixaLogo.altura,
                    maxWidth: "100%",
                  }}
                >
                  <SanityImage
                    image={brand.logoLight ?? brand.logo}
                    alt={brand.name}
                    sizes={caixaLogo.sizes}
                    className="object-contain object-left"
                  />
                </span>

                <span className="text-sm leading-relaxed text-white/90">
                  {brand.homeCardText}
                </span>
              </Link>
            );

            const renderPhoto = (cantosDaCelula: Cantos) => (
              <div
                style={{ borderRadius: raio(cantosDaCelula) }}
                className={`relative min-h-[280px] overflow-hidden ${order.foto}`}
              >
                <SanityImage
                  image={brand.homeCardImage}
                  alt={brand.name}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            );

            return (
              <div key={brand._id} className="contents">
                {textFirst ? (
                  <>
                    {renderCard(cantos.texto)}
                    {renderPhoto(cantos.foto)}
                  </>
                ) : (
                  <>
                    {renderPhoto(cantos.foto)}
                    {renderCard(cantos.texto)}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}