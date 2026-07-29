import { defineField, defineType } from "sanity";

/** Botao de acao: texto + destino. */
export const cta = defineType({
  name: "cta",
  title: "Botao",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Texto do botao",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Destino",
      type: "string",
      description:
        "Caminho interno (ex.: /contato) ou endereco completo (ex.: https://...).",
      validation: (rule) => rule.required(),
    }),
  ],
});
