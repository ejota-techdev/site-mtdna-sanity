/**
 * Tipos do conteudo vindo do Sanity.
 *
 * Escritos a mao de proposito: descrevem exatamente o que as queries em
 * `queries.ts` projetam, que e um subconjunto dos schemas. Se um dia o
 * projeto adotar `sanity typegen`, estes podem ser substituidos.
 */

export type SanityImage = {
  alt?: string;
  asset?: {
    _id: string;
    url: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width: number; height: number; aspectRatio: number };
    };
  };
  hotspot?: { x: number; y: number };
};

export type Cta = {
  label: string;
  href: string;
};

export type BrandNavItem = {
  _id: string;
  name: string;
  slug: string;
};

export type AboutLanguage = {
  _id: string;
  language: "pt" | "es" | "en";
  menuLabel: string;
};

export type SiteSettings = {
  logo?: SanityImage;
  logoFooter?: SanityImage;
  phone?: string;
  email?: string;
  instagram?: string;
  instagramUrl?: string;
  linkedin?: string;
  linkedinUrl?: string;
  whatsappUrl?: string;
  footerCredit?: string;
};

export type PostCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: SanityImage;
};

export type Post = PostCard & {
  body?: unknown[];
};

export type HomeBrand = {
  _id: string;
  name: string;
  slug: string;
  homeCardText?: string;
  homeCardImage?: SanityImage;
  logo?: SanityImage;
  logoLight?: SanityImage;
};

export type HeroSlide = {
  tagline?: string;
  image?: SanityImage;
  brand?: {
    name: string;
    slug: string;
    logo?: SanityImage;
    logoLight?: SanityImage;
  };
};

export type HighlightCard = {
  title: string;
  body?: string;
  image?: SanityImage;
};

export type HomePage = {
  heroSlides?: HeroSlide[];
  aboutText?: string[];
  aboutCta?: Cta;
  highlightImage?: SanityImage;
  highlightCards?: HighlightCard[];
  brandsTitle?: string;
  postsTitle?: string;
  postsLimit?: number;
  newsletterTitle?: string;
  newsletterPlaceholder?: string;
  newsletterButtonLabel?: string;
  contactTitle?: string;
  contactFormTitle?: string;
};

export type Brand = {
  _id: string;
  name: string;
  slug: string;
  logo?: SanityImage;
  logoLight?: SanityImage;
  heroImage?: SanityImage;
  tagline?: string;
  /*
   * Layout escolhido no Studio. Opcionais porque as marcas cadastradas antes
   * destes campos existirem vem sem valor — a pagina cai num padrao.
   */
  pageLayout?: "padrao" | "unlock";
  featureImageSide?: "esquerda" | "direita";
  featureCtaAlign?: "esquerda" | "centro";
  introTitle?: string;
  introText?: string;
  featureTitle?: string;
  featureText?: string;
  featureNote?: string;
  featureImage?: SanityImage;
  featureCta?: Cta;
  highlights?: string[];
  gallery?: SanityImage[];
  benefitsTitle?: string;
  benefits?: string[];
  showLocationMap?: boolean;
  locationsIntro?: string;
  locations?: string[];
  website?: string;
  websiteUrl?: string;
  phone?: string;
  email?: string;
};

export type AboutPage = {
  _id: string;
  language: "pt" | "es" | "en";
  menuLabel: string;
  title: string;
  heroImage?: SanityImage;
  introTitle?: string;
  introText?: string;
  accordion?: { title: string; body: string }[];
  servicesTitle?: string;
  services?: { title: string; icon?: SanityImage }[];
  ctaTitle?: string;
  ctaImage?: SanityImage;
  ctaButton?: Cta;
};

export type ContactPage = {
  title: string;
  subtitle?: string;
  heroImage?: SanityImage;
  formTitle?: string;
  infoTitle?: string;
  whatsappTitle?: string;
  whatsappButtonLabel?: string;
  successMessage?: string;
};
