import { ArrowDown, ArrowUpRight } from "lucide-react";

import { HeroVisual } from "@/components/hero-visual";

export function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="site-container">
        <div className="hero__eyebrow">
          <span className="status-dot" aria-hidden="true" />
          <span>Assistência técnica &amp; soluções digitais</span>
          <span className="hero__eyebrow-meta">BR / DIGITAL</span>
        </div>

        <div className="hero__grid">
          <div className="hero__content">
            <h1 id="hero-title" className="hero__title">
              <span className="hero__line" data-reveal-line>
                <span>Tecnologia que</span>
              </span>
              <span className="hero__line" data-reveal-line>
                <span>transforma ideias</span>
              </span>
              <span className="hero__line" data-reveal-line>
                <span>em experiências</span>
              </span>
              <span
                className="hero__line hero__line--outline"
                data-reveal-line
              >
                <span>digitais.</span>
              </span>
            </h1>

            <div className="hero__intro">
              <p className="hero__subtitle">
                Desenvolvemos sites, sistemas e soluções digitais que ajudam
                empresas a apresentar seus serviços, organizar processos e
                conquistar novas oportunidades.
              </p>

              <div className="hero__actions">
                <a href="#projetos" className="btn btn--primary">
                  <span>Explorar projetos</span>
                  <ArrowDown className="icon-arrow" aria-hidden="true" />
                </a>
                <a href="#contato" className="btn btn--ghost">
                  <span>Vamos conversar</span>
                  <ArrowUpRight className="icon-arrow" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <div
            className="hero__visual"
            data-parallax
            data-reveal
            style={{
              transform:
                "translate3d(var(--intro-hero-x, 0px), var(--intro-hero-y, 0px), 0)",
            }}
          >
            <HeroVisual />
          </div>
        </div>

        <div className="hero__foot">
          <a href="#sobre" className="scroll-cue">
            <span>Role para explorar</span>
            <span className="scroll-cue__line" aria-hidden="true" />
            <ArrowDown className="scroll-cue__icon" aria-hidden="true" />
          </a>
          <p className="hero__disciplines">
            <span>Sites</span>
            <span aria-hidden="true">/</span>
            <span>Sistemas</span>
            <span aria-hidden="true">/</span>
            <span>Automação</span>
            <span aria-hidden="true">/</span>
            <span>Suporte</span>
          </p>
        </div>
      </div>
    </section>
  );
}
