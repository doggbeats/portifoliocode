import { AboutSection } from "@/components/sections/about";
import { ContactSection } from "@/components/sections/contact";
import { DifferenceSection } from "@/components/sections/difference";
import { Hero } from "@/components/sections/hero";
import { ProcessSection } from "@/components/sections/process";
import { ProjectsSection } from "@/components/sections/projects";
import { SolutionsSection } from "@/components/sections/solutions";
import { services } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.name,
  alternateName: siteConfig.legalName,
  url: siteConfig.url,
  description: siteConfig.description,
  knowsAbout: services.map((service) => service.title),
  ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
  ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
  ...(siteConfig.social.length > 0
    ? { sameAs: siteConfig.social.map((social) => social.url) }
    : {}),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <main id="conteudo" tabIndex={-1} data-page="home">
        <Hero />
        <AboutSection />
        <ProjectsSection />
        <SolutionsSection />
        <DifferenceSection />
        <ProcessSection />
        <ContactSection />
      </main>
    </>
  );
}
