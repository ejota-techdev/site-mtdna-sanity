import type { Metadata } from "next";

import { AboutPageView } from "@/components/about/AboutPageView";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sobre Nós",
  description:
    "Consultoria de marketing B2B especializada no setor de turismo, conectando marcas, operadores e agências.",
};

export default function SobrePage() {
  return <AboutPageView language="pt" />;
}
