"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ContactIntent = {
  solution: string;
  stamp: number;
};

type ContactIntentContextValue = {
  intent: ContactIntent | null;
  requestQuote: (solution: string) => void;
};

const ContactIntentContext = createContext<ContactIntentContextValue | null>(
  null,
);

export function ContactIntentProvider({ children }: { children: ReactNode }) {
  const [intent, setIntent] = useState<ContactIntent | null>(null);
  const counter = useRef(0);

  const requestQuote = useCallback((solution: string) => {
    counter.current += 1;
    setIntent({ solution, stamp: counter.current });

    const target = document.getElementById("contato");

    if (!target) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", "#contato");

    window.setTimeout(
      () => target.focus({ preventScroll: true }),
      reduceMotion ? 0 : 450,
    );
  }, []);

  const value = useMemo(
    () => ({ intent, requestQuote }),
    [intent, requestQuote],
  );

  return (
    <ContactIntentContext.Provider value={value}>
      {children}
    </ContactIntentContext.Provider>
  );
}

export function useContactIntent() {
  const context = useContext(ContactIntentContext);

  if (!context) {
    throw new Error(
      "useContactIntent deve ser usado dentro de ContactIntentProvider.",
    );
  }

  return context;
}
