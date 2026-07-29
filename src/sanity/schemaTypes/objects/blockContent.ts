import { defineArrayMember, defineType } from "sanity";

/**
 * Corpo de texto rico. Usado no artigo de Publicacoes, que intercala
 * paragrafos e imagens de largura total.
 */
export const blockContent = defineType({
  name: "blockContent",
  title: "Conteudo",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragrafo", value: "normal" },
        { title: "Titulo", value: "h2" },
        { title: "Subtitulo", value: "h3" },
        { title: "Citacao", value: "blockquote" },
      ],
      lists: [
        { title: "Lista com marcadores", value: "bullet" },
        { title: "Lista numerada", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Negrito", value: "strong" },
          { title: "Italico", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "Endereco (URL)",
                validation: (rule) =>
                  rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      title: "Imagem",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Texto alternativo",
          description:
            "Descreve a imagem para leitores de tela e para quando ela nao carregar.",
        },
      ],
    }),
  ],
});
