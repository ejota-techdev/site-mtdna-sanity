/**
 * Endereco publico do site, sem barra no final. Usado no sitemap e no
 * robots.txt. Ao trocar para o dominio do cliente, defina NEXT_PUBLIC_SITE_URL
 * na Vercel (ex.: https://www.dominiodocliente.com.br).
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://mtdna-sanity.vercel.app"
).replace(/\/$/, "");
