import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { emailFrom, getResendClient, notificationEmail } from "@/lib/resend";
import { getWriteClient } from "@/sanity/lib/client";

const MAX_EMAIL = 160;

/**
 * Deriva um _id estavel a partir do e-mail.
 *
 * Assim, assinar duas vezes atualiza o mesmo documento em vez de criar
 * duplicata — e o e-mail em si nao vira parte do id.
 */
function idDoAssinante(email: string) {
  const hash = createHash("sha256")
    .update(email.toLowerCase())
    .digest("hex")
    .slice(0, 32);
  return `assinante-${hash}`;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const email = String(payload.email ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    return NextResponse.json(
      { error: "Informe um e-mail." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > MAX_EMAIL) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  try {
    await getWriteClient().createOrReplace({
      _id: idDoAssinante(email),
      _type: "newsletterSubscriber",
      email,
      subscribedAt: new Date().toISOString(),
    });
  } catch (error) {
    // O detalhe fica no log do servidor; o visitante recebe algo generico.
    console.error("Falha ao gravar assinante da newsletter:", error);
    return NextResponse.json(
      { error: "Não foi possível assinar agora. Tente novamente em instantes." },
      { status: 500 },
    );
  }

  // Copia por e-mail e so um aviso a mais - o assinante ja esta salvo no
  // Sanity, entao uma falha aqui nao deve impedir a resposta de sucesso.
  if (notificationEmail) {
    try {
      await getResendClient().emails.send({
        from: emailFrom,
        to: notificationEmail,
        subject: "Novo assinante da newsletter",
        text: `Novo assinante: ${email}`,
      });
    } catch (error) {
      console.error("Falha ao enviar e-mail de notificacao (newsletter):", error);
    }
  }

  return NextResponse.json({ ok: true });
}
