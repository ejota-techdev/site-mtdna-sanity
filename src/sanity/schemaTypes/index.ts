import type { SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./documents/aboutPage";
import { brand } from "./documents/brand";
import { contactPage } from "./documents/contactPage";
import { contactSubmission } from "./documents/contactSubmission";
import { homePage } from "./documents/homePage";
import { newsletterSubscriber } from "./documents/newsletterSubscriber";
import { post } from "./documents/post";
import { siteSettings } from "./documents/siteSettings";
import { blockContent } from "./objects/blockContent";
import { cta } from "./objects/cta";
import { figureImage } from "./objects/figureImage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Blocos reutilizaveis
    blockContent,
    cta,
    figureImage,

    // Paginas unicas
    homePage,
    aboutPage,
    contactPage,
    siteSettings,

    // Colecoes
    brand,
    post,
    contactSubmission,
    newsletterSubscriber,
  ],
};
