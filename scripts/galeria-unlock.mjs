/**
 * Preenche o carrossel do topo da pagina da Unlock.
 *
 *   node scripts/galeria-unlock.mjs               grava se estiver vazio
 *   node scripts/galeria-unlock.mjs --substituir  troca o que ja existe
 *
 * Usa `patch().set()`, que altera SOMENTE o campo `gallery`. Todo o resto do
 * documento — textos, imagem principal, links que voce tenha editado no
 * painel — fica intacto.
 *
 * A imagem principal (heroImage) nao entra aqui: ela ja e o primeiro slide,
 * montada no proprio componente.
 */
import { createClient } from "@sanity/client";
import { createReadStream, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WIREFRAMES = join(ROOT, "wireframes");

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

/** Ordem em que aparecem no carrossel, depois da imagem principal. */
const IMAGENS = [
  ["carrossel_unlock.png", "Piscina de borda infinita com guarda-sóis"],
  ["carrossel_unlock_1.png", "Hotel contemporâneo com piscina e jardim"],
  ["carrossel_unlock_2.png", "Edifício de madeira com vista para vinhedos"],
  ["carrossel_unlock_3.png", "Propriedade ao pé de castelo medieval"],
  ["carrossel_unlock_4.png", "Arquitetura moderna entre a vegetação"],
  ["carrossel_unlock_5.png", "Casario português iluminado ao anoitecer"],
  ["carrossel_unlock_6.png", "Piscina cercada por guarda-sóis ao entardecer"],
  ["carrossel_unlock_7.png", "Vista da janela sobre o rio Douro"],
];

const ID_MARCA = "brand-unlock";
const SUBSTITUIR = process.argv.includes("--substituir");

async function main() {
  const marca = await client.getDocument(ID_MARCA);
  if (!marca) throw new Error(`Documento ${ID_MARCA} nao encontrado.`);

  if (Array.isArray(marca.gallery) && marca.gallery.length > 0 && !SUBSTITUIR) {
    console.log(
      `O carrossel ja tem ${marca.gallery.length} imagem(ns). Nada foi alterado.`,
    );
    console.log("Use --substituir para trocar.");
    return;
  }

  console.log("Enviando imagens...");
  const gallery = [];

  for (const [arquivo, alt] of IMAGENS) {
    const caminho = join(WIREFRAMES, arquivo);
    if (!existsSync(caminho)) {
      console.warn(`  ! nao encontrado, pulando: ${arquivo}`);
      continue;
    }

    const asset = await client.assets.upload("image", createReadStream(caminho), {
      filename: arquivo,
    });
    console.log(`  + ${arquivo}`);

    gallery.push({
      _type: "figureImage",
      _key: `topo${gallery.length + 1}`,
      alt,
      asset: { _type: "reference", _ref: asset._id },
    });
  }

  await client.patch(ID_MARCA).set({ gallery }).commit();

  console.log(
    `\nPronto: ${gallery.length} imagens + a principal = ${gallery.length + 1} slides.`,
  );
  console.log("Nenhum outro campo do documento foi tocado.");
}

main().catch((erro) => {
  console.error("\nFalhou:", erro.message);
  process.exit(1);
});
