import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O emblema do Next no canto da tela existe so em desenvolvimento — nunca
  // aparece em producao. Desligado aqui por atrapalhar a conferencia visual
  // contra o Figma.
  devIndicators: false,

  images: {
    // O CDN do Sanity ja redimensiona e converte formato por parametro de URL.
    // Usar o otimizador do Next aqui so acrescentaria um hop pelo servidor —
    // que falhava com 500 sempre que a rede oscilava. Ver src/sanity/lib/imageLoader.ts
    loader: "custom",
    loaderFile: "./src/sanity/lib/imageLoader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
