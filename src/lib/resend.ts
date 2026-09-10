import { Resend } from "resend";

/**
 * Cliente do Resend, so no servidor. Lanca erro se a chave nao estiver
 * configurada — quem chama decide se isso e fatal ou so um aviso no log
 * (ver uso em /api/contato e /api/newsletter: notificacao e best-effort,
 * nunca derruba o cadastro que ja foi gravado no Sanity).
 */
export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Variavel de ambiente ausente: RESEND_API_KEY");
  }

  return new Resend(apiKey);
}

/** Para quem manda a copia de leads e assinantes. Vazio = notificacao desligada. */
export const notificationEmail = process.env.NOTIFICATION_EMAIL;

/**
 * Remetente. Em modo sandbox do Resend (sem dominio verificado), so
 * "onboarding@resend.dev" funciona. Depois que o dominio do cliente for
 * verificado no Resend, troque via a variavel EMAIL_FROM.
 */
export const emailFrom = process.env.EMAIL_FROM || "MTDNA <onboarding@resend.dev>";
