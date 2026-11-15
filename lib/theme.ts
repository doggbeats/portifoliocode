export const THEMES = ["light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "light";
export const THEME_STORAGE_KEY = "code-ph-theme";

export const THEME_LABELS: Record<Theme, string> = {
  light: "Branco e preto",
  dark: "Preto e branco",
};

export const THEME_COLORS: Record<Theme, string> = {
  light: "#ffffff",
  dark: "#080808",
};

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && THEMES.includes(value as Theme);
}

export const themeInitScript = `(function(){try{var key="${THEME_STORAGE_KEY}";var value=window.localStorage.getItem(key);if(value!=="light"&&value!=="dark"){value="light";}var root=document.documentElement;root.setAttribute("data-theme",value);root.style.colorScheme=value==="light"?"light":"dark";}catch(error){document.documentElement.setAttribute("data-theme","light");}})();`;
