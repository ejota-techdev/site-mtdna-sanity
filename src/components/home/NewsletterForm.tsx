"use client";

import { useState } from "react";

type Status = "idle" | "enviando" | "assinado" | "erro";

/**
 * Formulario da newsletter.
 *
 * Fica separado da secao de proposito: assim so este pedaco vai como
 * componente de cliente, e a faixa em volta continua renderizada no
 * servidor.
 */
export function NewsletterForm({
  placeholder,
  buttonLabel,
}: {
  placeholder?: string;
  buttonLabel?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [erro, setErro] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Sem isto o navegador recarrega a pagina e o e-mail se perde.
    event.preventDefault();

    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");

    setStatus("enviando");
    setErro("");

    try {
      const resposta = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        setErro(resultado.error ?? "Não foi possível assinar.");
        setStatus("erro");
        return;
      }

      form.reset();
      setStatus("assinado");
    } catch {
      setErro("Não foi possível assinar. Verifique sua conexão.");
      setStatus("erro");
    }
  }

  if (status === "assinado") {
    return (
      <p role="status" className="max-w-md text-lg text-white">
        Pronto! Você vai receber nossas novidades por e-mail.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <label className="sr-only" htmlFor="newsletter-email">
        E-mail
      </label>
      {/* text-base no mobile evita o zoom automático do iOS ao focar. */}
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        maxLength={160}
        placeholder={placeholder}
        className="min-h-11 border-b border-white/60 bg-transparent pb-2 text-base text-white placeholder:text-white/70 focus:border-white focus:outline-none sm:text-sm"
      />

      {erro && (
        <p role="alert" className="-mt-6 text-sm text-white">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "enviando"}
        className="hover:text-brand-coral inline-flex min-h-11 w-fit items-center rounded-full border border-white px-8 py-2.5 text-xs font-medium tracking-[0.15em] text-white uppercase transition-colors hover:bg-white disabled:opacity-60"
      >
        {status === "enviando" ? "Enviando..." : buttonLabel}
      </button>
    </form>
  );
}
