import { ArrowUpRight } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { aboutCapabilities } from "@/lib/content";

export function AboutSection() {
  return (
    <section
      id="sobre"
      className="section about"
      aria-labelledby="sobre-title"
    >
      <div className="site-container">
        <SectionHeading
          index="01"
          label="Sobre"
          titleId="sobre-title"
          title={
            <>
              Tecnologia, estratégia
              <br />e desenvolvimento.
            </>
          }
          description="Cada projeto começa pela compreensão da operação. O código vem depois — como consequência de uma solução bem pensada."
          note="CODE_PH / ASSISTÊNCIA TÉCNICA"
        />

        <div className="about__grid">
          <div className="about__statement" data-reveal>
            <p className="about__lead">
              A CODE_PH une tecnologia, estratégia e desenvolvimento para
              transformar necessidades reais em soluções digitais funcionais.
            </p>

            <blockquote className="about__quote">
              <span className="about__quote-mark" aria-hidden="true">
                “
              </span>
              <p>
                Não começamos pelo código.
                <br />
                Começamos pelo problema que precisa ser resolvido.
              </p>
            </blockquote>

            <div className="about__meta">
              <span>Desenvolvimento sob medida</span>
              <span>Do diagnóstico ao suporte</span>
            </div>
          </div>

          <ol className="capability-list">
            {aboutCapabilities.map((capability, index) => (
              <li
                key={capability.title}
                className="capability-list__item"
                data-reveal
              >
                <span className="capability-list__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="capability-list__content">
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </div>
                <ArrowUpRight
                  className="capability-list__icon"
                  aria-hidden="true"
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
