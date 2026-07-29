import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  // Sem isso, uma falha de rede passageira derruba a pagina inteira com 500.
  // O cliente ja repete em erros de conexao e 5xx, com espera progressiva.
  maxRetries: 3,
  retryDelay: (attempt) => Math.min(200 * 2 ** attempt, 2000),
});

/**
 * Cliente com permissao de escrita. Somente no servidor — o token nunca
 * pode chegar ao browser. Usado pela rota que grava os envios do
 * formulario de contato.
 */
export function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!token) {
    throw new Error("Variavel de ambiente ausente: SANITY_API_WRITE_TOKEN");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
    maxRetries: 3,
    retryDelay: (attempt) => Math.min(200 * 2 ** attempt, 2000),
  });
}
