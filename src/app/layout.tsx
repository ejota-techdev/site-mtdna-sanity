import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

/**
 * Roboto auto-hospedada.
 *
 * Usamos `next/font/local` em vez de `next/font/google` porque o download
 * em tempo de build vinha falhando por timeout, o que quebraria um deploy
 * numa rede instavel. Os arquivos sao a fonte variavel oficial (v51),
 * subsets latin e latin-ext — cobrem portugues, espanhol e ingles.
 */
const roboto = localFont({
  src: [
    {
      path: "../../public/fonts/roboto-latin.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/roboto-latin-ext.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-roboto",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: {
    default: "My Travel DNA",
    template: "%s | My Travel DNA",
  },
  description:
    "Consultoria de marketing B2B especializada no setor de turismo, conectando marcas, operadores e agências.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={roboto.variable}>
      <body>{children}</body>
    </html>
  );
}
