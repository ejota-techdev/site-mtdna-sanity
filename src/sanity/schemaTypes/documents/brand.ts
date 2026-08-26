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

    // ==========================================================
    // TOPO DA PÁGINA (CARROSSEL DE SLIDES E FALLBACKS)
    // ==========================================================
    defineField({
      name: "heroImage",
      title: "Imagem do topo principal",
      description: "Usado caso não existam slides no carrossel abaixo.",
      type: "figureImage",
      group: "hero",
    }),
    defineField({
      name: "tagline",
      title: "Frase da marca",
      description: 'Ex.: "Autenticidade e elegância em hotéis boutique portugueses".',
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "slides",
      title: "Slides do Carrossel",
      description: "Adicione os slides. Cada slide pode ter uma imagem e uma frase customizada (se não preencher a frase, ele usará a 'Frase da marca' acima).",
      type: "array",
      group: "hero",
      of: [
        defineArrayMember({
          type: "object",
          name: "slide",
          title: "Slide",
          fields: [
            defineField({
              name: "image",
              title: "Imagem",
              type: "figureImage",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "tagline",
              title: "Frase deste slide (Opcional)",
              description: "Se quiser uma frase diferente para esta foto, digite aqui.",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "tagline",
              media: "image",
            },
            prepare({ title, media }) {
              return {
                title: title || "Slide (Usa a frase padrão)",
                media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Galeria antiga",
      type: "array",
      of: [defineArrayMember({ type: "figureImage" })],
      group: "hero",
      hidden: true, // Ocultado para evitar confusão, já que agora usamos o campo "slides"
    }),

    // ---------- Conteudo ----------
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
    
    // 👇 CONTROLE DAS BORDAS (Aparece APENAS para a Europcar)
    defineField({
      name: "featureImageCorners",
      title: "Bordas da Imagem de Destaque (Exclusivo Europcar)",
      description: "Marque para deixar a ponta curva. Desmarque para deixar a ponta reta (quadrada).",
      type: "object",
      group: "content",
      hidden: ({ document }) =>
        (document?.slug as { current?: string } | undefined)?.current !== "europcar",
      fields: [
        defineField({ name: "topLeft", title: "Superior Esquerdo", type: "boolean", initialValue: true }),
        defineField({ name: "topRight", title: "Superior Direito", type: "boolean", initialValue: true }),
        defineField({ name: "bottomLeft", title: "Inferior Esquerdo", type: "boolean", initialValue: true }),
        defineField({ name: "bottomRight", title: "Inferior Direito (Curva Maior)", type: "boolean", initialValue: true }),
      ],
      options: { columns: 2 } 
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