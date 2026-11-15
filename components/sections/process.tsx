import { SectionHeading } from "@/components/section-heading";
import { processSteps } from "@/lib/content";

export function ProcessSection() {
  return (
    <section
      id="processo"
      className="section process"
      aria-labelledby="processo-title"
    >
      <div className="site-container">
        <SectionHeading
          index="05"
          label="Processo"
          titleId="processo-title"
          title={
            <>
              Do problema
              <br />
              à entrega.
            </>
          }
          description="Um processo direto, com etapas visíveis e decisões documentadas. Sem caixa-preta e sem excesso de cerimônia."
          note="04 ETAPAS / ACOMPANHAMENTO CONTÍNUO"
        />

        <ol className="process-grid">
          {processSteps.map((step) => (
            <li
              key={step.index}
              className="process-step"
              data-process-step
              data-reveal
            >
              <div className="process-step__top">
                <span className="process-step__index">{step.index}</span>
                <span className="process-step__marker" aria-hidden="true" />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
