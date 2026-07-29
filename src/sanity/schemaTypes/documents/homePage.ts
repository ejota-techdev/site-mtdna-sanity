import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Home. Documento unico.
 *
 * Duas secoes NAO aparecem aqui de proposito: as marcas vem dos documentos
 * "Marca" e as publicacoes vem dos documentos "Publicacao". Assim o cliente
 * edita cada conteudo em um lugar so e a Home acompanha sozinha.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  groups: [
    { name: "hero", title: "Carrossel do topo" },
    { name: "about", title: "Bloco sobre" },
    { name: "highlights", title: "Cards de destaque" },
    { name: "sections", title: "Titulos das secoes" },
    { name: "newsletter", title: "Newsletter" },
    { name: "contact", title: "Contato" },
  ],
  fields: [
    defineField({
      name: "heroSlides",
      title: "Slides do carrossel",
      description:
        "Cada slide mostra uma imagem, o logo da marca e uma frase curta.",
      type: "array",
      group: "hero",
      of: [
        defineArrayMember({
          type: "object",
          name: "heroSlide",
          fields: [
            defineField({
              name: "image",
              title: "Imagem de fundo",
              type: "figureImage",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "brand",
              title: "Marca",
              description:
                "Opcional. Se preenchido, usa o logo e o link da marca.",
              type: "reference",
              to: [{ type: "brand" }],
            }),
            defineField({
              name: "tagline",
              title: "Frase",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "tagline", media: "image" },
          },
        }),
      ],
    }),

    // ---------- Bloco sobre (fundo petroleo) ----------
    defineField({
      name: "aboutText",
      title: "Texto",
      description: "Um paragrafo por linha em branco.",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
      group: "about",
    }),
    defineField({
      name: "aboutCta",
      title: "Botao",
      description: 'Ex.: "Sobre nos" apontando para /sobre.',
      type: "cta",
      group: "about",
    }),

    // ---------- Cards de destaque ----------
    defineField({
      name: "highlightImage",
      title: "Imagem grande",
      description: "A imagem que fica ao lado dos dois cards.",
      type: "figureImage",
      group: "highlights",
    }),
    defineField({
      name: "highlightCards",
      title: "Cards",
      description:
        'Os cards que expandem ao clicar no "+". Ex.: "Exclusivo para agentes de viagens" e "Marcas Premium".',
      type: "array",
      group: "highlights",
      of: [
        defineArrayMember({
          type: "object",
          name: "highlightCard",
          fields: [
            defineField({
              name: "title",
              title: "Titulo",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "image",
              title: "Imagem de fundo",
              type: "figureImage",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "body",
              title: "Texto que aparece ao expandir",
              type: "text",
              rows: 8,
            }),
          ],
          preview: { select: { title: "title", media: "image" } },
        }),
      ],
    }),

    // ---------- Titulos das secoes ----------
    defineField({
      name: "brandsTitle",
      title: "Titulo da secao de marcas",
      type: "string",
      initialValue: "Marcas",
      group: "sections",
    }),
    defineField({
      name: "postsTitle",
      title: "Titulo da secao de publicacoes",
      type: "string",
      initialValue: "Publicacoes",
      group: "sections",
    }),
    defineField({
      name: "postsLimit",
      title: "Quantas publicacoes exibir",
      description: "Sem contar o artigo em destaque.",
      type: "number",
      initialValue: 4,
      validation: (rule) => rule.min(0).max(12),
      group: "sections",
    }),

    // ---------- Newsletter ----------
    defineField({
      name: "newsletterTitle",
      title: "Titulo",
      type: "string",
      initialValue: "Assine as nossas newsletters",
      group: "newsletter",
    }),
    defineField({
      name: "newsletterPlaceholder",
      title: "Texto dentro do campo",
      type: "string",
      initialValue: "seu endereco de email...",
      group: "newsletter",
    }),
    defineField({
      name: "newsletterButtonLabel",
      title: "Texto do botao",
      type: "string",
      initialValue: "ASSINAR",
      group: "newsletter",
    }),

    // ---------- Contato ----------
    defineField({
      name: "contactTitle",
      title: "Titulo da secao",
      type: "string",
      initialValue: "Contato",
      group: "contact",
    }),
    defineField({
      name: "contactFormTitle",
      title: "Titulo do formulario",
      type: "string",
      initialValue: "Decole seu negocio com a gente!",
      group: "contact",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home" }),
  },
});
