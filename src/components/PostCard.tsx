import Link from "next/link";

import { SanityImage } from "@/components/SanityImage";
import type { PostCard as PostCardType } from "@/sanity/lib/types";

type Props = {
  post: PostCardType;
  /** O card em destaque ocupa a largura toda, com imagem ao lado do texto. */
  featured?: boolean;
};

export function PostCard({ post, featured = false }: Props) {
  if (featured) {
    return (
      <article className="grid items-center gap-8 md:grid-cols-2">
        <Link
          href={`/publicacoes/${post.slug}`}
          className="corner-br-flat relative block aspect-[4/3] overflow-hidden"
        >
          <SanityImage
            image={post.coverImage}
            alt={post.title}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>

        <div className="flex flex-col gap-4">
          <h3 className="text-brand-teal text-2xl leading-tight font-bold">
            <Link
              href={`/publicacoes/${post.slug}`}
              className="transition-opacity hover:opacity-80"
            >
              {post.title}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600">
            {post.excerpt}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-4">
      <Link
        href={`/publicacoes/${post.slug}`}
        className="corner-br-flat relative block aspect-[4/3] overflow-hidden"
      >
        <SanityImage
          image={post.coverImage}
          alt={post.title}
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      <h3 className="text-brand-teal text-lg leading-tight font-bold">
        <Link
          href={`/publicacoes/${post.slug}`}
          className="transition-opacity hover:opacity-80"
        >
          {post.title}
        </Link>
      </h3>
      <p className="text-sm leading-relaxed text-neutral-600">{post.excerpt}</p>
    </article>
  );
}
