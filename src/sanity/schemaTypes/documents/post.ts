import { defineField, defineType } from "sanity";

/**
 * Publicacao (artigo). O mesmo documento alimenta tres lugares:
 * a previa na Home, a listagem em /publicacoes e a pagina do artigo.
 */
export const post = defineType({
  name: "post",
  title: "Publicacao",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titulo",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Endereco (slug)",
      description: "Gerado a partir do titulo. Define a URL do artigo.",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Data de publicacao",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Imagem de capa",
      description:
        "Aparece na Home, na listagem e no topo do artigo.",
      type: "figureImage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Resumo",
      description:
        "Texto curto exibido nos cards e no topo do artigo. Ate 300 caracteres.",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "featured",
      title: "Destacar na Home",
      description:
        "O artigo em destaque aparece maior, no topo da secao de Publicacoes.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "body",
      title: "Conteudo",
      type: "blockContent",
    }),
  ],
  orderings: [
    {
      title: "Mais recentes primeiro",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "coverImage",
    },
  },
});
