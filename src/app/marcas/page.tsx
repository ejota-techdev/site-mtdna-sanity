import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SanityImage } from "@/components/SanityImage";
import { client } from "@/sanity/lib/client";
import { homeBrandsQuery } from "@/sanity/lib/queries";
import type { HomeBrand } from "@/sanity/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Marcas",
  description:
    "As marcas internacionais representadas pela My Travel DNA no mercado brasileiro.",
};

export default async function MarcasPage() {
  const brands = await client.fetch<HomeBrand[]>(homeBrandsQuery);

  return (
    <>
      <Header />

      <main>
        <section className="bg-brand-teal py-16 text-white">
          <div className="container-mtdna">
            <h1 className="text-4xl font-bold md:text-5xl">Marcas</h1>
            <p className="mt-3 max-w-2xl text-white/80">
              Marcas internacionais representadas pela My Travel DNA no mercado
              brasileiro.
            </p>
          </div>
        </section>

        <section className="container-mtdna grid gap-8 py-16 md:grid-cols-3">
          {brands?.map((brand) => (
            <Link
              key={brand._id}
              href={`/marcas/${brand.slug}`}
              className="group flex flex-col gap-5"
            >
              <div className="corner-br-flat relative aspect-[4/3] overflow-hidden">
                <SanityImage
                  image={brand.homeCardImage}
                  alt={brand.name}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="relative h-8 w-36">
                <SanityImage
                  image={brand.logo}
                  alt={brand.name}
                  sizes="144px"
                  className="object-contain object-left"
                />
              </div>

              <p className="text-sm leading-relaxed text-neutral-600">
                {brand.homeCardText}
              </p>
            </Link>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
