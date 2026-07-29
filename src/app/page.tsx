import Image from "next/image";

import { ContactForm } from "@/components/ContactForm";
import { ContactInfo } from "@/components/ContactInfo";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { AboutBand } from "@/components/home/AboutBand";
import { BrandsSection } from "@/components/home/BrandsSection";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { HighlightSection } from "@/components/home/HighlightSection";
import { Newsletter } from "@/components/home/Newsletter";
import { client } from "@/sanity/lib/client";
import {
  featuredPostQuery,
  homeBrandsQuery,
  homePageQuery,
  recentPostsQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries";
import type {
  HomeBrand,
  HomePage,
  PostCard as PostCardType,
  SiteSettings,
} from "@/sanity/lib/types";

export const revalidate = 60;

export default async function Home() {
  const [home, brands, featured, settings] = await Promise.all([
    client.fetch<HomePage | null>(homePageQuery),
    client.fetch<HomeBrand[]>(homeBrandsQuery),
    client.fetch<PostCardType | null>(featuredPostQuery),
    client.fetch<SiteSettings | null>(siteSettingsQuery),
  ]);

  const recent = await client.fetch<PostCardType[]>(recentPostsQuery, {
    featuredId: featured?._id ?? "none",
    limit: home?.postsLimit ?? 4,
  });

  return (
    <>
      <Header />

      <main>
        <HeroCarousel slides={home?.heroSlides ?? []} />

        <AboutBand text={home?.aboutText} cta={home?.aboutCta} />

        {/*
          A ordem segue o wireframe: faixa de logos, cards de destaque e so
          entao o titulo "Marcas" com a grade.
        */}
        <BrandsSection
          title={home?.brandsTitle}
          brands={brands ?? []}
          destaques={
            <HighlightSection
              image={home?.highlightImage}
              cards={home?.highlightCards}
            />
          }
        />

        {/* ---------- Publicações ---------- */}
        {(featured || recent.length > 0) && (
          <section className="container-mtdna py-16">
            <h2 className="text-brand-teal mb-10 text-3xl font-bold">
              {home?.postsTitle ?? "Publicações"}
            </h2>

            {featured && (
              <div className="mb-14">
                <PostCard post={featured} featured />
              </div>
            )}

            {recent.length > 0 && (
              <div className="grid gap-10 md:grid-cols-3">
                {recent.slice(0, 3).map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </section>
        )}

        <Newsletter
          title={home?.newsletterTitle}
          placeholder={home?.newsletterPlaceholder}
          buttonLabel={home?.newsletterButtonLabel}
        />

        {/* ---------- Contato ---------- */}
        <section className="container-mtdna py-16">
          <h2 className="text-brand-teal mb-10 text-3xl font-bold">
            {home?.contactTitle ?? "Contato"}
          </h2>

          <div className="grid gap-10 md:grid-cols-2">
            <div className="bg-brand-teal corner-br-flat p-8">
              <h3 className="mb-6 text-xl font-bold text-white">
                {home?.contactFormTitle ?? "Decole seu negócio com a gente!"}
              </h3>
              <ContactForm variant="dark" />
            </div>

            <div className="flex flex-col gap-10">
              {settings?.whatsappUrl && (
                <div className="bg-brand-teal corner-br-flat p-8">
                  <p className="mb-5 flex items-center gap-3 text-lg font-bold text-white">
                    <Image
                      src="/icons/whatsapp.svg"
                      alt=""
                      width={26}
                      height={26}
                      unoptimized
                    />
                    Nosso WhatsApp
                  </p>
                  <a
                    href={settings.whatsappUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="bg-brand-cream text-brand-navy block rounded-lg py-3 text-center text-sm transition-opacity hover:opacity-90"
                  >
                    Entre em contato
                  </a>
                </div>
              )}

              <ContactInfo settings={settings} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
