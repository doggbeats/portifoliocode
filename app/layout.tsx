import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";

import { AccessibilityWidget } from "@/components/accessibility-widget";
import { LiquidReveal } from "@/components/liquid-reveal";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { accessibilityInitScript } from "@/lib/accessibility";
import { introInitScript } from "@/lib/intro";
import { siteConfig } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-code",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      "CODE_PH — Tecnologia que transforma ideias em experiências digitais",
    template: "%s | CODE_PH",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  keywords: [
    "CODE_PH",
    "desenvolvimento web",
    "sistemas personalizados",
    "sistema de gestão",
    "PDV",
    "loja virtual",
    "catálogo digital",
    "agendamento online",
    "automação de processos",
    "assistência técnica",
    "sites institucionais",
    "integração com WhatsApp",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: siteConfig.name,
    title:
      "CODE_PH — Tecnologia que transforma ideias em experiências digitais",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title:
      "CODE_PH — Tecnologia que transforma ideias em experiências digitais",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
          suppressHydrationWarning
        />
        <script
          dangerouslySetInnerHTML={{ __html: introInitScript }}
          suppressHydrationWarning
        />
        <script
          dangerouslySetInnerHTML={{ __html: accessibilityInitScript }}
          suppressHydrationWarning
        />
      </head>
      <body className="min-h-dvh bg-bg font-sans text-fg antialiased">
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>

        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
        </Providers>
        <LiquidReveal />
        <WhatsAppFloat />
        <AccessibilityWidget />
      </body>
    </html>
  );
}
