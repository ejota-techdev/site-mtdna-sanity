import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Marca parceira (Europcar, Goldcar, Unlock).
 * Um unico template atende as tres — o que muda e o conteudo.
 * Alimenta: dropdown "Marcas" no menu, secao de marcas na Home,
 * faixa de logos e a pagina /marcas/[slug].
 */
export const brand = defineType({
  name: "brand",
  title: "Marca",
  type: "document",
  groups: [
    { name: "identity", title: "Identidade" },
    { name: "hero", title: "Topo da pagina" },
    { name: "content", title: "Conteudo" },
    { name: "locations", title: "Destinos" },
    { name: "contact", title: "Contato" },
    { name: "home", title: "Aparencia na Home" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nome",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Endereco (slug)",
      description: "Define a URL: /marcas/[slug].",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Ordem",
      description: "Define a posicao no menu e na Home. Menor aparece antes.",
      type: "number",
      group: "identity",
      initialValue: 0,
    }),
    defineField({
      name: "logo",
      title: "Logo (fundo claro)",
      type: "figureImage",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logoLight",
      title: "Logo (fundo escuro)",
      description: "Versao usada sobre imagens e fundos escuros.",
      type: "figureImage",
      group: "identity",
    }),

    // ---------- Topo da pagina ----------
    defineField({
      name: "heroImage",
      title: "Imagem do topo",
      type: "figureImage",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Frase do topo",
      description: 'Ex.: "Locacao de veiculos com confianca e alcance global".',
      type: "string",
      group: "hero",
    }),

    // ---------- Conteudo ----------

    /*
     * Layout da pagina, controlado pelo painel.
     *
     * Cada marca tem um wireframe proprio e eles nao sao iguais: na Europcar
     * o texto fica a esquerda e a foto a direita, com o botao alinhado a
     * esquerda; na Goldcar e o espelho disso, com o botao centralizado; a
     * Unlock tem uma pagina de estrutura diferente, com o mapa.
     *
     * Antes isso vivia como `if (slug === "unlock")` dentro da pagina, o que
     * obrigava a mexer no codigo a cada marca nova. Como campo, quem cadastra
     * a marca escolhe no Studio.
     */
    defineField({
      name: "pageLayout",
      title: "Modelo da pagina",
      description:
        "Padrao serve para a maioria das marcas. Unlock tem o mapa de destinos e uma ordem diferente dos blocos.",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Padrao", value: "padrao" },
          { title: "Unlock (com mapa)", value: "unlock" },
        ],
        layout: "radio",
      },
      initialValue: "padrao",
    }),
    defineField({
      name: "featureImageSide",
      title: "Lado da imagem no bloco de destaque",
      description:
        "De que lado a foto do bloco de destaque aparece. O texto vai para o lado oposto.",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Direita", value: "direita" },
          { title: "Esquerda", value: "esquerda" },
        ],
        layout: "radio",
      },
      initialValue: "direita",
    }),
    defineField({
      name: "featureCtaAlign",
      title: "Alinhamento do botao de acao",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Esquerda", value: "esquerda" },
          { title: "Centro", value: "centro" },
        ],
        layout: "radio",
      },
      initialValue: "esquerda",
    }),

    defineField({
      name: "introTitle",
      title: "Titulo de abertura",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "introText",
      title: "Texto de abertura",
      type: "text",
      rows: 4,
      group: "content",
    }),
    defineField({
      name: "featureTitle",
      title: "Titulo do bloco de destaque",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "featureText",
      title: "Texto do bloco de destaque",
      type: "text",
      rows: 8,
      group: "content",
    }),
    defineField({
      name: "featureImage",
      title: "Imagem do bloco de destaque",
      type: "figureImage",
      group: "content",
    }),
    defineField({
      name: "featureCta",
      title: "Botao do bloco de destaque",
      description: 'Ex.: "Reserve com a Europcar".',
      type: "cta",
      group: "content",
    }),
    defineField({
      name: "featureNote",
      title: "Observacao abaixo do botao",
      description:
        "Texto pequeno opcional. Ex.: aviso sobre comissionamento na Unlock.",
      type: "text",
      rows: 2,
      group: "content",
    }),
    defineField({
      name: "highlights",
      title: "Caixas de destaque",
      description:
        "As caixas com borda coral. Cada item e um texto curto. A Europcar usa 6, a Goldcar usa 3.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "content",
    }),
    defineField({
      name: "gallery",
      title: "Demais imagens do topo",
      description:
        "Entram no carrossel do topo, depois da imagem principal. Deixe vazio para o topo ficar com uma imagem so, sem carrossel.",
      type: "array",
      of: [defineArrayMember({ type: "figureImage" })],
      group: "hero",
      options: { layout: "grid" },
    }),

    defineField({
      name: "benefitsTitle",
      title: "Titulo dos beneficios",
      type: "string",
      initialValue: "Beneficios para voce e seu cliente",
      group: "content",
    }),
    defineField({
      name: "benefits",
      title: "Lista de beneficios",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "content",
    }),

    // ---------- Destinos (mapa — usado pela Unlock) ----------
    defineField({
      name: "showLocationMap",
      title: "Exibir mapa de destinos",
      description:
        "Ative apenas para marcas que tem mapa de localidades (hoje, so a Unlock).",
      type: "boolean",
      initialValue: false,
      group: "locations",
    }),
    defineField({
      name: "locationsIntro",
      title: "Texto acima do mapa",
      type: "text",
      rows: 4,
      group: "locations",
      hidden: ({ document }) => !document?.showLocationMap,
    }),
    defineField({
      name: "locations",
      title: "Destinos",
      description:
        "Nomes das localidades marcadas no mapa, na ordem em que devem aparecer.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "locations",
      hidden: ({ document }) => !document?.showLocationMap,
    }),

    // ---------- Faixa de contato (amarela) ----------
    defineField({
      name: "website",
      title: "Site",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "websiteUrl",
      title: "Link do site",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "phone",
      title: "Telefone",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "email",
      title: "E-mail",
      type: "string",
      group: "contact",
    }),

    // ---------- Aparencia na Home ----------
    defineField({
      name: "homeCardImage",
      title: "Imagem do card na Home",
      type: "figureImage",
      group: "home",
    }),
    defineField({
      name: "homeCardText",
      title: "Texto do card na Home",
      type: "text",
      rows: 4,
      group: "home",
    }),
    defineField({
      name: "showInHeroCarousel",
      title: "Incluir no carrossel do topo da Home",
      type: "boolean",
      initialValue: true,
      group: "home",
    }),
  ],
  orderings: [
    {
      title: "Ordem de exibicao",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "tagline", media: "logo" },
  },
});
