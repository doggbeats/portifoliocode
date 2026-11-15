import { ArrowUpRight } from "lucide-react";

import { differentialPrinciples } from "@/lib/content";

export function DifferenceSection() {
  return (
    <section
      id="diferencial"
      className="section section--inverse difference"
      aria-labelledby="diferencial-title"
      data-sticky-section
    >
      <div className="site-container">
        <div className="difference__top" data-reveal>
          <p className="section-label">
            <span>04</span>
            <span>Diferencial</span>
          </p>
          <p className="difference__note">CODE_PH / MANIFESTO</p>
        </div>

        <div
          className="difference__statement"
          data-sticky-content
          data-reveal
        >
          <h2 id="diferencial-title" className="difference__title">
            <span className="difference__title-muted">
              Não é apenas sobre ter um site.
            </span>
            <span>É sobre ter uma solução que funciona.</span>
          </h2>
        </div>

        <div className="difference__content">
          <p className="difference__lead" data-reveal>
            Um site bonito que não resolve nada é só vitrine. A CODE_PH parte
            do problema real — a planilha que trava, o atendimento que se
            perde, o processo que depende de uma pessoa — e desenha a
            ferramenta que faz a operação avançar.
          </p>

          <div className="difference__principles">
            {differentialPrinciples.map((principle) => (
              <article
                key={principle.title}
                className="difference__principle"
                data-reveal
              >
                <span className="difference__principle-mark" aria-hidden="true">
                  +
                </span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="difference__foot" data-reveal>
          <a href="#contato" className="btn btn--inverse">
            <span>Vamos conversar</span>
            <ArrowUpRight className="icon-arrow" aria-hidden="true" />
          </a>
          <span className="difference__code">SOLUTION / OVER SURFACE</span>
        </div>
      </div>
    </section>
  );
}
