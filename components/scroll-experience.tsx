"use client";

import { useEffect } from "react";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  ACCESSIBILITY_CHANGE_EVENT,
  prefersReducedMotion,
} from "@/lib/accessibility";

export function ScrollExperience() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const revealSelector =
      "[data-reveal]:not(.hero__visual), [data-reveal-line] > span, [data-reveal-image]";
    const triggers: ScrollTrigger[] = [];
    let revealTargets: HTMLElement[] = [];
    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;
    let ready = false;
    let loadFrame = 0;
    let hydrationFrame = 0;
    let hydrationDeadline = 0;

    const collectTargets = () =>
      [...document.querySelectorAll<HTMLElement>(revealSelector)].filter(
        (target) => target.getBoundingClientRect().top >= window.innerHeight,
      );

    const prepareTargets = () => {
      revealTargets = collectTargets();
    };

    // React only attaches its fiber props once a subtree has hydrated. GSAP must
    // not touch nodes before that or React reports hydration attribute diffs.
    const isHydrated = (node: HTMLElement) => {
      for (const key in node) {
        if (key.startsWith("__reactFiber$")) return true;
      }

      return false;
    };

    const waitForHydration = () => {
      const targets = collectTargets();
      const hydrated = targets.every(isHydrated);
      const expired = performance.now() > hydrationDeadline;

      if (hydrated || expired || targets.length === 0) {
        start();
        return;
      }

      hydrationFrame = requestAnimationFrame(waitForHydration);
    };

    const stop = () => {
      if (ticker) gsap.ticker.remove(ticker);
      ticker = null;
      lenis?.destroy();
      lenis = null;
      triggers.forEach((trigger) => trigger.kill());
      if (revealTargets.length > 0) {
        gsap.set(revealTargets, { clearProps: "transform,opacity" });
      }
      gsap.ticker.lagSmoothing(500, 33);
    };

    const start = () => {
      if (prefersReducedMotion() || lenis) return;

      prepareTargets();

      lenis = new Lenis({ smoothWheel: true, syncTouch: false });
      lenis.on("scroll", ScrollTrigger.update);
      ticker = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      gsap.set(revealTargets, { opacity: 0 });

      revealTargets.forEach((target) => {
        const setY = gsap.quickSetter(target, "y", "px");
        const setX = gsap.quickSetter(target, "x", "px");
        const setOpacity = gsap.quickSetter(target, "opacity");
        const projectItem = target.hasAttribute("data-project-item")
          ? target
          : target.closest<HTMLElement>("[data-project-item]");
        const projectIndex = Number(projectItem?.dataset.projectIndex);
        const isProject = Boolean(projectItem) && Number.isFinite(projectIndex);
        let horizontalOffset = 0;
        if (isProject && target.hasAttribute("data-project-item")) {
          horizontalOffset = projectIndex % 2 === 0 ? 36 : -36;
        } else if (isProject && target.hasAttribute("data-reveal-image")) {
          horizontalOffset = projectIndex % 2 === 0 ? -56 : 56;
        }
        const verticalOffset = target.hasAttribute("data-reveal-image") ? 24 : 40;
        const updateReveal = (progress: number) => {
          const remaining = 1 - progress;
          setY(verticalOffset * remaining);
          if (horizontalOffset !== 0) setX(horizontalOffset * remaining);
          setOpacity(progress);
        };
        const trigger = ScrollTrigger.create({
          trigger: target,
          start: "top 96%",
          end: "top 72%",
          onUpdate: (self) => {
            updateReveal(self.progress);
          },
        });
        updateReveal(trigger.progress);
        triggers.push(trigger);
      });

      ScrollTrigger.refresh();
    };

    const handleMotionChange = () => {
      if (!ready) return;

      if (prefersReducedMotion()) {
        stop();
      } else {
        start();
      }
    };

    const begin = () => {
      if (ready) return;
      ready = true;
      hydrationDeadline = performance.now() + 4000;
      loadFrame = requestAnimationFrame(() => {
        loadFrame = requestAnimationFrame(() => {
          loadFrame = 0;
          waitForHydration();
        });
      });
    };
    const handleLoad = () => begin();

    if (document.readyState === "complete") {
      begin();
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }

    motionPreference.addEventListener("change", handleMotionChange);
    window.addEventListener(ACCESSIBILITY_CHANGE_EVENT, handleMotionChange);

    return () => {
      window.removeEventListener("load", handleLoad);
      cancelAnimationFrame(loadFrame);
      cancelAnimationFrame(hydrationFrame);
      motionPreference.removeEventListener("change", handleMotionChange);
      window.removeEventListener(ACCESSIBILITY_CHANGE_EVENT, handleMotionChange);
      stop();
    };
  }, []);

  return null;
}
