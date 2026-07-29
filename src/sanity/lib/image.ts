import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from "../env";
import type { SanityImage } from "./types";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * As queries usam `asset->`, entao o asset chega expandido ({_id, url, ...})
 * em vez de uma referencia. O builder lida com as duas formas, mas os tipos
 * publicados so descrevem a referencia — dai o cast.
 */
export function urlForImage(source: SanityImage) {
  return builder
    .image(source as unknown as SanityImageSource)
    .auto("format")
    .fit("max");
}
