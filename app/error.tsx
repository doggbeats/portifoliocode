"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="conteudo" className="state-page site-container">
      <p className="section-label">
        <span>ERRO</span>
        <span>ALGO SAIU DO CURSO</span>
      </p>

      <h1 className="state-page__title">
        Não foi possível concluir esta etapa.
      </h1>

      <p className="state-page__description">
        Ocorreu um erro inesperado. Você pode tentar novamente ou voltar para o
        início.
      </p>

      <div className="state-page__actions">
        <button type="button" className="btn btn--primary" onClick={reset}>
          <span>Tentar novamente</span>
          <RotateCcw className="icon-arrow" aria-hidden="true" />
        </button>
        <Link href="/" className="btn btn--ghost">
          <span>Voltar ao início</span>
          <ArrowLeft className="icon-arrow" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
