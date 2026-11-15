"use client";

import { useEffect, useRef } from "react";

const spotSize = 32;

export function CursorSpot() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const hoverPointer = window.matchMedia("(hover: hover)");
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let active =
      finePointer.matches && hoverPointer.matches && !motionPreference.matches;
    let visible = false;

    const hide = () => {
      if (!visible) return;
      visible = false;
      spot.style.opacity = "0";
    };

    const updatePointer = (event: PointerEvent) => {
      if (!active || event.pointerType !== "mouse") return;

      spot.style.transform = `translate3d(${event.clientX - spotSize / 2}px, ${event.clientY - spotSize / 2}px, 0)`;
      spot.style.visibility = "visible";
      spot.style.opacity = "1";
      visible = true;
    };

    const updateAvailability = () => {
      active =
        finePointer.matches &&
        hoverPointer.matches &&
        !motionPreference.matches;
      if (!active) {
        visible = false;
        spot.style.opacity = "0";
        spot.style.visibility = "hidden";
      }
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("pointerleave", hide);
    finePointer.addEventListener("change", updateAvailability);
    hoverPointer.addEventListener("change", updateAvailability);
    motionPreference.addEventListener("change", updateAvailability);

    return () => {
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
      finePointer.removeEventListener("change", updateAvailability);
      hoverPointer.removeEventListener("change", updateAvailability);
      motionPreference.removeEventListener("change", updateAvailability);
    };
  }, []);

  return (
    <div
      ref={spotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 95,
        width: spotSize,
        height: spotSize,
        borderRadius: "50%",
        backgroundColor: "#fff",
        mixBlendMode: "difference",
        pointerEvents: "none",
        opacity: 0,
        visibility: "hidden",
        transition:
          "transform 0.16s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.12s ease",
      }}
    />
  );
}
