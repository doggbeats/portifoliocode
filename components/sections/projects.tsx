import { ArrowUpRight } from "lucide-react";

import { ProjectMedia } from "@/components/project-media";
import { QuoteButton } from "@/components/quote-button";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/lib/content";

const cardLayout = ["wide", "narrow", "narrow", "wide", "wide"];

export function ProjectsSection() {
  const hasLonelyLastCard = projects.length % 2 === 1;

  return (
    <section
      id="projetos"
      className="section projects"
      aria-labelledby="projetos-title"
    >
      <div className="site-container">
        <SectionHeading
          index="02"
          label="Projetos"
          titleId="projetos-title"
          title={
            <>
              Projetos
              <br />
              selecionados.
            </>
          }
          description="Uma seleção editorial das frentes de projeto que estruturam nosso trabalho — do sistema que organiza a operação à presença digital que apresenta a empresa."
          note="05 PROJETOS / SELEÇÃO EDITORIAL"
        />

        <div className="projects-grid" data-horizontal-section>
          {projects.map((project, index) => {
            const isLonelyLast = hasLonelyLastCard && index === projects.length - 1;

            return (
              <article
                key={project.id}
                className={`project-card project-card--${cardLayout[index] ?? "narrow"}${isLonelyLast ? " project-card--center" : ""}`}
                data-project-item
                data-project-index={project.index}
                data-reveal
              >
                <ProjectMedia project={project} />

                <div className="project-card__body">
                  <div className="project-card__meta">
                    <span className="project-card__index">{project.index}</span>
                    <span className="project-card__category">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="project-card__title">{project.title}</h3>
                  <p className="project-card__description">
                    {project.description}
                  </p>

                  <div className="project-card__footer">
                    <ul className="tag-list" aria-label="Escopo do projeto">
                      {project.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>

                    {project.href ? (
                      <a
                        href={project.href}
                        className="link-arrow"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>Ver projeto</span>
                        <ArrowUpRight
                          className="icon-arrow"
                          aria-hidden="true"
                        />
                      </a>
                    ) : (
                      <QuoteButton
                        solution={project.solution}
                        className="link-arrow project-card__cta"
                      >
                        Quero algo assim
                      </QuoteButton>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="projects__footer" data-reveal>
          <p>
            Tem uma necessidade parecida ou um projeto fora dessa lista?
          </p>
          <a href="#contato" className="link-arrow">
            <span>Conte para a CODE_PH</span>
            <ArrowUpRight className="icon-arrow" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
