/**
 * Lista as mensagens recebidas pelo formulario de contato.
 *
 *   node scripts/mensagens.mjs            lista
 *   node scripts/mensagens.mjs --limpar-testes   apaga as de teste
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const env = Object.fromEntries(
  readFileSync(join(ROOT, ".env.local"), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const at = line.indexOf("=");
      return [line.slice(0, at), line.slice(at + 1)];
    }),
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const docs = await client.fetch(
  `*[_type == "contactSubmission"] | order(submittedAt desc){_id, name, email, agency, submittedAt}`,
);

console.log(`Mensagens: ${docs.length}`);
for (const doc of docs) {
  console.log(`  ${doc.submittedAt} | ${doc.name} <${doc.email}> | ${doc._id}`);
}

if (process.argv.includes("--limpar-testes")) {
  const tests = docs.filter((doc) => doc.name === "TESTE AUTOMATIZADO");
  for (const doc of tests) {
    await client.delete(doc._id);
    console.log(`Apagado: ${doc._id}`);
  }
  console.log(`${tests.length} registro(s) de teste removido(s).`);
}
