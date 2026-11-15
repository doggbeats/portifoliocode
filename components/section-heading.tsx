import type { ReactNode } from "react";

type SectionHeadingProps = {
  index: string;
  label: string;
  titleId: string;
  title: ReactNode;
  description?: ReactNode;
  note?: ReactNode;
  className?: string;
};

export function SectionHeading({
  index,
  label,
  titleId,
  title,
  description,
  note,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${className}`.trim()} data-reveal>
      <div className="section-heading__meta">
        <p className="section-label">
          <span>{index}</span>
          <span>{label}</span>
        </p>
        {note ? <p className="section-heading__note">{note}</p> : null}
      </div>

      <div className="section-heading__main">
        <h2 id={titleId} className="section-title">
          {title}
        </h2>
        {description ? (
          <p className="section-heading__description">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
