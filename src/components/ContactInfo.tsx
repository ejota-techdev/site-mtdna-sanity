import Image from "next/image";

import type { SiteSettings } from "@/sanity/lib/types";

type Item = {
  icon: string;
  label: string;
  value?: string;
  href?: string;
};

/**
 * Coluna "Informacoes de contato": telefone, e-mail e redes, cada um com
 * seu icone em quadrado coral.
 */
export function ContactInfo({
  settings,
  title = "Informações de contato",
}: {
  settings: SiteSettings | null;
  title?: string;
}) {
  const items: Item[] = [
    {
      icon: "/icons/phone.svg",
      label: "Telefone",
      value: settings?.phone,
      href: settings?.phone ? `tel:${settings.phone.replace(/\s/g, "")}` : undefined,
    },
    {
      icon: "/icons/mail.svg",
      label: "E-mail",
      value: settings?.email,
      href: settings?.email ? `mailto:${settings.email}` : undefined,
    },
    {
      icon: "/icons/instagram.svg",
      label: "Instagram",
      value: settings?.instagram,
      href: settings?.instagramUrl,
    },
    {
      icon: "/icons/linkedin.svg",
      label: "LinkedIn",
      value: settings?.linkedin,
      href: settings?.linkedinUrl,
    },
  ].filter((item) => item.value);

  if (!items.length) return null;

  return (
    <div>
      <h3 className="text-brand-navy mb-6 text-lg font-bold">{title}</h3>

      <ul className="flex flex-col gap-5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-4">
            <Image
              src={item.icon}
              alt=""
              width={44}
              height={44}
              className="shrink-0"
              unoptimized
            />
            <div className="text-sm">
              <p className="text-brand-navy font-bold">{item.label}</p>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noreferrer noopener"
                      : undefined
                  }
                  className="text-brand-navy inline-flex min-h-11 items-center underline underline-offset-2"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-brand-navy">{item.value}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
