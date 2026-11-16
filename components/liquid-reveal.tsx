"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  ACCESSIBILITY_CHANGE_EVENT,
  prefersReducedMotion,
} from "@/lib/accessibility";

const vertexSource = `attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const openingScrollDistance = 320;

const fragmentSource = `precision mediump float;
uniform float u_progress;
uniform vec3 u_color;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 point = vec2(uv.x, 1.0 - uv.y);
  float progress = clamp(u_progress, 0.0, 1.0);
  float aspect = u_resolution.x / u_resolution.y;
  vec2 center = vec2(0.5);
  vec2 scaledDelta = (point - center) * vec2(aspect, 1.0);
  float distanceFromCenter = length(scaledDelta);

  vec2 topLeft = (vec2(0.0, 0.0) - center) * vec2(aspect, 1.0);
  vec2 topRight = (vec2(1.0, 0.0) - center) * vec2(aspect, 1.0);
  vec2 bottomLeft = (vec2(0.0, 1.0) - center) * vec2(aspect, 1.0);
  vec2 bottomRight = (vec2(1.0, 1.0) - center) * vec2(aspect, 1.0);
  float maxRadius = max(
    max(length(topLeft), length(topRight)),
    max(length(bottomLeft), length(bottomRight))
  );
  float radius = mix(0.16, maxRadius + 0.12, pow(progress, 1.08));

  float angle = atan(scaledDelta.y, scaledDelta.x);
  float flow = fbm(scaledDelta * 3.4 + vec2(u_time * 0.03, -u_time * 0.02));
  float flow2 = fbm(scaledDelta * 7.2 - vec2(u_time * 0.02, u_time * 0.028));
  float pointerDistance = length((point - u_mouse) * vec2(aspect, 1.0));
  float pointerInfluence = exp(-pointerDistance * 7.0);
  float wobble = sin(angle * 2.0 + u_time * 0.35) * 0.02
    + sin(angle * 5.0 - u_time * 0.22 + flow * 3.14159) * 0.014;
  float organicEdge = radius
    + (flow - 0.5) * 0.18
    + (flow2 - 0.5) * 0.07
    + wobble
    + pointerInfluence * (flow - 0.5) * 0.03;
  float alpha = smoothstep(organicEdge - 0.022, organicEdge + 0.03, distanceFromCenter);

  gl_FragColor = vec4(u_color, alpha);
}`;

function parseColor(value: string): [number, number, number] {
  const trimmed = value.trim();
  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    const normalized =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => char + char)
            .join("")
        : hex;
    const int = parseInt(normalized, 16);
    return [
      ((int >> 16) & 255) / 255,
      ((int >> 8) & 255) / 255,
      (int & 255) / 255,
    ];
  }

  const match = trimmed.match(/rgba?\(([^)]+)\)/);
  if (match) {
    const parts = match[1].split(",").map((part) => parseFloat(part));
    return [parts[0] / 255, parts[1] / 255, parts[2] / 255];
  }

  return [0, 0, 0];
}

export function LiquidReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const markTextRef = useRef<HTMLSpanElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [hashVersion, setHashVersion] = useState(0);

  useEffect(() => {
    const syncHash = () => setHashVersion((version) => version + 1);

    window.addEventListener("hashchange", syncHash);

    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const prompt = promptRef.current;
    const mark = markRef.current;
    const markText = markTextRef.current;
    const fallback = fallbackRef.current;
    if (!canvas || !prompt || !mark || !markText || !fallback) return;

    const root = document.documentElement;
    const hash = window.location.hash;
    const introAllowed =
      pathname === "/" && (hash === "" || hash === "#inicio");
    const label = "<CODE_PH/>";
    let typingTimer: ReturnType<typeof setTimeout> | null = null;
    let typingIndex = 0;

    const stopTyping = () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
        typingTimer = null;
      }
    };

    const startTyping = () => {
      stopTyping();
      typingIndex = 1;
      markText.textContent = label.slice(0, 1);
      mark.dataset.typingDone = "false";
      const step = () => {
        typingIndex += 1;
        markText.textContent = label.slice(0, typingIndex);
        if (typingIndex < label.length) {
          typingTimer = setTimeout(step, 110);
        } else {
          mark.dataset.typingDone = "true";
          typingTimer = null;
        }
      };
      if (label.length > 1) {
        typingTimer = setTimeout(step, 180);
      } else {
        mark.dataset.typingDone = "true";
      }
    };

    const hideIntro = () => {
      stopTyping();
      canvas.style.display = "none";
      fallback.style.display = "none";
      prompt.style.visibility = "hidden";
      prompt.style.opacity = "0";
      mark.style.visibility = "hidden";
      mark.style.opacity = "0";
      root.dataset.intro = "off";
      root.style.removeProperty("--intro-progress");
    };

    if (prefersReducedMotion() || !introAllowed) {
      hideIntro();
      return;
    }

    root.dataset.intro = "on";

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const gl =
      (canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        premultipliedAlpha: false,
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) {
      root.dataset.introFallback = "on";
      root.dataset.intro = "on";
      canvas.style.display = "none";
      fallback.style.display = "block";

      let progress = Math.min(window.scrollY / openingScrollDistance, 1);
      const heroVisual = document.querySelector<HTMLElement>(".hero__visual");
      const heroRect = heroVisual?.getBoundingClientRect();
      const heroOffsetX = heroRect
        ? window.innerWidth / 2 - (heroRect.left + heroRect.width / 2)
        : 0;
      const heroOffsetY = heroRect
        ? window.innerHeight / 2 - (heroRect.top + heroRect.height / 2)
        : 0;

      const updateHeroVisual = () => {
        if (!heroVisual) return;
        const remaining = 1 - progress;
        root.style.setProperty("--intro-hero-x", `${heroOffsetX * remaining}px`);
        root.style.setProperty("--intro-hero-y", `${heroOffsetY * remaining}px`);
      };

      const updateUi = () => {
        root.style.setProperty("--intro-progress", String(progress));
        fallback.style.display = progress >= 0.98 ? "none" : "block";
        prompt.style.visibility = progress >= 0.12 ? "hidden" : "visible";
        prompt.style.opacity = String(Math.max(0, 1 - progress / 0.12));
        const markOpacity = Math.max(0, 1 - progress / 0.55);
        mark.style.opacity = String(markOpacity);
        mark.style.visibility = progress >= 0.98 ? "hidden" : "visible";
        mark.style.transform = `translate(-50%, -50%) scale(${1 + progress * 0.06})`;
      };

      startTyping();
      updateHeroVisual();
      updateUi();

      gsap.registerPlugin(ScrollTrigger);
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => ScrollTrigger.maxScroll(window) || 1,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress = Math.min(self.scroll() / openingScrollDistance, 1);
          updateHeroVisual();
          updateUi();
        },
      });

      return () => {
        stopTyping();
        trigger.kill();
        root.style.removeProperty("--intro-progress");
        root.style.removeProperty("--intro-hero-x");
        root.style.removeProperty("--intro-hero-y");
      };
    }

    let program: WebGLProgram | null = null;
    let vertexShader: WebGLShader | null = null;
    let fragmentShader: WebGLShader | null = null;
    const buffer = gl.createBuffer();

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Unable to create shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(info || "Shader compilation failed");
      }
      return shader;
    };

    try {
      if (!buffer) throw new Error("Unable to create WebGL buffer");

      vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
      fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
      program = gl.createProgram();
      if (!program) throw new Error("Unable to create WebGL program");

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "Program linking failed");
      }
    } catch (error) {
      console.error("LiquidReveal WebGL setup failed", error);
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      if (program) gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      canvas.style.display = "none";
      document.documentElement.dataset.introFallback = "on";
      document.documentElement.dataset.intro = "off";
      return;
    }

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uProgress = gl.getUniformLocation(program, "u_progress");
    const uColor = gl.getUniformLocation(program, "u_color");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    let progress = Math.min(window.scrollY / openingScrollDistance, 1);
    let mouseX = 0.5;
    let mouseY = 0.5;
    let disposed = false;
    let resourcesReleased = false;
    let rafId = 0;
    const startTime = performance.now();
    const heroVisual = document.querySelector<HTMLElement>(".hero__visual");
    const heroRect = heroVisual?.getBoundingClientRect();
    const heroOffsetX = heroRect
      ? window.innerWidth / 2 - (heroRect.left + heroRect.width / 2)
      : 0;
    const heroOffsetY = heroRect
      ? window.innerHeight / 2 - (heroRect.top + heroRect.height / 2)
      : 0;

    const updateHeroVisual = () => {
      if (!heroVisual) return;

      const remaining = 1 - progress;
      document.documentElement.style.setProperty(
        "--intro-hero-x",
        `${heroOffsetX * remaining}px`,
      );
      document.documentElement.style.setProperty(
        "--intro-hero-y",
        `${heroOffsetY * remaining}px`,
      );
    };

    const releaseResources = () => {
      if (resourcesReleased) return;
      resourcesReleased = true;
      if (program) gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };

    const resize = () => {
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        window.innerWidth < 768 ? 1 : 1.25,
      );
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const width = Math.floor(viewportWidth * dpr);
      const height = Math.floor(viewportHeight * dpr);
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;
      gl.viewport(0, 0, width, height);
      if (uResolution) gl.uniform2f(uResolution, width, height);
    };

    const updateColor = () => {
      const value = getComputedStyle(document.documentElement).getPropertyValue(
        "--fg",
      );
      const [r, g, b] = parseColor(value);
      if (uColor) gl.uniform3f(uColor, r, g, b);
    };

    const draw = () => {
      rafId = 0;
      if (disposed) return;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (uProgress) gl.uniform1f(uProgress, progress);
      if (uTime) gl.uniform1f(uTime, (performance.now() - startTime) / 1000);
      if (uMouse) gl.uniform2f(uMouse, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!disposed && progress < 0.98) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const requestDraw = () => {
      if (!rafId && !disposed && progress < 0.98) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const updateMouse = (event: PointerEvent) => {
      mouseX = event.clientX / Math.max(1, window.innerWidth);
      mouseY = event.clientY / Math.max(1, window.innerHeight);
      requestDraw();
    };

    resize();
    updateColor();
    updateHeroVisual();
    const updateIntroUi = () => {
      canvas.style.display = progress >= 0.98 ? "none" : "block";
      if (prompt) {
        prompt.style.visibility = progress >= 0.12 ? "hidden" : "visible";
        prompt.style.opacity = String(Math.max(0, 1 - progress / 0.12));
      }
      if (mark) {
        const markOpacity = Math.max(0, 1 - progress / 0.55);
        mark.style.opacity = String(markOpacity);
        mark.style.visibility = progress >= 0.98 ? "hidden" : "visible";
        mark.style.transform = `translate(-50%, -50%) scale(${1 + progress * 0.06})`;
      }
    };
    updateIntroUi();

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: () => ScrollTrigger.maxScroll(window) || 1,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progress = Math.min(self.scroll() / openingScrollDistance, 1);
        updateHeroVisual();
        updateIntroUi();
        requestDraw();
        if (progress >= 0.98 && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
    });

    const handleResize = () => {
      resize();
      requestDraw();
    };
    const themeObserver = new MutationObserver(() => {
      updateColor();
      requestDraw();
    });
    const stopForReducedMotion = () => {
      disposed = true;
      stopTyping();
      canvas.style.display = "none";
      document.documentElement.style.removeProperty("--intro-hero-x");
      document.documentElement.style.removeProperty("--intro-hero-y");
      if (prompt) {
        prompt.style.visibility = "hidden";
        prompt.style.opacity = "0";
      }
      if (mark) {
        mark.style.visibility = "hidden";
        mark.style.opacity = "0";
      }
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", updateMouse);
      window.removeEventListener("resize", handleResize);
      themeObserver.disconnect();
      trigger.kill();
      releaseResources();
    };
    const handleMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) stopForReducedMotion();
    };
    const handleAccessibilityChange = () => {
      if (prefersReducedMotion()) stopForReducedMotion();
    };

    window.addEventListener("pointermove", updateMouse, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener(
      ACCESSIBILITY_CHANGE_EVENT,
      handleAccessibilityChange,
    );
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    motionPreference.addEventListener("change", handleMotionChange);
    requestDraw();

    return () => {
      disposed = true;
      stopTyping();
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", updateMouse);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener(
        ACCESSIBILITY_CHANGE_EVENT,
        handleAccessibilityChange,
      );
      motionPreference.removeEventListener("change", handleMotionChange);
      themeObserver.disconnect();
      trigger.kill();
      document.documentElement.style.removeProperty("--intro-hero-x");
      document.documentElement.style.removeProperty("--intro-hero-y");
      releaseResources();
    };
  }, [pathname, hashVersion]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100dvh",
          zIndex: 90,
          pointerEvents: "none",
          display: "none",
        }}
      />
      <div
        ref={fallbackRef}
        className="liquid-intro-fallback"
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100dvh",
          zIndex: 90,
          pointerEvents: "none",
          display: "none",
        }}
      />
      <div
        ref={markRef}
        className="liquid-intro-mark"
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          zIndex: 89,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          userSelect: "none",
          opacity: 0,
          visibility: "hidden",
          transition: "opacity 0.12s linear",
          willChange: "transform, opacity",
          color: "var(--fg)",
          fontFamily: "var(--font-mono-code), monospace",
          fontSize: "clamp(1rem, 6vw, 3rem)",
          fontWeight: 500,
          letterSpacing: "0.06em",
          lineHeight: 1,
          whiteSpace: "nowrap",
          maxWidth: "92vw",
          textAlign: "center",
        }}
      >
        <span ref={markTextRef} className="liquid-intro-mark__text" />
        <span className="liquid-intro-mark__cursor" aria-hidden="true">
          |
        </span>
      </div>
      <div
        ref={promptRef}
        className="liquid-scroll-prompt"
        aria-hidden="true"
        style={{
          position: "fixed",
          zIndex: 91,
          right: "1rem",
          bottom: "clamp(1.25rem, 4vh, 2.4rem)",
          left: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.65rem",
          color: "var(--bg)",
          fontFamily: "var(--font-mono-code), monospace",
          fontSize: "0.58rem",
          letterSpacing: "0.15em",
          lineHeight: 1.5,
          textAlign: "center",
          textTransform: "uppercase",
          pointerEvents: "none",
          transition: "opacity 0.2s ease",
          opacity: 0,
          visibility: "hidden",
        }}
      >
        <span>Role a página para explorar</span>
        <svg
          className="liquid-scroll-prompt__arrow"
          width="16"
          height="20"
          viewBox="0 0 16 20"
          fill="none"
        >
          <path
            d="M8 1V18M2 12L8 18L14 12"
            stroke="currentColor"
            strokeWidth="1.25"
          />
        </svg>
      </div>
    </>
  );
}
