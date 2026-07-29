import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { client } from "@/sanity/lib/client";
import { postsCountQuery, postsPageQuery } from "@/sanity/lib/queries";
import type { PostCard as PostCardType } from "@/sanity/lib/types";

const PER_PAGE = 9;

export const metadata: Metadata = {
  title: "Publicações",
  description:
    "Análises e tendências do setor de turismo pela My Travel DNA.",
};

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function PublicacoesPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const start = (currentPage - 1) * PER_PAGE;

  const [posts, total] = await Promise.all([
    client.fetch<PostCardType[]>(postsPageQuery, {
      start,
      end: start + PER_PAGE,
    }),
    client.fetch<number>(postsCountQuery),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <>
      <Header />

      <main>
        <section className="bg-brand-teal py-16 text-white">
          <div className="container-mtdna">
            <h1 className="text-4xl font-bold md:text-5xl">Publicações</h1>
            <p className="mt-3 max-w-2xl text-white/80">
              Análises e tendências do setor de turismo.
            </p>
          </div>
        </section>

        <section className="container-mtdna py-16">
          {posts.length === 0 ? (
            <p className="text-neutral-600">
              Nenhuma publicação por aqui ainda.
            </p>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav
              aria-label="Paginação"
              className="mt-16 flex items-center justify-center gap-2"
            >
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={
                      pageNumber === 1
                        ? "/publicacoes"
                        : `/publicacoes?page=${pageNumber}`
                    }
                    aria-current={
                      pageNumber === currentPage ? "page" : undefined
                    }
                    className={
                      pageNumber === currentPage
                        ? "bg-brand-coral rounded-full px-4 py-2 text-sm font-medium text-white"
                        : "text-brand-teal hover:bg-brand-cream rounded-full px-4 py-2 text-sm transition-colors"
                    }
                  >
                    {pageNumber}
                  </Link>
                ),
              )}
            </nav>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
