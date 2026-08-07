type OuterCorner = "tl" | "tr" | "bl" | "br";

/**
 * Grafismo de quatro quadrantes com cantos arredondados que se encontram
 * no centro. Aparece em amarelo no bloco "sobre" da Home e em branco na
 * secao de beneficios das paginas de marca.
 *
 * Vetor extraido do arquivo do Figma ("Group 29").
 */
export function DecorGrid({
  className,
  stroke = "currentColor",
  strokeWidth = 2,
  rounded = ["tl", "tr", "bl", "br"],
  outerRadius = 59,
}: {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
  /** Cantos EXTERNOS a arredondar. Os internos (centro) sao sempre curvos. */
  rounded?: OuterCorner[];
  outerRadius?: number;
}) {
  const L = 1;
  const T = 1;
  const R = 473;
  const B = 424;
  const cxL = 237;
  const cxR = 239;
  const cyT = 211;
  const cyB = 213;
  const ri = 59;
  const ro = outerRadius;

  const has = (c: OuterCorner) => rounded.includes(c);

  const tl = has("tl")
    ? `H ${L} V ${T + ro} A ${ro} ${ro} 0 0 1 ${L + ro} ${T} Z`
    : `H ${L} V ${T} Z`;

  const tr = has("tr")
    ? `H ${R} V ${T + ro} A ${ro} ${ro} 0 0 0 ${R - ro} ${T} Z`
    : `H ${R} V ${T} Z`;

  const bl = has("bl")
    ? `H ${L} V ${B - ro} A ${ro} ${ro} 0 0 0 ${L + ro} ${B} Z`
    : `H ${L} V ${B} Z`;

  const br = has("br")
    ? `H ${R} V ${B - ro} A ${ro} ${ro} 0 0 1 ${R - ro} ${B} Z`
    : `H ${R} V ${B} Z`;

  const paths = [
    `M ${cxL} ${T} V ${cyT - ri} A ${ri} ${ri} 0 0 1 ${cxL - ri} ${cyT} ${tl}`,
    `M ${cxR} ${T} V ${cyT - ri} A ${ri} ${ri} 0 0 0 ${cxR + ri} ${cyT} ${tr}`,
    `M ${cxL} ${B} V ${cyB + ri} A ${ri} ${ri} 0 0 0 ${cxL - ri} ${cyB} ${bl}`,
    `M ${cxR} ${B} V ${cyB + ri} A ${ri} ${ri} 0 0 1 ${cxR + ri} ${cyB} ${br}`,
  ];

  return (
    <svg
      viewBox="0 0 474 425"
      fill="none"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} stroke={stroke} strokeWidth={strokeWidth} />
      ))}
    </svg>
  );
}

/**
 * Seta dos botoes de acao das paginas de marca.
 *
 * Antes era o caractere "→" do texto, que herda o peso da fonte e sai fino
 * demais e com pontas retas. O wireframe usa um vetor de traco mais grosso
 * com quinas e pontas arredondadas — dai `strokeLinecap`/`strokeLinejoin`
 * em "round" e `strokeWidth` 2.5.
 */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 12h15m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Estrela de quatro pontas usada nos botoes e nos blocos expansiveis. */
export function Star({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 35 35"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.5 0C17.5 9.66 19.34 17.5 35 17.5C19.34 17.5 17.5 25.34 17.5 35C17.5 25.34 15.66 17.5 0 17.5C15.66 17.5 17.5 9.66 17.5 0Z" />
    </svg>
  );
}