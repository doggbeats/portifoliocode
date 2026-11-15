import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main id="conteudo" className="state-page site-container">
      <p className="section-label">
        <span>404</span>
        <span>PÁGINA NÃO ENCONTRADA</span>
      </p>

      <p className="state-page__code" aria-hidden="true">
        404
      </p>

      <h1 className="state-page__title">
        Esta página não existe — ou ainda não foi construída.
      </h1>

      <p className="state-page__description">
        O endereço acessado não corresponde a nenhuma página da CODE_PH. Volte
        ao início para continuar navegando.
      </p>

      <div className="state-page__actions">
        <Link href="/" className="btn btn--primary">
          <span>Voltar ao início</span>
          <ArrowLeft className="icon-arrow" aria-hidden="true" />
        </Link>
        <Link href="/#contato" className="btn btn--ghost">
          <span>Falar com a CODE_PH</span>
        </Link>
      </div>
    </main>
  );
}
