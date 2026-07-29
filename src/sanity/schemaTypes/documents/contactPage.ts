import { defineField, defineType } from "sanity";

/**
 * Pagina de Contato. Documento unico.
 * Telefone, e-mail e redes vem de "Configuracoes do site" — nao se repetem aqui.
 */
export const contactPage = defineType({
  name: "contactPage",
  title: "Pagina de Contato",
  type: "document",
  fields: [
    defineField({
      name: "heroImage",
      title: "Imagem do topo",
      type: "figureImage",
    }),
    defineField({
      name: "title",
      title: "Titulo",
      type: "string",
      initialValue: "Contato",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitulo",
      description: 'Ex.: "Conecte-se a MTDNA!".',
      type: "string",
    }),
    defineField({
      name: "formTitle",
      title: "Titulo do formulario",
      type: "string",
      initialValue: "Decole seu negocio com a gente!",
    }),
    defineField({
      name: "infoTitle",
      title: "Titulo da coluna de informacoes",
      type: "string",
      initialValue: "Informacoes de contato",
    }),
    defineField({
      name: "whatsappTitle",
      title: "Titulo do bloco de WhatsApp",
      type: "string",
      initialValue: "Nosso WhatsApp",
    }),
    defineField({
      name: "whatsappButtonLabel",
      title: "Texto do botao de WhatsApp",
      type: "string",
      initialValue: "Entre em contato",
    }),
    defineField({
      name: "successMessage",
      title: "Mensagem de confirmacao",
      description: "Exibida depois que o formulario e enviado com sucesso.",
      type: "string",
      initialValue: "Recebemos sua mensagem. Em breve entraremos em contato!",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Pagina de Contato" }),
  },
});
