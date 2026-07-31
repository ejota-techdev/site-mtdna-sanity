/**
 * Lista os assinantes da newsletter.
 *
 *   node scripts/assinantes.mjs            lista
 *   node scripts/assinantes.mjs --csv      imprime em CSV, para exportar
 *   node scripts/assinantes.mjs --limpar-testes   remove enderecos @exemplo.com
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const env = Object.fromEntries(
  readFileSync(join(ROOT, ".env.local"), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const at = l.indexOf("=");
      return [l.slice(0, at), l.slice(at + 1)];
    }),
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const assinantes = await client.fetch(
  `*[_type == "newsletterSubscriber"] | order(subscribedAt desc){_id, email, subscribedAt}`,
);

if (process.argv.includes("--csv")) {
  console.log("email,assinou_em");
  for (const a of assinantes) console.log(`${a.email},${a.subscribedAt}`);
} else {
  console.log(`Assinantes: ${assinantes.length}`);
  for (const a of assinantes) {
    console.log(`  ${a.subscribedAt} | ${a.email}`);
  }
}

if (process.argv.includes("--limpar-testes")) {
  const testes = assinantes.filter((a) => a.email.endsWith("@exemplo.com"));
  for (const a of testes) {
    await client.delete(a._id);
    console.log(`Apagado: ${a.email}`);
  }
  console.log(`${testes.length} registro(s) de teste removido(s).`);
}
