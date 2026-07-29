import type { Metadata } from "next";

import { AboutPageView } from "@/components/about/AboutPageView";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "B2B marketing consultancy specialized in the tourism sector, connecting brands, operators and agencies.",
};

export default function AboutPage() {
  return <AboutPageView language="en" />;
}
