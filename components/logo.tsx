import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  showDescriptor?: boolean;
  onClick?: () => void;
};

export function Logo({
  className = "",
  showDescriptor = true,
  onClick,
}: LogoProps) {
  return (
    <Link
      href="/#inicio"
      className={`logo ${className}`.trim()}
      aria-label="CODE_PH — voltar ao início"
      onClick={onClick}
    >
      <Image
        src="/logo.png"
        alt=""
        width={172}
        height={46}
        className="logo__image"
        priority
      />
      {showDescriptor ? (
        <span className="logo__descriptor">
          Assistência técnica &amp; soluções digitais
        </span>
      ) : null}
    </Link>
  );
}
