/**
 * Preenche o carrossel de propriedades da Unlock.
 *
 *   node scripts/galeria-unlock.mjs
 *
 * Usa `patch().set()`, que altera SOMENTE os campos `gallery` e
 * `galleryTitle`. Todo o resto do documento — textos, imagens, links que
 * voce tenha editado no painel — fica intacto.
 *
 * As imagens e a ordem vieram da coluna posicionada ao lado da pagina da
 * Unlock no arquivo do Figma.
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

/** Ordem exata da coluna de imagens no Figma. */
const IMAGENS = [
  ["Group 24.png", "Fachada histórica portuguesa ao entardecer"],
  ["image 36.png", "Hotel contemporâneo com piscina e jardim"],
  ["Group 25.png", "Edifício de madeira com vista para vinhedos"],
  ["Group 26.png", "Propriedade ao pé de castelo medieval"],
  ["Group 27.png", "Arquitetura moderna entre a vegetação"],
  ["Group 28.png", "Casario português iluminado ao anoitecer"],
  ["image 35.png", "Piscina cercada por guarda-sóis ao entardecer"],
  ["image 37.png", "Vista da janela sobre o rio Douro"],
];

const ID_MARCA = "brand-unlock";

async function main() {
  const marca = await client.getDocument(ID_MARCA);
  if (!marca) throw new Error(`Documento ${ID_MARCA} nao encontrado.`);

  if (Array.isArray(marca.gallery) && marca.gallery.length > 0) {
    console.log(
      `A galeria ja tem ${marca.gallery.length} imagem(ns). Nada foi alterado.`,
    );
    console.log("Para substituir, apague as imagens no painel e rode de novo.");
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
      _key: `galeria${gallery.length + 1}`,
      alt,
      asset: { _type: "reference", _ref: asset._id },
    });
  }

  await client
    .patch(ID_MARCA)
    .set({ gallery, galleryTitle: "Conheça as propriedades" })
    .commit();

  console.log(
    `\nPronto: ${gallery.length} imagens no carrossel. Nenhum outro campo foi tocado.`,
  );
}

main().catch((erro) => {
  console.error("\nFalhou:", erro.message);
  process.exit(1);
});
