"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { navItems } from "@/lib/content";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.sectionId))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-32% 0px -58% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    const panel = menuRef.current;
    const focusableElements = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    document.body.style.overflow = "hidden";
    firstElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = () => {
      if (mediaQuery.matches) {
        setOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="site-container site-header__inner">
          <Logo className="site-header__logo" />

          <nav className="site-nav" aria-label="Navegação principal">
            {navItems.map((item) => (
              <Link
                key={item.sectionId}
                href={item.href}
                className="site-nav__link"
                aria-current={
                  activeSection === item.sectionId ? "true" : undefined
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-header__actions">
            <ThemeSwitcher className="site-header__themes" />
            <Link
              href="/#contato"
              className="btn btn--primary site-header__cta"
            >
              <span>Iniciar projeto</span>
              <ArrowUpRight className="icon-arrow" aria-hidden="true" />
            </Link>
            <button
              ref={triggerRef}
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? (
                <X aria-hidden="true" />
              ) : (
                <Menu aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id="mobile-navigation"
          ref={menuRef}
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          <div className="site-container mobile-menu__top">
            <Logo
              className="mobile-menu__logo"
              showDescriptor={false}
              onClick={closeMenu}
            />
            <button
              type="button"
              className="menu-toggle"
              aria-label="Fechar menu"
              onClick={closeMenu}
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <div className="site-container mobile-menu__body">
            <nav aria-label="Navegação em dispositivos móveis">
              <ol className="mobile-nav">
                {navItems.map((item, index) => (
                  <li key={item.sectionId}>
                    <Link
                      href={item.href}
                      className="mobile-nav__link"
                      aria-current={
                        activeSection === item.sectionId ? "true" : undefined
                      }
                      onClick={closeMenu}
                    >
                      <span className="mobile-nav__index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mobile-nav__label">{item.label}</span>
                      <ArrowUpRight
                        className="mobile-nav__icon"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mobile-menu__footer">
              <div className="mobile-menu__theme">
                <span className="section-label">Tema</span>
                <ThemeSwitcher />
              </div>
              <Link
                href="/#contato"
                className="btn btn--primary mobile-menu__cta"
                onClick={closeMenu}
              >
                <span>Iniciar projeto</span>
                <ArrowUpRight className="icon-arrow" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
