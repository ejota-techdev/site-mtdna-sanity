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
}: {
  className?: string;
  stroke?: string;
}) {
  return (
    <svg
      viewBox="0 0 474 425"
      fill="none"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M239 424V272C239 239.415 265.415 213 298 213H473V424H239Z"
        stroke={stroke}
        strokeWidth="2"
      />
      <path
        d="M60 424H237V272C237 239.415 210.585 213 178 213H1V365C1 397.33 27.004 423.587 59.2373 423.995L60 424Z"
        stroke={stroke}
        strokeWidth="2"
      />
      <path
        d="M237 1V152C237 184.585 210.585 211 178 211H1V1H237Z"
        stroke={stroke}
        strokeWidth="2"
      />
      <path
        d="M239 1V152C239 184.585 265.415 211 298 211H473V1H239Z"
        stroke={stroke}
        strokeWidth="2"
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
