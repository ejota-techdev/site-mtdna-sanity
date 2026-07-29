import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Pagina "Sobre Nos". Existe em tres versoes de idioma (PT / ES / EN),
 * cada uma um documento proprio — e o unico conteudo traduzido do site,
 * conforme o dropdown "Sobre" no menu.
 */
export const aboutPage = defineType({
  name: "aboutPage",
  title: "Pagina Sobre Nos",
  type: "document",
  groups: [
    { name: "hero", title: "Topo" },
    { name: "intro", title: "Quem somos" },
    { name: "accordion", title: "Blocos expansiveis" },
    { name: "services", title: "Servicos" },
    { name: "cta", title: "Chamada final" },
  ],
  fields: [
    defineField({
      name: "language",
      title: "Idioma",
      type: "string",
      options: {
        list: [
          { title: "Portugues", value: "pt" },
          { title: "Espanhol", value: "es" },
          { title: "Ingles", value: "en" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "menuLabel",
      title: "Texto no menu",
      description: 'Ex.: "Sobre Nos (PT)", "Sobre Nosotros (ES)", "About Us (EN)".',
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "heroImage",
      title: "Imagem do topo",
      type: "figureImage",
      group: "hero",
    }),
    defineField({
      name: "title",
      title: "Titulo",
      description: 'Ex.: "Sobre Nos".',
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "introTitle",
      title: "Titulo da secao",
      description: 'Ex.: "Quem somos".',
      type: "string",
      group: "intro",
    }),
    defineField({
      name: "introText",
      title: "Texto",
      type: "text",
      rows: 6,
      group: "intro",
    }),

    defineField({
      name: "accordion",
      title: "Blocos expansiveis",
      description:
        'Os tres blocos que abrem ao clicar: "O que fazemos", "Nossas especialidades", "O que proporcionamos".',
      type: "array",
      group: "accordion",
      of: [
        defineArrayMember({
          type: "object",
          name: "accordionItem",
          fields: [
            defineField({
              name: "title",
              title: "Titulo",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "body",
              title: "Texto",
              type: "text",
              rows: 6,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),

    defineField({
      name: "servicesTitle",
      title: "Titulo da secao",
      description: 'Ex.: "Nossos Servicos".',
      type: "string",
      group: "services",
    }),
    defineField({
      name: "services",
      title: "Servicos",
      description: "Os cards amarelos com icone.",
      type: "array",
      group: "services",
      of: [
        defineArrayMember({
          type: "object",
          name: "service",
          fields: [
            defineField({
              name: "icon",
              title: "Icone",
              description: "Arquivo SVG, preferencialmente.",
              type: "figureImage",
            }),
            defineField({
              name: "title",
              title: "Nome do servico",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "title", media: "icon" } },
        }),
      ],
    }),

    defineField({
      name: "ctaImage",
      title: "Imagem de fundo",
      type: "figureImage",
      group: "cta",
    }),
    defineField({
      name: "ctaTitle",
      title: "Texto da chamada",
      description: 'Ex.: "Conecte-se a MTDNA!".',
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaButton",
      title: "Botao",
      type: "cta",
      group: "cta",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "menuLabel", media: "heroImage" },
  },
});
