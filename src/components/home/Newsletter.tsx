import { NewsletterForm } from "./NewsletterForm";

/**
 * Faixa coral com o formulário de newsletter.
 * O símbolo do logo em creme ocupa 100% da altura à direita.
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
      {/* Container à direita com top-0 para garantir alinhamento vertical total */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 hidden h-full w-[43%] md:block"
      >
        {/*
          O logo-simbolo.png tem ~3% de margem vazia dentro do próprio arquivo.
          A caixa da máscara é esticada para -3% / 106% para que o bloco
          visível encoste de fato no topo e na base da seção.
        */}
        <div
          className="bg-brand-cream absolute -top-[3%] right-0 left-[10%] h-[106%]"
          style={{
            maskImage: "url(/logo-simbolo.png)",
            WebkitMaskImage: "url(/logo-simbolo.png)",
            maskSize: "auto 100%",
            WebkitMaskSize: "auto 100%",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "left center",
            WebkitMaskPosition: "left center",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-16 lg:px-36">
        <div className="flex max-w-md flex-col gap-10">
          <h2 className="max-w-sm text-3xl leading-tight font-bold text-white md:text-4xl">
            {title}
          </h2>

          <NewsletterForm
            placeholder={placeholder}
            buttonLabel={buttonLabel}
          />
        </div>
      </div>
    </section>
  );
}