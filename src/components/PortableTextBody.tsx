import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Link from "next/link";

import { SanityImage } from "@/components/SanityImage";
import type { SanityImage as SanityImageType } from "@/sanity/lib/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 leading-relaxed text-neutral-700">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="text-brand-navy mt-12 mb-4 text-2xl font-bold">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-brand-navy mt-8 mb-3 text-xl font-bold">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-brand-coral my-8 border-l-4 pl-6 text-lg text-neutral-600 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-disc pl-6 text-neutral-700">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-decimal pl-6 text-neutral-700">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-2">{children}</li>,
    number: ({ children }) => <li className="mb-2">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = (value?.href as string) ?? "#";
      const isInternal = href.startsWith("/");

      if (isInternal) {
        return (
          <Link href={href} className="text-brand-teal underline">
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-brand-teal underline"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => (
      <figure className="corner-br-flat relative my-10 aspect-[16/9] overflow-hidden">
        <SanityImage
          image={value as SanityImageType}
          sizes="(min-width: 1024px) 800px, 100vw"
          className="object-cover"
        />
      </figure>
    ),
  },
};

export function PortableTextBody({ value }: { value: unknown[] }) {
  // O cast e necessario porque os tipos de conteudo sao escritos a mao,
  // sem `sanity typegen`.
  return (
    <PortableText
      value={value as never}
      components={components}
    />
  );
}
