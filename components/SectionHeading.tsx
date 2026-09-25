interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  description,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2
        className={`font-serif text-3xl sm:text-4xl md:text-[2.75rem] leading-tight ${
          light ? "text-blanco" : "text-texto"
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`text-lg font-medium ${light ? "text-blanco/90" : "text-texto"}`}
        >
          {subtitle}
        </p>
      ) : null}
      {description ? (
        <p
          className={`max-w-2xl text-base leading-relaxed ${
            light ? "text-blanco/80" : "text-texto-suave"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
