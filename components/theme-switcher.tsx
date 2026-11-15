"use client";

import { useTheme } from "@/components/theme-provider";
import { THEME_LABELS, THEMES } from "@/lib/theme";

type ThemeSwitcherProps = {
  className?: string;
};

export function ThemeSwitcher({ className = "" }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`theme-switcher ${className}`.trim()}
      role="group"
      aria-label="Tema visual do site"
    >
      {THEMES.map((value) => (
        <button
          key={value}
          type="button"
          className="theme-swatch"
          data-theme-swatch={value}
          aria-pressed={theme === value}
          aria-label={`Ativar tema ${THEME_LABELS[value]}`}
          title={THEME_LABELS[value]}
          onClick={() => setTheme(value)}
        >
          <span className="sr-only">{THEME_LABELS[value]}</span>
        </button>
      ))}
    </div>
  );
}
