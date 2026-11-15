import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { ContactFormSlot } from "@/components/contact-form";
import {
  getMailtoUrl,
  getWhatsAppUrl,
  hasDirectContact,
  siteConfig,
} from "@/lib/site";

export function ContactSection() {
  const whatsappUrl = getWhatsAppUrl(
    "Olá! Vim pelo site da CODE_PH e gostaria de conversar sobre um projeto.",
  );
  const mailtoUrl = getMailtoUrl("Projeto — CODE_PH");
  const phoneHref = siteConfig.contact.phone
    ? `tel:${siteConfig.contact.phone.replace(/[^\d+]/g, "")}`
    : null;

  return (
    <section
      id="contato"
      className="section contact"
      aria-labelledby="contato-title"
      tabIndex={-1}
      data-contact-section
    >
      <div className="site-container contact__grid">
        <div className="contact__intro">
          <p className="section-label" data-reveal>
            <span>06</span>
            <span>Contato</span>
          </p>

          <h2 id="contato-title" className="contact__title" data-reveal>
            <span>Sua próxima ideia</span>
            <span>pode começar</span>
            <span className="contact__title-accent">aqui.</span>
          </h2>

          <p className="contact__lead" data-reveal>
            Conte o que você precisa — mesmo que o projeto ainda esteja no
            papel. A conversa começa pelo problema, não por uma proposta
            pronta.
          </p>

          {hasDirectContact ? (
            <div className="contact__channels" data-reveal>
              <p className="section-label">Canais diretos</p>

              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  className="contact-channel"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contact-channel__icon">
                    <MessageCircle aria-hidden="true" />
                  </span>
                  <span className="contact-channel__content">
                    <span className="contact-channel__label">WhatsApp</span>
                    <span className="contact-channel__value">
                      Abrir uma conversa
                    </span>
                  </span>
                  <ArrowUpRight
                    className="contact-channel__arrow"
                    aria-hidden="true"
                  />
                </a>
              ) : null}

              {mailtoUrl ? (
                <a href={mailtoUrl} className="contact-channel">
                  <span className="contact-channel__icon">
                    <Mail aria-hidden="true" />
                  </span>
                  <span className="contact-channel__content">
                    <span className="contact-channel__label">E-mail</span>
                    <span className="contact-channel__value">
                      {siteConfig.contact.email}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="contact-channel__arrow"
                    aria-hidden="true"
                  />
                </a>
              ) : null}

              {phoneHref ? (
                <a href={phoneHref} className="contact-channel">
                  <span className="contact-channel__icon">
                    <Phone aria-hidden="true" />
                  </span>
                  <span className="contact-channel__content">
                    <span className="contact-channel__label">Telefone</span>
                    <span className="contact-channel__value">
                      {siteConfig.contact.phone}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="contact-channel__arrow"
                    aria-hidden="true"
                  />
                </a>
              ) : null}

              {siteConfig.contact.location ? (
                <div className="contact-channel contact-channel--static">
                  <span className="contact-channel__icon">
                    <MapPin aria-hidden="true" />
                  </span>
                  <span className="contact-channel__content">
                    <span className="contact-channel__label">Localização</span>
                    <span className="contact-channel__value">
                      {siteConfig.contact.location}
                    </span>
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="contact__next" data-reveal>
            <p className="section-label">O que acontece depois</p>
            <ol>
              <li>
                <span>01</span>
                <div>
                  <h3>Você envia o briefing</h3>
                  <p>Nome, contato e o contexto do que precisa ser resolvido.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>Analisamos a necessidade</h3>
                  <p>
                    Lemos o cenário e identificamos o que ainda precisa ser
                    esclarecido.
                  </p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>Retornamos com os próximos passos</h3>
                  <p>Pelo canal que você escolher para a conversa.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div className="contact__form-wrap" data-reveal>
          <ContactFormSlot />
        </div>
      </div>
    </section>
  );
}
