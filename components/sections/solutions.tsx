import {
  ArrowUpRight,
  CalendarDays,
  Cpu,
  MessageCircle,
  Monitor,
  ShoppingBag,
  Store,
  Workflow,
  Wrench,
} from "lucide-react";

import { QuoteButton } from "@/components/quote-button";
import { SectionHeading } from "@/components/section-heading";
import { services, type ServiceIcon } from "@/lib/content";

const iconMap: Record<ServiceIcon, typeof Monitor> = {
  monitor: Monitor,
  "shopping-bag": ShoppingBag,
  cpu: Cpu,
  store: Store,
  calendar: CalendarDays,
  whatsapp: MessageCircle,
  workflow: Workflow,
  wrench: Wrench,
};

export function SolutionsSection() {
  return (
    <section
      id="solucoes"
      className="section solutions"
      aria-labelledby="solucoes-title"
    >
      <div className="site-container solutions__grid">
        <div className="solutions__intro">
          <SectionHeading
            index="03"
            label="Soluções"
            titleId="solucoes-title"
            title={
              <>
                O que
                <br />
                construímos.
              </>
            }
            description="Soluções digitais pensadas para resolver etapas concretas da operação — sem excesso de camadas."
            className="section-heading--compact"
          />

          <div className="solutions__aside" data-reveal>
            <p className="section-label">Do site ao sistema</p>
            <p>
              Você pode começar por uma presença digital, por um processo
              específico ou por uma operação inteira. O ponto de partida é
              sempre a necessidade real.
            </p>
            <a href="#contato" className="btn btn--ghost">
              <span>Mapear minha necessidade</span>
              <ArrowUpRight className="icon-arrow" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="services-list">
          {services.map((service) => {
            const Icon = iconMap[service.icon];

            return (
              <article
                key={service.id}
                id={`servico-${service.id}`}
                className="service-row"
                data-service-item
                data-reveal
              >
                <span className="service-row__index">{service.index}</span>

                <div className="service-row__main">
                  <div className="service-row__heading">
                    <span className="service-row__icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <h3>{service.title}</h3>
                  </div>
                  <p className="service-row__description">
                    {service.description}
                  </p>
                  <ul className="service-row__items" aria-label="Inclui">
                    {service.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <QuoteButton
                  solution={service.id}
                  className="link-arrow service-row__cta"
                >
                  Solicitar orçamento
                </QuoteButton>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
