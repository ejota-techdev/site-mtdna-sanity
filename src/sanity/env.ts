export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset = exigir(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = exigir(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);

/**
 * Falha cedo, com instrucao de como resolver.
 *
 * Sem estas variaveis nada funciona, entao quebrar o build e melhor do que
 * publicar um site que so falha quando alguem acessa. A mensagem diz onde
 * corrigir porque o erro aparece longe da causa — no log de build da Vercel,
 * dentro de uma rota qualquer que importou este arquivo.
 */
function exigir(valor: string | undefined, nome: string): string {
  if (valor) return valor;

  const naVercel = Boolean(process.env.VERCEL);

  throw new Error(
    [
      `Variavel de ambiente ausente: ${nome}`,
      "",
      naVercel
        ? [
            "Cadastre em: Project > Settings > Environment Variables,",
            "marcando Production e Preview. Depois dispare um novo deploy —",
            "variaveis nao se aplicam a um deploy ja existente. No Redeploy,",
            "DESMARQUE 'Use existing Build Cache': as variaveis NEXT_PUBLIC_",
            "sao embutidas durante a compilacao, e o cache traria de volta os",
            "valores antigos.",
          ].join("\n")
        : [
            "Copie o modelo e preencha:  cp .env.local.example .env.local",
            "Os valores estao em https://www.sanity.io/manage",
          ].join("\n"),
    ].join("\n"),
  );
}
