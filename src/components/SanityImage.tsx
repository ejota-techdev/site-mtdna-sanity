import Image from "next/image";

import { urlForImage } from "@/sanity/lib/image";
import type { SanityImage as SanityImageType } from "@/sanity/lib/types";

type Props = {
  image?: SanityImageType;
  /** Alternativa quando a imagem nao tem `alt` preenchido no painel. */
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Usa `fill` — o elemento pai precisa ser `relative`. */
  fill?: boolean;
  width?: number;
  height?: number;
};

/**
 * Renderiza uma imagem do Sanity com blur de carregamento quando disponivel.
 * Retorna null se a imagem nao tiver asset, para nao quebrar a pagina quando
 * um campo opcional estiver vazio no painel.
 */
export function SanityImage({
  image,
  alt,
  className,
  sizes = "100vw",
  priority = false,
  fill = true,
  width,
  height,
}: Props) {
  if (!image?.asset?.url) return null;

  const lqip = image.asset.metadata?.lqip;
  const blur = lqip
    ? ({ placeholder: "blur" as const, blurDataURL: lqip })
    : {};

  const resolvedAlt = image.alt ?? alt ?? "";

  if (fill) {
    return (
      <Image
        src={urlForImage(image).url()}
        alt={resolvedAlt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        {...blur}
      />
    );
  }

  return (
    <Image
      src={urlForImage(image).url()}
      alt={resolvedAlt}
      width={width ?? image.asset.metadata?.dimensions?.width ?? 1200}
      height={height ?? image.asset.metadata?.dimensions?.height ?? 800}
      sizes={sizes}
      priority={priority}
      className={className}
      {...blur}
    />
  );
}
