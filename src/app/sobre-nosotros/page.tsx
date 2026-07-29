import type { Metadata } from "next";

import { AboutPageView } from "@/components/about/AboutPageView";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description:
    "Consultoría de marketing B2B especializada en el sector turístico, conectando marcas, operadores y agencias.",
};

export default function SobreNosotrosPage() {
  return <AboutPageView language="es" />;
}
