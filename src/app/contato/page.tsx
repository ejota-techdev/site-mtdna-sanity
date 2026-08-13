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
          
          {/*
            Flex centralizado, e nao grade de 2 colunas.

            `container-mtdna` tem max-width de 90rem (1728px) e a coluna da
            direita e bem mais estreita que a da esquerda (formulario 614px,
            informacoes 296px). Com `grid-cols-2` as duas faixas ficavam do
            mesmo tamanho, entao a da direita sobrava vazia e o conjunto todo
            puxava para a esquerda — era o que o cliente estava vendo.

            Com flex cada bloco fica do tamanho do proprio conteudo e
            `justify-center` centraliza o PAR, deixando a mesma folga dos dois
            lados.

            `flex-wrap` em vez de `flex-col md:flex-row` de proposito: neste
            projeto o `md:flex-row` nao vence o `flex-col` no CSS gerado (o
            `flex-direction` continuava `column` mesmo com o breakpoint
            valendo). Com `flex-wrap` nao existe classe concorrente: a direcao
            e sempre linha, e no mobile o formulario (`w-full`) ocupa a linha
            inteira e empurra as informacoes para a linha de baixo sozinho.
          */}
          <div className="flex flex-wrap items-start justify-center gap-14 md:gap-20">

            {/* COLUNA DA ESQUERDA: Título + Formulário */}
            <div className="w-full max-w-lg">
              {/* O título foi movido para cá, dentro da coluna! */}
              <h2 className="text-brand-teal mb-12 text-3xl font-bold">
                {page?.formTitle ?? "Decole seu negócio com a gente!"}
              </h2>
              
              <ContactForm
                variant="light"
                successMessage={page?.successMessage}
              />
            </div>

            {/* COLUNA DA DIREITA: Informações de contato */}
            <div className="flex w-fit shrink-0 flex-col gap-10">
              {/* Agora esse componente vai subir e alinhar com o h2 da esquerda */}
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