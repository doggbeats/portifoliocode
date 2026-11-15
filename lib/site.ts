const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
  /\D/g,
  "",
);

const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "";
const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "";
const location = process.env.NEXT_PUBLIC_LOCATION?.trim() || "";

export const siteConfig = {
  name: "CODE_PH",
  legalName: "CODE_PH — Assistência Técnica & Soluções Digitais",
  shortDescription:
    "Sites, sistemas e soluções digitais para empresas que precisam funcionar melhor.",
  description:
    "Desenvolvemos sites, sistemas e soluções digitais para empresas: sites institucionais, lojas virtuais, sistemas de gestão, PDV, agendamento, integrações com WhatsApp e automação de processos.",
  url: rawSiteUrl.replace(/\/+$/, ""),
  contact: {
    whatsapp: whatsappNumber,
    email,
    phone,
    location,
  },
  social: [
    {
      id: "instagram" as const,
      label: "Instagram",
      url: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || "",
    },
    {
      id: "linkedin" as const,
      label: "LinkedIn",
      url: process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() || "",
    },
    {
      id: "github" as const,
      label: "GitHub",
      url: process.env.NEXT_PUBLIC_GITHUB_URL?.trim() || "",
    },
  ].filter((item) => item.url.length > 0),
};

export function getWhatsAppUrl(message?: string) {
  if (!siteConfig.contact.whatsapp) {
    return null;
  }

  const text = encodeURIComponent(
    message ||
      "Olá! Vim pelo site da CODE_PH e gostaria de conversar sobre um projeto.",
  );

  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${text}`;
}

export function getMailtoUrl(subject?: string, body?: string) {
  if (!siteConfig.contact.email) {
    return null;
  }

  const params = new URLSearchParams();

  if (subject) {
    params.set("subject", subject);
  }

  if (body) {
    params.set("body", body);
  }

  const query = params.toString();

  return `mailto:${siteConfig.contact.email}${query ? `?${query}` : ""}`;
}

export const hasDirectContact = Boolean(
  siteConfig.contact.whatsapp ||
    siteConfig.contact.email ||
    siteConfig.contact.phone ||
    siteConfig.contact.location,
);
