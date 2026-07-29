import { Star } from "@/components/DecorGrid";

/**
 * Faixa coral com o formulario de newsletter.
 * O grafismo a direita e o simbolo do logo em marca d'agua.
 */
export function Newsletter({
  title,
  placeholder,
  buttonLabel,
}: {
  title?: string;
  placeholder?: string;
  buttonLabel?: string;
}) {
  return (
    <section className="bg-brand-coral relative overflow-hidden">
      {/* Marca d'agua: o simbolo do logo em versao clara */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 bottom-0 hidden h-full w-1/3 items-center justify-center md:flex"
      >
        <div className="relative h-3/4 w-full">
          <div className="absolute inset-0 rounded-tl-[6rem] rounded-tr-[2rem] rounded-br-[2rem] bg-white/15" />
          <Star className="absolute top-1/2 left-1/4 h-24 w-24 -translate-y-1/2 text-white/40" />
        </div>
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 md:max-w-2xl md:pr-0">
        <h2 className="text-3xl leading-tight font-bold text-white md:text-4xl">
          {title}
        </h2>

        <form className="flex max-w-md flex-col gap-8">
          <label className="sr-only" htmlFor="newsletter-email">
            E-mail
          </label>
          {/* text-base no mobile evita o zoom automatico do iOS ao focar. */}
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder={placeholder}
            className="min-h-11 border-b border-white/60 bg-transparent pb-2 text-base text-white placeholder:text-white/70 focus:border-white focus:outline-none sm:text-sm"
          />

          <button
            type="submit"
            className="hover:text-brand-coral inline-flex min-h-11 w-fit items-center rounded-full border border-white px-8 py-2.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-white"
          >
            {buttonLabel}
          </button>
        </form>
      </div>
    </section>
  );
}
