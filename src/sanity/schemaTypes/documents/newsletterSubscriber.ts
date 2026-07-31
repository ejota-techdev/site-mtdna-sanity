import { defineField, defineType } from "sanity";

/**
 * Assinante da newsletter.
 *
 * Criado pelo site, nao pelo painel — por isso e somente leitura, igual as
 * mensagens de contato. A criacao passa pela rota /api/newsletter, que usa
 * o token de escrita no servidor.
 *
 * O _id e derivado do e-mail, entao assinar duas vezes nao gera duplicata.
 */
export const newsletterSubscriber = defineType({
  name: "newsletterSubscriber",
  title: "Assinante da newsletter",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "email", title: "E-mail", type: "string" }),
    defineField({
      name: "subscribedAt",
      title: "Assinou em",
      type: "datetime",
    }),
  ],
  orderings: [
    {
      title: "Mais recentes primeiro",
      name: "subscribedAtDesc",
      by: [{ field: "subscribedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "email", subtitle: "subscribedAt" },
  },
});
