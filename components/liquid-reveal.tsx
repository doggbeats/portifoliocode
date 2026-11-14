"use client";

import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const vertexSource = `attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

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
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float y = 1.0 - uv.y;
  float p = clamp(u_progress, 0.0, 1.0);

  if (p <= 0.001) {
    gl_FragColor = vec4(u_color, 1.0);
    return;
  }
  if (p >= 0.999) {
    gl_FragColor = vec4(u_color, 0.0);
    return;
  }

  vec2 m = u_mouse;
  float dist = distance(uv, m);
  float push = smoothstep(0.35, 0.0, dist) * 0.12;

  float t = u_time * 0.15;
  vec2 q = uv + vec2(sin(t + uv.y * 4.0), cos(t + uv.x * 4.0)) * 0.03;
  q += (uv - m) * push;

  float n = fbm(q * 3.0 + vec2(0.0, p * 2.0 + t));
  float cn = (n - 0.5) * 2.0;
  float amp = 0.18;
  float front = p * 1.28 - 0.14 + cn * amp;
  float edge = 0.07;
  float alpha = 1.0 - smoothstep(front - edge, front + edge, y);

  float n2 = fbm(q * 6.0 - vec2(p * 1.5, t * 0.5));
  alpha *= 0.85 + 0.15 * n2;
  alpha = clamp(alpha, 0.0, 1.0);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.style.display = "none";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const gl =
      (canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false }) as
        | WebGLRenderingContext
        | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) return;

    canvas.style.display = "block";

    let disposed = false;
    let progress = 0;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(info || "shader compile failed");
      }
      return shader;
    };

    let program: WebGLProgram | null = null;
    const buffer = gl.createBuffer();

    try {
      const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
      program = gl.createProgram();
      if (!program) throw new Error("program");
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "link failed");
      }
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    } catch (error) {
      console.error("LiquidReveal shader error", error);
      canvas.style.display = "none";
      return;
    }

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

    const updateColor = () => {
      const value = getComputedStyle(document.documentElement).getPropertyValue("--fg");
      const [r, g, b] = parseColor(value);
      if (uColor) gl.uniform3f(uColor, r, g, b);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.floor(window.innerWidth * dpr);
      const height = Math.floor(window.innerHeight * dpr);
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, width, height);
      if (uResolution) gl.uniform2f(uResolution, width, height);
    };

    const startTime = performance.now();

    let mouseX = 0.5;
    let mouseY = 0.5;

    const updateMouse = (event: PointerEvent) => {
      mouseX = event.clientX / Math.max(1, window.innerWidth);
      mouseY = 1 - event.clientY / Math.max(1, window.innerHeight);
    };
    window.addEventListener("pointermove", updateMouse);

    const render = () => {
      if (disposed) return;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (uProgress) gl.uniform1f(uProgress, progress);
      if (uTime) gl.uniform1f(uTime, (performance.now() - startTime) / 1000);
      if (uMouse) gl.uniform2f(uMouse, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    resize();
    updateColor();

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progress = self.progress;
      },
    });

    let rafId = 0;
    const loop = () => {
      if (disposed) return;
      render();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const handleResize = () => {
      resize();
    };
    window.addEventListener("resize", handleResize);

    const themeObserver = new MutationObserver(() => {
      updateColor();
      render();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        disposed = true;
        canvas.style.display = "none";
        trigger.kill();
      }
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", updateMouse);
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", handleMotionChange);
      themeObserver.disconnect();
      trigger.kill();
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
      const loseContext = gl.getExtension("WEBGL_lose_context");
      if (loseContext) loseContext.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 90,
        pointerEvents: "none",
        display: "none",
      }}
    />
  );
}

