"use client";

import type { ReactNode } from "react";

import { CookieConsent } from "@/components/cookie-consent";
import { ContactIntentProvider } from "@/components/contact-intent-provider";
import { CursorSpot } from "@/components/cursor-spot";
import { ScrollExperience } from "@/components/scroll-experience";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ContactIntentProvider>
        <CursorSpot />
        <ScrollExperience />
        {children}
        <CookieConsent />
      </ContactIntentProvider>
    </ThemeProvider>
  );
}
