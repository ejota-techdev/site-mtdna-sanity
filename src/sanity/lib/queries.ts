import { defineQuery } from "next-sanity";

/** Campos de imagem reaproveitados em todas as queries. */
const IMAGE = `{ ..., alt, asset-> { _id, url, metadata { lqip, dimensions } } }`;

/** Marcas em ordem, para o menu e o rodape. */
export const brandsNavQuery = defineQuery(`
  *[_type == "brand"] | order(order asc) {
    _id, name, "slug": slug.current
  }
`) as any;

/** Idiomas disponiveis da pagina Sobre, para o dropdown do menu. */
export const aboutLanguagesQuery = defineQuery(`
  *[_type == "aboutPage"] | order(language asc) {
    _id, language, menuLabel
  }
`) as any;

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    logo ${IMAGE},
    logoFooter ${IMAGE},
    phone, email,
    instagram, instagramUrl,
    linkedin, linkedinUrl,
    whatsappUrl,
    footerCredit
  }
`) as any;

export const homePageQuery = defineQuery(`
  *[_type == "homePage"][0] {
    heroSlides[] {
      tagline,
      image ${IMAGE},
      brand-> { name, "slug": slug.current, logo ${IMAGE}, logoLight ${IMAGE} }
    },
    aboutText,
    aboutCta,
    highlightImage ${IMAGE},
    highlightCards[] { title, body, image ${IMAGE} },
    brandsTitle,
    postsTitle,
    postsLimit,
    newsletterTitle,
    newsletterPlaceholder,
    newsletterButtonLabel,
    contactTitle,
    contactFormTitle
  }
`) as any;

/** Marcas com os campos que a Home exibe nos cards. */
export const homeBrandsQuery = defineQuery(`
  *[_type == "brand"] | order(order asc) {
    _id, name, "slug": slug.current,
    homeCardText,
    homeCardImage ${IMAGE},
    logo ${IMAGE},
    logoLight ${IMAGE}
  }
`) as any;

/** Artigo em destaque da Home (o card grande). */
export const featuredPostQuery = defineQuery(`
  *[_type == "post" && featured == true] | order(publishedAt desc)[0] {
    _id, title, "slug": slug.current, excerpt, publishedAt,
    coverImage ${IMAGE}
  }
`) as any;

/**
 * Demais artigos da Home. Exclui o destaque para nao repetir o mesmo card.
 * $featuredId pode ser null quando nenhum artigo esta marcado como destaque.
 */
export const recentPostsQuery = defineQuery(`
  *[_type == "post" && _id != $featuredId] | order(publishedAt desc)[0...$limit] {
    _id, title, "slug": slug.current, excerpt, publishedAt,
    coverImage ${IMAGE}
  }
`) as any;

/** Listagem paginada de /publicacoes. */
export const postsPageQuery = defineQuery(`
  *[_type == "post"] | order(publishedAt desc)[$start...$end] {
    _id, title, "slug": slug.current, excerpt, publishedAt,
    coverImage ${IMAGE}
  }
`) as any;

export const postsCountQuery = defineQuery(`count(*[_type == "post"])`) as any;

export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, excerpt, publishedAt,
    coverImage ${IMAGE},
    body[] {
      ...,
      _type == "image" => ${IMAGE}
    }
  }
`) as any;

export const postSlugsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)][].slug.current
`) as any;

export const brandBySlugQuery = defineQuery(`
  *[_type == "brand" && slug.current == $slug][0] {
    _id, name, "slug": slug.current,
    logo ${IMAGE},
    logoLight ${IMAGE},
    heroImage ${IMAGE},
    tagline,
    slides[] {
      tagline,
      image ${IMAGE}
    },
    introTitle, introText,
    featureTitle, featureText, featureNote,
    featureImage ${IMAGE},
    featureCta,
    highlights,
    gallery[] ${IMAGE},
    benefitsTitle, benefits,
    showLocationMap, locationsIntro, locations,
    website, websiteUrl, phone, email
  }
`) as any;

export const brandSlugsQuery = defineQuery(`
  *[_type == "brand" && defined(slug.current)][].slug.current
`) as any;

export const aboutPageByLanguageQuery = defineQuery(`
  *[_type == "aboutPage" && language == $language][0] {
    _id, language, menuLabel, title,
    heroImage ${IMAGE},
    introTitle, introText,
    accordion[] { title, body },
    servicesTitle,
    services[] { title, icon ${IMAGE} },
    ctaTitle,
    ctaImage ${IMAGE},
    ctaButton
  }
`) as any;

export const contactPageQuery = defineQuery(`
  *[_type == "contactPage"][0] {
    title, subtitle,
    heroImage ${IMAGE},
    formTitle, infoTitle,
    whatsappTitle, whatsappButtonLabel,
    successMessage
  }
`) as any;