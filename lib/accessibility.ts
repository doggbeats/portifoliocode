export const ACCESSIBILITY_STORAGE_KEY = "code-ph-accessibility";
export const ACCESSIBILITY_CHANGE_EVENT = "code-ph-accessibility-change";

export const FONT_SCALES = ["normal", "large", "xlarge"] as const;

export type FontScale = (typeof FONT_SCALES)[number];

export type AccessibilityPreferences = {
  fontScale: FontScale;
  highContrast: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
};

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  fontScale: "normal",
  highContrast: false,
  underlineLinks: false,
  reduceMotion: false,
};

export const FONT_SCALE_LABELS: Record<FontScale, string> = {
  normal: "Padrão",
  large: "Grande",
  xlarge: "Muito grande",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFontScale(value: unknown): value is FontScale {
  return typeof value === "string" && FONT_SCALES.includes(value as FontScale);
}

export function parseAccessibilityPreferences(
  value: unknown,
): AccessibilityPreferences {
  if (!isRecord(value)) {
    return DEFAULT_ACCESSIBILITY_PREFERENCES;
  }

  return {
    fontScale: isFontScale(value.fontScale)
      ? value.fontScale
      : DEFAULT_ACCESSIBILITY_PREFERENCES.fontScale,
    highContrast:
      typeof value.highContrast === "boolean"
        ? value.highContrast
        : DEFAULT_ACCESSIBILITY_PREFERENCES.highContrast,
    underlineLinks:
      typeof value.underlineLinks === "boolean"
        ? value.underlineLinks
        : DEFAULT_ACCESSIBILITY_PREFERENCES.underlineLinks,
    reduceMotion:
      typeof value.reduceMotion === "boolean"
        ? value.reduceMotion
        : DEFAULT_ACCESSIBILITY_PREFERENCES.reduceMotion,
  };
}

function readPreferencesFromDocument(): AccessibilityPreferences {
  const root = document.documentElement;

  return parseAccessibilityPreferences({
    fontScale: root.dataset.a11yFont,
    highContrast: root.dataset.a11yContrast === "on",
    underlineLinks: root.dataset.a11yUnderline === "on",
    reduceMotion: root.dataset.a11yMotion === "reduced",
  });
}

export function readAccessibilityPreferences(): AccessibilityPreferences {
  try {
    const stored = window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);

    if (stored) {
      return parseAccessibilityPreferences(JSON.parse(stored));
    }
  } catch {
    // Sem acesso ao localStorage: usa o que já está aplicado no documento.
  }

  return readPreferencesFromDocument();
}

export function applyAccessibilityPreferences(
  preferences: AccessibilityPreferences,
) {
  const root = document.documentElement;

  root.dataset.a11yFont = preferences.fontScale;
  root.dataset.a11yContrast = preferences.highContrast ? "on" : "off";
  root.dataset.a11yUnderline = preferences.underlineLinks ? "on" : "off";
  root.dataset.a11yMotion = preferences.reduceMotion ? "reduced" : "default";
}

export function saveAccessibilityPreferences(
  preferences: AccessibilityPreferences,
) {
  applyAccessibilityPreferences(preferences);

  try {
    window.localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEY,
      JSON.stringify(preferences),
    );
  } catch {
    // As preferências continuam ativas nesta sessão mesmo sem armazenamento.
  }

  window.dispatchEvent(new Event(ACCESSIBILITY_CHANGE_EVENT));
}

export function prefersReducedMotion() {
  return (
    document.documentElement.dataset.a11yMotion === "reduced" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export const accessibilityInitScript = `(function(){var root=document.documentElement;try{var raw=window.localStorage.getItem("${ACCESSIBILITY_STORAGE_KEY}");var prefs=raw?JSON.parse(raw):{};var font=prefs.fontScale;if(font!=="normal"&&font!=="large"&&font!=="xlarge"){font="normal";}root.setAttribute("data-a11y-font",font);root.setAttribute("data-a11y-contrast",prefs.highContrast===true?"on":"off");root.setAttribute("data-a11y-underline",prefs.underlineLinks===true?"on":"off");root.setAttribute("data-a11y-motion",prefs.reduceMotion===true?"reduced":"default");}catch(error){root.setAttribute("data-a11y-font","normal");root.setAttribute("data-a11y-contrast","off");root.setAttribute("data-a11y-underline","off");root.setAttribute("data-a11y-motion","default");}})();`;
