"use client";

import {
  Accessibility,
  Contrast,
  Minus,
  PauseCircle,
  Plus,
  RotateCcw,
  Underline,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import {
  ACCESSIBILITY_CHANGE_EVENT,
  ACCESSIBILITY_STORAGE_KEY,
  DEFAULT_ACCESSIBILITY_PREFERENCES,
  FONT_SCALES,
  FONT_SCALE_LABELS,
  type AccessibilityPreferences,
  parseAccessibilityPreferences,
  readAccessibilityPreferences,
  saveAccessibilityPreferences,
} from "@/lib/accessibility";

function subscribe(onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === ACCESSIBILITY_STORAGE_KEY) {
      onChange();
    }
  };

  window.addEventListener(ACCESSIBILITY_CHANGE_EVENT, onChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(ACCESSIBILITY_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function getSnapshot() {
  return JSON.stringify(readAccessibilityPreferences());
}

function getServerSnapshot() {
  return JSON.stringify(DEFAULT_ACCESSIBILITY_PREFERENCES);
}

export function AccessibilityWidget() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const preferences: AccessibilityPreferences =
    parseAccessibilityPreferences(JSON.parse(snapshot));
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  const updatePreferences = useCallback(
    (patch: Partial<AccessibilityPreferences>) => {
      const next = { ...readAccessibilityPreferences(), ...patch };

      saveAccessibilityPreferences(next);
    },
    [],
  );

  const fontScaleIndex = FONT_SCALES.indexOf(preferences.fontScale);
  const isDefault =
    preferences.fontScale === DEFAULT_ACCESSIBILITY_PREFERENCES.fontScale &&
    preferences.highContrast ===
      DEFAULT_ACCESSIBILITY_PREFERENCES.highContrast &&
    preferences.underlineLinks ===
      DEFAULT_ACCESSIBILITY_PREFERENCES.underlineLinks &&
    preferences.reduceMotion ===
      DEFAULT_ACCESSIBILITY_PREFERENCES.reduceMotion;

  return (
    <div className="a11y-widget" ref={containerRef}>
      {isOpen ? (
        <div
          id="acessibilidade-painel"
          className="a11y-panel"
          role="group"
          aria-label="Ajustes de acessibilidade"
        >
          <div className="a11y-panel__head">
            <p className="section-label">Acessibilidade</p>
            <button
              type="button"
              className="a11y-panel__close"
              onClick={() => {
                setIsOpen(false);
                toggleRef.current?.focus();
              }}
              aria-label="Fechar ajustes de acessibilidade"
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <div className="a11y-panel__group">
            <p className="a11y-panel__label">Tamanho do texto</p>
            <div className="a11y-font-scale">
              <button
                type="button"
                className="a11y-font-scale__button"
                onClick={() =>
                  updatePreferences({
                    fontScale: FONT_SCALES[Math.max(0, fontScaleIndex - 1)],
                  })
                }
                disabled={fontScaleIndex === 0}
                aria-label="Diminuir tamanho do texto"
                title="Diminuir texto"
              >
                <Minus aria-hidden="true" />
              </button>
              <span className="a11y-font-scale__value" aria-live="polite">
                {FONT_SCALE_LABELS[preferences.fontScale]}
              </span>
              <button
                type="button"
                className="a11y-font-scale__button"
                onClick={() =>
                  updatePreferences({
                    fontScale:
                      FONT_SCALES[
                        Math.min(FONT_SCALES.length - 1, fontScaleIndex + 1)
                      ],
                  })
                }
                disabled={fontScaleIndex === FONT_SCALES.length - 1}
                aria-label="Aumentar tamanho do texto"
                title="Aumentar texto"
              >
                <Plus aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="a11y-panel__group a11y-panel__group--options">
            <button
              type="button"
              className="a11y-option"
              aria-pressed={preferences.highContrast}
              onClick={() =>
                updatePreferences({ highContrast: !preferences.highContrast })
              }
            >
              <Contrast aria-hidden="true" />
              <span>Alto contraste</span>
            </button>
            <button
              type="button"
              className="a11y-option"
              aria-pressed={preferences.underlineLinks}
              onClick={() =>
                updatePreferences({ underlineLinks: !preferences.underlineLinks })
              }
            >
              <Underline aria-hidden="true" />
              <span>Sublinhar links</span>
            </button>
            <button
              type="button"
              className="a11y-option"
              aria-pressed={preferences.reduceMotion}
              onClick={() =>
                updatePreferences({ reduceMotion: !preferences.reduceMotion })
              }
            >
              <PauseCircle aria-hidden="true" />
              <span>Reduzir animações</span>
            </button>
          </div>

          <button
            type="button"
            className="a11y-panel__reset"
            onClick={() =>
              updatePreferences(DEFAULT_ACCESSIBILITY_PREFERENCES)
            }
            disabled={isDefault}
          >
            <RotateCcw aria-hidden="true" />
            Restaurar padrão
          </button>
        </div>
      ) : null}

      <button
        ref={toggleRef}
        type="button"
        className="a11y-widget__toggle"
        aria-expanded={isOpen}
        aria-controls="acessibilidade-painel"
        aria-label="Ajustes de acessibilidade"
        title="Ajustes de acessibilidade"
        onClick={() => setIsOpen((current) => !current)}
      >
        <Accessibility aria-hidden="true" />
      </button>
    </div>
  );
}
