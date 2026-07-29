import type { Metadata } from "next";
import Image from "next/image";

import { ContactForm } from "@/components/ContactForm";
import { ContactInfo } from "@/components/ContactInfo";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SanityImage } from "@/components/SanityImage";
import { client } from "@/sanity/lib/client";
import { contactPageQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import type { ContactPage, SiteSettings } from "@/sanity/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a My Travel DNA.",
};

export default async function ContatoPage() {
  const [page, settings] = await Promise.all([
    client.fetch<ContactPage | null>(contactPageQuery),
    client.fetch<SiteSettings | null>(siteSettingsQuery),
  ]);

  return (
    <>
      <Header />

      <main>
        {/* ---------- Topo ---------- */}
        <section className="relative h-[300px] w-full md:h-[360px]">
          <SanityImage
            image={page?.heroImage}
            alt=""
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute right-0 bottom-10 left-0 container-mtdna">
            <h1 className="text-4xl font-bold text-white drop-shadow-sm md:text-5xl">
              {page?.title ?? "Contato"}
            </h1>
            {page?.subtitle && (
              <p className="mt-2 text-white/90">{page.subtitle}</p>
            )}
          </div>
        </section>

        {/* ---------- Formulário + informações ---------- */}
        <section className="container-mtdna py-16">
          <h2 className="text-brand-teal mb-12 text-3xl font-bold">
            {page?.formTitle ?? "Decole seu negócio com a gente!"}
          </h2>

          <div className="grid gap-14 md:grid-cols-2">
            <div className="mx-auto w-full max-w-lg">
              <ContactForm
                variant="light"
                successMessage={page?.successMessage}
              />
            </div>

            <div className="flex flex-col gap-10">
              <ContactInfo settings={settings} title={page?.infoTitle} />

              {settings?.whatsappUrl && (
                <div>
                  <p className="text-brand-navy mb-4 flex items-center gap-3 text-lg font-bold">
                    <Image
                      src="/icons/whatsapp.svg"
                      alt=""
                      width={26}
                      height={26}
                      unoptimized
                    />
                    {page?.whatsappTitle ?? "Nosso WhatsApp"}
                  </p>
                  <a
                    href={settings.whatsappUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="bg-brand-cream text-brand-navy block max-w-xs rounded-lg py-3 text-center text-sm transition-opacity hover:opacity-90"
                  >
                    {page?.whatsappButtonLabel ?? "Entre em contato"}
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
