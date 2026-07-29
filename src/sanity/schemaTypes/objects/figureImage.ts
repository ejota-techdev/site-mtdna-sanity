import { defineField, defineType } from "sanity";

/** Imagem com texto alternativo obrigatorio. */
export const figureImage = defineType({
  name: "figureImage",
  title: "Imagem",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Texto alternativo",
      type: "string",
      description:
        "Descreve a imagem para leitores de tela e para quando ela nao carregar.",
      validation: (rule) => rule.required(),
    }),
  ],
});
