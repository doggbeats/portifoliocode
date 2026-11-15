"use client";

import { useEffect } from "react";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollExperience() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const revealTargets = [
      ...document.querySelectorAll<HTMLElement>(
        "[data-reveal]:not(.hero__visual), [data-reveal-line] > span, [data-reveal-image]",
      ),
    ].filter((target) => target.getBoundingClientRect().top >= window.innerHeight);
    const triggers: ScrollTrigger[] = [];
    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;

    const stop = () => {
      if (ticker) gsap.ticker.remove(ticker);
      ticker = null;
      lenis?.destroy();
      lenis = null;
      triggers.forEach((trigger) => trigger.kill());
      if (revealTargets.length > 0) {
        gsap.set(revealTargets, { clearProps: "transform" });
      }
      gsap.ticker.lagSmoothing(500, 33);
    };

    const start = () => {
      if (motionPreference.matches || lenis) return;

      lenis = new Lenis({ smoothWheel: true, syncTouch: false });
      lenis.on("scroll", ScrollTrigger.update);
      ticker = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      revealTargets.forEach((target) => {
        const setY = gsap.quickSetter(target, "y", "px");
        const setX = gsap.quickSetter(target, "x", "px");
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
        const trigger = ScrollTrigger.create({
          trigger: target,
          start: "top 96%",
          end: "top 72%",
          onUpdate: (self) => {
            const remaining = 1 - self.progress;
            setY(verticalOffset * remaining);
            if (horizontalOffset !== 0) setX(horizontalOffset * remaining);
          },
        });
        triggers.push(trigger);
      });

      ScrollTrigger.refresh();
    };

    const handleMotionChange = () => {
      if (motionPreference.matches) {
        stop();
      } else {
        start();
      }
    };

    start();
    motionPreference.addEventListener("change", handleMotionChange);

    return () => {
      motionPreference.removeEventListener("change", handleMotionChange);
      stop();
    };
  }, []);

  return null;
}
