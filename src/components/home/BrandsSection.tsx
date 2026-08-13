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
 *
 * O desenho e um zigue-zague, e so os cantos que "olham" para dentro do S
 * sao arredondados. Nao da para gerar por formula a partir do indice: a
 * ultima linha foge do padrao das duas primeiras (o texto fica todo reto e a
 * foto arredonda so em cima a esquerda), entao a tabela e literal mesmo.
 *
 * VIA `style` INLINE, E NAO CLASSE DO TAILWIND, de proposito.
 *
 * Neste projeto o scanner do Tailwind nao gera parte das utilitarias novas —
 * `rounded-tr-[48px]`, `rounded-bl-[48px]` e `gap-[5px]` foram todos
 * ignorados, sem erro nenhum aparecer, e a grade saia inteira reta. Foi assim
 * que a versao anterior deste componente, que ja listava
 * `md:rounded-*-[60px]` em toda celula, nunca chegou a arredondar nada na
 * tela. Tentar via token de tema (`rounded-*-cell`) tambem nao funcionou.
 *
 * Como o mapa de cantos e dado medido, e nao estilo ad hoc, passar direto no
 * `style` e mais honesto e nao depende do scanner. Se um dia a geracao de
 * CSS do projeto for consertada, da para voltar para classes.
 */
const CANTOS: Record<number, { texto: Cantos; foto: Cantos }> = {
  //    marca            [ tl, tr, br, bl ]
  0: { texto: [0, 0, R, 0], foto: [0, R, 0, R] },
  1: { texto: [R, 0, 0, R], foto: [0, R, R, 0] },
  2: { texto: [0, R, 0, 0], foto: [R, 0, 0, 0] },
};

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
 *
 * `object-contain` encaixa o logo na caixa preservando a proporcao, entao
 * quem manda no tamanho final e a dimensao mais apertada. Europcar e Goldcar
 * sao praticamente so a palavra — largos e baixos, enchem a largura. A Unlock
 * e um lockup de brasao + duas linhas de texto, bem mais alto em proporcao:
 * ele bate no teto de altura da caixa antes de usar a largura e acaba
 * aparecendo bem menor que os outros dois. Uma caixa maior so para ela
 * reequilibra o conjunto, sem mexer nas demais.
 *
 * Em `rem` no `style` inline, e nao em classe: `w-64` nao esta no CSS gerado
 * deste projeto e era ignorado (a caixa esticava ate a largura do card),
 * enquanto `h-16` funcionava por ja existir em outro lugar. Os valores sao os
 * mesmos das utilitarias que deveriam ter sido usadas — `w-44`/`h-10` viram
 * 11rem/2.5rem, `w-64`/`h-16` viram 16rem/4rem — entao continuam
 * acompanhando o `font-size` da raiz como o resto do layout.
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

        {/*
          `gap-1` (4.8px) e nao `gap-[5px]`: o wireframe mostra 4px de linha
          branca entre as celulas, e o valor entre colchetes tambem nao estava
          sendo gerado — o grid saia sem gap nenhum.
        */}
        <div className="grid gap-1 md:grid-cols-2">
          {brands.map((brand, i) => {
            const textFirst = i % 2 === 0;
            const cantos = CANTOS[i] ?? CANTOS_PADRAO;
            const caixaLogo = CAIXA_LOGO[brand.slug] ?? CAIXA_LOGO_PADRAO;

            const renderCard = (cantosDaCelula: Cantos) => (
              <Link
                href={`/marcas/${brand.slug}`}
                /*
                  `minWidth: 0` libera o item do grid a encolher. Sem isso ele
                  vale `min-content`, e a caixa de 16rem do logo da Unlock
                  empurrava a coluna para 384px numa tela de 375px — a Home
                  ganhava rolagem horizontal no celular.
                */
                style={{ borderRadius: raio(cantosDaCelula), minWidth: 0 }}
                className="bg-brand-teal group relative flex min-h-[280px] flex-col justify-center gap-5 p-8 text-white transition-all duration-300 hover:opacity-95"
              >
                <span
                  className="absolute top-6 right-8 text-3xl leading-none text-white/90"
                  aria-hidden="true"
                >
                  +
                </span>

                <span
                  className="relative block"
                  /*
                    `maxWidth: 100%` e obrigatorio: a caixa da Unlock tem
                    16rem (307px) e, somada ao `p-8` do card, empurrava a
                    coluna do grid para 384px numa tela de 375px — a Home
                    ganhava rolagem horizontal no celular.
                  */
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
                className="relative min-h-[280px] overflow-hidden"
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