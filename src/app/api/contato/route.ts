import { NextResponse } from "next/server";

import { getWriteClient } from "@/sanity/lib/client";

/** Limites generosos, so para barrar envio abusivo. */
const LIMITS = { name: 120, email: 160, agency: 160, message: 4000 };

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const agency = String(payload.agency ?? "").trim();
  const message = String(payload.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Preencha nome, e-mail e mensagem." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    agency.length > LIMITS.agency ||
    message.length > LIMITS.message
  ) {
    return NextResponse.json(
      { error: "Conteúdo excede o tamanho permitido." },
      { status: 400 },
    );
  }

  try {
    await getWriteClient().create({
      _type: "contactSubmission",
      name,
      email,
      agency,
      message,
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    // O detalhe fica no log do servidor; o visitante recebe algo generico.
    console.error("Falha ao gravar mensagem de contato:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar agora. Tente novamente em instantes." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
