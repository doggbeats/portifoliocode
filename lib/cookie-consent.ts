export const COOKIE_CONSENT_COOKIE = "code-ph-cookie-consent";
export const COOKIE_CONSENT_EVENT = "code-ph-cookie-consent-change";
export const COOKIE_SETTINGS_OPEN_EVENT = "code-ph-cookie-settings-open";
export const COOKIE_POLICY_VERSION = "1.0.0";
export const COOKIE_POLICY_UPDATED = "2026-11-14";
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

export const OPTIONAL_COOKIE_CATEGORIES = [
  {
    id: "analytics",
    label: "Medição de audiência",
    description:
      "Ajuda a entender o uso do site. Nenhuma ferramenta de análise está configurada atualmente.",
  },
  {
    id: "marketing",
    label: "Publicidade e marketing",
    description:
      "Usada para publicidade personalizada. Nenhuma ferramenta de publicidade está configurada atualmente.",
  },
] as const;

export type OptionalCookieCategory =
  (typeof OPTIONAL_COOKIE_CATEGORIES)[number]["id"];

export type CookiePreferences = {
  necessary: true;
} & Record<OptionalCookieCategory, boolean>;

export type CookieConsentRecord = {
  policyVersion: string;
  decidedAt: string;
  preferences: CookiePreferences;
};

export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getCookieConsentSnapshot() {
  const consent = document.cookie
    .split(/;\s*/)
    .find((cookie) => cookie.startsWith(`${COOKIE_CONSENT_COOKIE}=`));

  return consent?.slice(COOKIE_CONSENT_COOKIE.length + 1) || "__none__";
}

export function parseCookieConsent(
  encodedValue: string,
): CookieConsentRecord | null {
  if (!encodedValue || encodedValue === "__none__" || encodedValue === "__loading__") {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(encodedValue));

    if (!isRecord(parsed) || !isRecord(parsed.preferences)) {
      return null;
    }

    const preferences = parsed.preferences;

    if (
      parsed.policyVersion !== COOKIE_POLICY_VERSION ||
      typeof parsed.decidedAt !== "string" ||
      Number.isNaN(Date.parse(parsed.decidedAt)) ||
      preferences.necessary !== true ||
      typeof preferences.analytics !== "boolean" ||
      typeof preferences.marketing !== "boolean"
    ) {
      return null;
    }

    return {
      policyVersion: COOKIE_POLICY_VERSION,
      decidedAt: parsed.decidedAt,
      preferences: {
        necessary: true,
        analytics: preferences.analytics,
        marketing: preferences.marketing,
      },
    };
  } catch {
    return null;
  }
}

export function readCookieConsent() {
  return parseCookieConsent(getCookieConsentSnapshot());
}

export function saveCookieConsent(
  preferences: CookiePreferences,
): CookieConsentRecord | null {
  const record: CookieConsentRecord = {
    policyVersion: COOKIE_POLICY_VERSION,
    decidedAt: new Date().toISOString(),
    preferences: {
      necessary: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
    },
  };
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${COOKIE_CONSENT_COOKIE}=${encodeURIComponent(
    JSON.stringify(record),
  )}; Max-Age=${COOKIE_CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;

  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));

  const saved = readCookieConsent();

  return saved?.decidedAt === record.decidedAt ? saved : null;
}
