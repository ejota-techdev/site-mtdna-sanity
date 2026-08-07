"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Formulario de contato. Envia para /api/contato, que grava o documento
 * no Sanity usando o token de escrita (somente no servidor).
 */
export function ContactForm({
  successMessage = "Recebemos sua mensagem. Em breve entraremos em contato!",
  variant = "dark",
  fill = false,
}: {
  successMessage?: string;
  variant?: "dark" | "light";
  /**
   * Estica o formulario para ocupar toda a altura do container, deixando a
   * caixa de mensagem absorver a sobra.
   *
   * Serve para a Home, onde o bloco do formulario divide a linha do grid com
   * uma coluna mais alta: como item de grid ele estica junto, mas o conteudo
   * parava na metade e sobrava um vazio embaixo. Exige que o pai seja
   * `flex flex-col`.
   */
  fill?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const data = new FormData(event.currentTarget);
    const form = event.currentTarget;

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          agency: data.get("agency"),
          message: data.get("message"),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Não foi possível enviar.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setError("Não foi possível enviar. Verifique sua conexão.");
      setStatus("error");
    }
  }

  /*
   * `min-h-11` garante os 44px minimos de alvo tocavel.
   * `text-base` no mobile evita o zoom automatico do Safari no iOS, que
   * acontece sempre que a fonte do campo e menor que 16px.
   */
  const fieldClass =
    "bg-brand-cream text-brand-navy placeholder:text-neutral-500 min-h-11 w-full rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-coral sm:text-sm";

  if (status === "sent") {
    return (
      <p
        role="status"
        className={
          variant === "dark"
            ? "rounded-lg bg-white/10 px-4 py-6 text-white"
            : "bg-brand-cream text-brand-navy rounded-lg px-4 py-6"
        }
      >
        {successMessage}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-4 ${fill ? "flex-1" : ""}`}
    >
      <label className="sr-only" htmlFor="contact-name">
        Seu nome
      </label>
      <input
        id="contact-name"
        name="name"
        required
        maxLength={120}
        placeholder="Seu nome"
        className={fieldClass}
      />

      <label className="sr-only" htmlFor="contact-email">
        E-mail
      </label>
      <input
        id="contact-email"
        name="email"
        type="email"
        required
        maxLength={160}
        placeholder="E-mail"
        className={fieldClass}
      />

      <label className="sr-only" htmlFor="contact-agency">
        Agência de Viagens
      </label>
      <input
        id="contact-agency"
        name="agency"
        maxLength={160}
        placeholder="Agência de Viagens"
        className={fieldClass}
      />

      <label className="sr-only" htmlFor="contact-message">
        Como podemos te ajudar?
      </label>
      <textarea
        id="contact-message"
        name="message"
        required
        rows={5}
        maxLength={4000}
        placeholder="Como podemos te ajudar?"
        className={`${fieldClass} resize-y ${fill ? "min-h-36 flex-1" : ""}`}
      />

      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className={
          variant === "dark"
            ? "bg-brand-yellow text-brand-navy mx-auto min-h-11 w-40 rounded-lg px-4 py-2.5 text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
            : "bg-brand-coral mx-auto min-h-11 w-48 rounded-lg px-4 py-3 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        }
      >
        {status === "sending" ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}
