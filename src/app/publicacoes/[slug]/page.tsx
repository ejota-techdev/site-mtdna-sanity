import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PortableTextBody } from "@/components/PortableTextBody";
import { SanityImage } from "@/components/SanityImage";
import { client } from "@/sanity/lib/client";
import { postBySlugQuery, postSlugsQuery } from "@/sanity/lib/queries";
import type { Post } from "@/sanity/lib/types";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(postSlugsQuery);
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch<Post | null>(postBySlugQuery, { slug });

  if (!post) return { title: "Publicação não encontrada" };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await client.fetch<Post | null>(postBySlugQuery, { slug });

  if (!post) notFound();

  return (
    <>
      <Header />

      <main>
        {/* Topo dividido: imagem a esquerda, titulo sobre fundo petroleo a direita */}
        <section className="container-mtdna pt-8">
          <div className="corner-br-flat grid overflow-hidden md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[420px]">
              <SanityImage
                image={post.coverImage}
                alt={post.title}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="bg-brand-teal flex flex-col justify-center gap-5 p-8 text-white md:p-12">
              <h1 className="text-3xl leading-tight font-bold md:text-4xl">
                {post.title}
              </h1>
              <p className="text-sm leading-relaxed text-white/80">
                {post.excerpt}
              </p>
            </div>
          </div>
        </section>

        <article className="mx-auto max-w-3xl px-6 py-16">
          {post.body ? (
            <PortableTextBody value={post.body} />
          ) : (
            <p className="text-neutral-600">
              Esta publicação ainda não tem conteúdo.
            </p>
          )}
        </article>
      </main>

      <Footer />
    </>
  );
}
