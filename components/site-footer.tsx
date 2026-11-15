import { ArrowUp, ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { CookiePreferencesButton } from "@/components/cookie-consent";
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/social-icons";
import { navItems, services } from "@/lib/content";
import { getMailtoUrl, getWhatsAppUrl, siteConfig } from "@/lib/site";

const socialIcons = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
};

const year = new Date().getFullYear();

export function SiteFooter() {
  const whatsappUrl = getWhatsAppUrl(
    "Olá! Vim pelo site da CODE_PH e gostaria de conversar.",
  );
  const mailtoUrl = getMailtoUrl("Contato — CODE_PH");

  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo className="footer-brand__logo" />
            <p className="footer-brand__description">
              Tecnologia, estratégia e desenvolvimento para transformar
              necessidades reais em soluções digitais funcionais.
            </p>

            {siteConfig.social.length > 0 ? (
              <div className="footer-socials" aria-label="Redes sociais">
                {siteConfig.social.map((social) => {
                  const Icon = socialIcons[social.id];

                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      className="footer-social"
                      aria-label={social.label}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>

          <nav className="footer-column" aria-label="Navegação do rodapé">
            <p className="section-label">Navegação</p>
            <ul>
              {navItems.map((item) => (
                <li key={item.sectionId}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-column footer-column--services">
            <p className="section-label">Serviços</p>
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <Link href={`/#servico-${service.id}`}>{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column footer-column--contact">
            <p className="section-label">Contato</p>
            <Link href="/#contato" className="footer-contact-link">
              Enviar um briefing
              <ArrowUpRight aria-hidden="true" />
            </Link>

            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                className="footer-contact-link"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle aria-hidden="true" />
                WhatsApp
              </a>
            ) : null}

            {mailtoUrl ? (
              <a href={mailtoUrl} className="footer-contact-link">
                <Mail aria-hidden="true" />
                {siteConfig.contact.email}
              </a>
            ) : null}

            <p className="footer-location">
              {siteConfig.contact.location || "Atendimento digital"}
            </p>
          </div>
        </div>

        <div className="footer-wordmark" aria-hidden="true">
          &lt;CODE_PH/&gt;
        </div>

        <div className="footer-bottom">
          <p>
            © {year} CODE_PH. Todos os direitos reservados.
          </p>
          <p className="footer-bottom__tagline">
            Assistência Técnica &amp; Soluções Digitais
          </p>
          <nav className="footer-policy-links" aria-label="Privacidade">
            <Link href="/politica-de-privacidade">Privacidade</Link>
            <Link href="/politica-de-cookies">Cookies</Link>
            <CookiePreferencesButton />
          </nav>
          <Link href="/#inicio" className="footer-top">
            <span>Voltar ao topo</span>
            <ArrowUp aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
