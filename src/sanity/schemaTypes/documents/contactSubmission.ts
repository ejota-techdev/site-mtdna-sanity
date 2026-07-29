import { defineField, defineType } from "sanity";

/**
 * Envio do formulario de contato.
 *
 * Criado pelo site, nao pelo painel — por isso os campos sao somente leitura:
 * evita que alguem edite um lead por engano. A criacao passa pela rota
 * /api/contato, que usa o token de escrita no servidor.
 */
export const contactSubmission = defineType({
  name: "contactSubmission",
  title: "Mensagem recebida",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "name", title: "Nome", type: "string" }),
    defineField({ name: "email", title: "E-mail", type: "string" }),
    defineField({ name: "agency", title: "Agencia de viagens", type: "string" }),
    defineField({
      name: "message",
      title: "Mensagem",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "submittedAt",
      title: "Recebida em",
      type: "datetime",
    }),
  ],
  orderings: [
    {
      title: "Mais recentes primeiro",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "email", date: "submittedAt" },
    prepare: ({ title, subtitle }) => ({
      title: title || "(sem nome)",
      subtitle,
    }),
  },
});
