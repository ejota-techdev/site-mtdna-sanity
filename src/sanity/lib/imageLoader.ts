"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Loader de imagens do Sanity.
 *
 * Sem ele, o `next/image` baixa cada imagem do cdn.sanity.io pelo servidor
 * para redimensionar — um hop a mais que falha quando a rede oscila e
 * derruba a imagem com 500.
 *
 * O CDN do Sanity ja redimensiona e converte formato por parametro de URL,
 * entao aqui apenas montamos a URL certa e deixamos o browser buscar direto.
 * Continuamos com srcset e lazy loading do next/image.
 */
export default function sanityImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  // Arquivos de /public (icones, logos) sao servidos como estao — o loader
  // vale para todas as imagens do projeto, nao so as do Sanity.
  if (!src.startsWith("http")) return src;

  const url = new URL(src);

  // A URL do asset carrega as dimensoes originais no nome
  // (ex.: ...-374x120.png). Sem isso, o srcset do next/image chega a pedir
  // 3840px para um logo de 374px — o CDN amplia e o visitante baixa
  // bytes a mais sem ganho nenhum de nitidez.
  const natural = url.pathname.match(/-(\d+)x(\d+)\.\w+$/);
  const larguraOriginal = natural ? Number(natural[1]) : null;
  const larguraFinal = larguraOriginal
    ? Math.min(width, larguraOriginal)
    : width;

  url.searchParams.set("w", String(larguraFinal));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
