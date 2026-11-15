export default function Loading() {
  return (
    <main
      id="conteudo"
      className="loading-screen site-container"
      aria-busy="true"
      aria-label="Carregando conteúdo"
    >
      <span className="loading-screen__logo" aria-hidden="true">
        &lt;CODE_PH/&gt;
      </span>
      <span className="loading-screen__line" aria-hidden="true" />
      <span className="loading-screen__text">Carregando experiência</span>
    </main>
  );
}
