"use client";

import { X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  COOKIE_CONSENT_EVENT,
  COOKIE_SETTINGS_OPEN_EVENT,
  DEFAULT_COOKIE_PREFERENCES,
  getCookieConsentSnapshot,
  OPTIONAL_COOKIE_CATEGORIES,
  parseCookieConsent,
  readCookieConsent,
  saveCookieConsent,
  type CookiePreferences,
} from "@/lib/cookie-consent";

function subscribe(onConsentChange: () => void) {
  window.addEventListener(COOKIE_CONSENT_EVENT, onConsentChange);
  return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsentChange);
}

export function CookieConsent() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getCookieConsentSnapshot,
    () => "__loading__",
  );
  const consent = parseCookieConsent(snapshot);
  const isVisible = snapshot !== "__loading__" && consent === null;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(
    DEFAULT_COOKIE_PREFERENCES,
  );
  const [saveError, setSaveError] = useState(false);

  const openSettings = useCallback(() => {
    setPreferences(readCookieConsent()?.preferences ?? DEFAULT_COOKIE_PREFERENCES);
    setSaveError(false);
    setIsSettingsOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener(COOKIE_SETTINGS_OPEN_EVENT, openSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_OPEN_EVENT, openSettings);
  }, [openSettings]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isSettingsOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isSettingsOpen && dialog.open) {
      dialog.close();
    }
  }, [isSettingsOpen]);

  const savePreferences = (nextPreferences: CookiePreferences) => {
    const saved = saveCookieConsent(nextPreferences);
    setSaveError(saved === null);

    if (saved) {
      setIsSettingsOpen(false);
    }
  };

  return (
    <>
      {isVisible ? (
        <aside
          className="cookie-consent"
          role="region"
          aria-label="Preferências de cookies"
        >
          <div className="cookie-consent__copy">
            <p className="cookie-consent__title">Preferências de cookies</p>
            <p>
              Usamos um cookie necessário para guardar sua escolha. Não há
              ferramentas de análise ou publicidade configuradas.
            </p>
            <a href="/politica-de-cookies">Leia a política de cookies</a>
          </div>
          <div className="cookie-consent__actions">
            <button
              type="button"
              onClick={() => savePreferences(DEFAULT_COOKIE_PREFERENCES)}
            >
              Recusar opcionais
            </button>
            <button type="button" onClick={openSettings}>
              Personalizar
            </button>
            <button
              type="button"
              onClick={() =>
                savePreferences({
                  necessary: true,
                  analytics: true,
                  marketing: true,
                })
              }
            >
              Aceitar todos
            </button>
          </div>
          {saveError ? (
            <p className="cookie-consent__error" role="alert">
              Não foi possível salvar sua escolha neste navegador. Verifique as
              configurações de cookies e tente novamente.
            </p>
          ) : null}
        </aside>
      ) : null}

      <dialog
        ref={dialogRef}
        className="cookie-preferences-dialog"
        aria-labelledby="cookie-preferences-title"
        onClose={() => setIsSettingsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setIsSettingsOpen(false);
          }
        }}
      >
        <div className="cookie-preferences-dialog__inner">
          <div className="cookie-preferences-dialog__head">
            <div>
              <p className="section-label">Privacidade</p>
              <h2 id="cookie-preferences-title">Preferências de cookies</h2>
            </div>
            <button
              type="button"
              className="cookie-preferences-dialog__close"
              onClick={() => setIsSettingsOpen(false)}
              aria-label="Fechar preferências de cookies"
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <p className="cookie-preferences-dialog__description">
            Cookies necessários guardam sua escolha e ficam sempre ativos. As
            categorias opcionais estão desativadas por padrão; no momento, não
            há serviços que as utilizem.
          </p>

          <fieldset className="cookie-preferences">
            <legend className="sr-only">Categorias de cookies</legend>
            <div className="cookie-preferences__item">
              <div>
                <p className="cookie-preferences__label">Necessários</p>
                <p className="cookie-preferences__detail">
                  Guardam o consentimento e a versão da política por até 180
                  dias.
                </p>
              </div>
              <label className="cookie-preferences__toggle">
                <span className="sr-only">Cookies necessários, sempre ativos</span>
                <input type="checkbox" checked disabled readOnly />
                <span aria-hidden="true" />
              </label>
            </div>

            {OPTIONAL_COOKIE_CATEGORIES.map((category) => (
              <div className="cookie-preferences__item" key={category.id}>
                <div>
                  <p className="cookie-preferences__label">{category.label}</p>
                  <p className="cookie-preferences__detail">
                    {category.description}
                  </p>
                </div>
                <label className="cookie-preferences__toggle">
                  <span className="sr-only">
                    Permitir {category.label.toLowerCase()}
                  </span>
                  <input
                    type="checkbox"
                    checked={preferences[category.id]}
                    onChange={(event) =>
                      setPreferences((current) => ({
                        ...current,
                        [category.id]: event.target.checked,
                      }))
                    }
                  />
                  <span aria-hidden="true" />
                </label>
              </div>
            ))}
          </fieldset>

          {saveError ? (
            <p className="cookie-consent__error" role="alert">
              Não foi possível salvar sua escolha neste navegador. Verifique as
              configurações de cookies e tente novamente.
            </p>
          ) : null}

          <div className="cookie-preferences-dialog__actions">
            <button
              type="button"
              onClick={() => savePreferences(DEFAULT_COOKIE_PREFERENCES)}
            >
              Rejeitar opcionais
            </button>
            <button type="button" onClick={() => savePreferences(preferences)}>
              Salvar escolhas
            </button>
            <button
              type="button"
              onClick={() =>
                savePreferences({
                  necessary: true,
                  analytics: true,
                  marketing: true,
                })
              }
            >
              Aceitar todos
            </button>
          </div>

          <a
            className="cookie-preferences-dialog__policy"
            href="/politica-de-cookies"
          >
            Consultar política de cookies
          </a>
        </div>
      </dialog>
    </>
  );
}

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      className="footer-policy-links__button"
      onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_OPEN_EVENT))}
    >
      Preferências de cookies
    </button>
  );
}
