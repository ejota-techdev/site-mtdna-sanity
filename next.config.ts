import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Pasta de saida. Por padrao `.next`, que e a mesma que o `npm run dev`
   * usa — por isso rodar um build com o dev ligado derruba o servidor com
   * erro 500. Definindo BUILD_DIR, o build sai noutro lugar e nao atrapalha:
   *
   *   BUILD_DIR=.next-verificacao npm run build
   */
  distDir: process.env.BUILD_DIR || ".next",

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
