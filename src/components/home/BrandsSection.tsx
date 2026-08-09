import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";
import type { HomeBrand } from "@/sanity/lib/types";

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

        {/* 
          ⚠️ MUDANÇA AQUI:
          Substituímos o 'gap-4' por 'gap-[2px]' para criar a linha branca bem fininha separando os itens.
        */}
        <div className="grid gap-[5px] md:grid-cols-2">
          {brands.map((brand, i) => {
            const textFirst = i % 2 === 0;

            // =====================================================================
            // CONTROLE INDIVIDUAL DE ARREDONDAMENTO POR QUADRADINHO
            // =====================================================================
            // Dica: Use 'rounded-3xl' para arredondar tudo no celular, e adicione
            // 'md:rounded-tr-none' (por exemplo) para tirar o arredondamento no Desktop.
            // Posições: tl (top-left), tr (top-right), bl (bottom-left), br (bottom-right).
            
            let cardCorners = "";
            let photoCorners = "";

            switch (i) {
              case 0: 
                // 1ª LINHA (Ex: Europcar) - Texto Esq / Foto Dir
                cardCorners  = "rounded-3xl md:rounded-br-[60px] md:rounded-tl-none md:rounded-tr-none md:rounded-bl-none"; // Texto: Canto inferior direito reto
                photoCorners = "rounded-3xl md:rounded-bl-[60px] md:rounded-tl-none md:rounded-tr-[60px] md:rounded-br-none"; // Foto: Canto inferior esquerdo reto
                break;
                
              case 1: 
                // 2ª LINHA (Ex: Goldcar) - Foto Esq / Texto Dir
                photoCorners = "rounded-3xl md:rounded-br-[60px] md:rounded-tl-none md:rounded-tr-[60px] md:rounded-bl-none"; // Foto: Canto inferior direito reto
                cardCorners  = "rounded-3xl md:rounded-bl-[60px] md:rounded-tl-[60px] md:rounded-tr-none md:rounded-br-none"; // Texto: Canto inferior esquerdo reto
                break;
                
              case 2: 
                // 3ª LINHA (Ex: Unlock) - Texto Esq / Foto Dir
                // EXEMPLO CUSTOMIZADO: Arredondamento enorme em cima, reto embaixo
                cardCorners  = "rounded-3xl md:rounded-tl-none md:rounded-br-none md:rounded-tr-[60px] md:rounded-bl-none"; // Texto: Canto superior esquerdo reto
                photoCorners = "rounded-3xl md:rounded-tr-none md:rounded-bl-none md:rounded-tl-[60px] md:rounded-br-none"; // Foto: Canto superior direito reto
                break;

              default:
                // REGRA PADRÃO (Caso você cadastre a 4ª, 5ª, 6ª marca lá no Sanity)
                cardCorners  = textFirst ? "rounded-3xl md:rounded-br-none" : "rounded-3xl md:rounded-bl-none";
                photoCorners = textFirst ? "rounded-3xl md:rounded-bl-none" : "rounded-3xl md:rounded-br-none";
                break;
            }
            // =====================================================================

            const renderCard = (cornerClasses: string) => (
              <Link
                href={`/marcas/${brand.slug}`}
                className={`bg-brand-teal group relative flex min-h-[280px] flex-col justify-center gap-5 p-8 text-white transition-all duration-300 hover:opacity-95 ${cornerClasses}`}
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

            const renderPhoto = (cornerClasses: string) => (
              <div className={`relative min-h-[280px] overflow-hidden ${cornerClasses}`}>
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
                    {renderCard(cardCorners)}
                    {renderPhoto(photoCorners)}
                  </>
                ) : (
                  <>
                    {renderPhoto(photoCorners)}
                    {renderCard(cardCorners)}
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