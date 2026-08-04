import Link from "next/link";

import { SanityImage } from "@/components/SanityImage";
import type { HomeBrand } from "@/sanity/lib/types";

/**
 * Faixa de logos + grade alternada de marcas.
 * A cada marca, o card de texto troca de lado — igual ao wireframe.
 */
export function BrandsSection({
  title,
  brands,
  destaques,
}: {
  title?: string;
  brands: HomeBrand[];
  /** Cards de destaque — entram entre a faixa de logos e a grade. */
  destaques?: React.ReactNode;
}) {
  if (!brands.length) return null;

  return (
    <>
      <section
        aria-label="Marcas parceiras"
        /* 
         * Ajuste: Trocamos o 'py-14' por 'pt-16 pb-8' (mobile) e 'pt-24 pb-12' (desktop).
         * Isso empurra as logos para baixo, compensando o impacto visual dos
         * elementos acima e abaixo, centralizando as imagens no espaço em branco.
         */
        className="container-mtdna flex flex-wrap items-center justify-center gap-12 pt-16 pb-8 md:gap-20 md:pt-24 md:pb-12"
      >
        {brands.map((brand) => (
          <Link
            key={brand._id}
            href={`/marcas/${brand.slug}`}
            /* 
             * Aumentamos a altura de h-11 para h-14 (mobile) e sm:h-16 (desktop).
             * Isso dá mais respiro para as logos se auto-alinharem pelo centro.
             */
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

        <div className="grid gap-4 md:grid-cols-2">
          {brands.map((brand, i) => {
            const textFirst = i % 2 === 0;

            const card = (
              <Link
                href={`/marcas/${brand.slug}`}
                className="bg-brand-teal corner-br-flat group relative flex min-h-[280px] flex-col justify-center gap-5 p-8 text-white transition-opacity hover:opacity-95"
              >
                <span
                  className="absolute top-6 right-8 text-3xl leading-none text-white/90"
                  aria-hidden="true"
                >
                  +
                </span>

                <span className="relative block h-10 w-44">
                  <SanityImage
                    image={brand.logoLight ?? brand.logo}
                    alt={brand.name}
                    sizes="176px"
                    className="object-contain object-left"
                  />
                </span>

                <span className="text-sm leading-relaxed text-white/90">
                  {brand.homeCardText}
                </span>
              </Link>
            );

            const photo = (
              <div className="corner-bl-flat relative min-h-[280px] overflow-hidden">
                <SanityImage
                  image={brand.homeCardImage}
                  alt={brand.name}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            );

            return (
              <div key={brand._id} className="contents">
                {textFirst ? card : photo}
                {textFirst ? photo : card}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}