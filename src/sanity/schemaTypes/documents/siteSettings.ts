import { defineField, defineType } from "sanity";

/**
 * Configuracoes que aparecem em todas as paginas: logo, dados de contato
 * (usados no rodape, na Home e na pagina de Contato) e redes sociais.
 * Documento unico — editado em um lugar so, refletido no site inteiro.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Configuracoes do site",
  type: "document",
  groups: [
    { name: "brand", title: "Marca" },
    { name: "contact", title: "Contato" },
    { name: "footer", title: "Rodape" },
  ],
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "figureImage",
      group: "brand",
    }),
    defineField({
      name: "logoFooter",
      title: "Logo do rodape",
      description: "Versao usada sobre fundo escuro.",
      type: "figureImage",
      group: "brand",
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
    defineField({
      name: "instagram",
      title: "Instagram",
      description: "Perfil exibido (ex.: mtdna.travel).",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "instagramUrl",
      title: "Link do Instagram",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn",
      description: "Texto exibido (ex.: linkedin.com/company/mtdna/).",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "linkedinUrl",
      title: "Link do LinkedIn",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "whatsappUrl",
      title: "Link do WhatsApp",
      description: "Ex.: https://wa.me/5521999999999",
      type: "url",
      group: "contact",
    }),

    defineField({
      name: "footerCredit",
      title: "Credito do rodape",
      description: 'Ex.: "Desenvolvido por Empresa Junior PUC-Rio".',
      type: "string",
      group: "footer",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Configuracoes do site" }),
  },
});
