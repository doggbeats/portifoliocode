export function HeroVisual() {
  return (
    <div className="hero-visual" data-liquid-stage aria-hidden="true">
      <div className="hero-visual__head">
        <span>CP / EXPERIENCE</span>
        <span>001</span>
      </div>

      <div className="hero-visual__stage">
        <div className="hero-visual__grid" />

        <svg
          className="hero-visual__svg"
          viewBox="0 0 420 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="hero-sphere" cx="50%" cy="46%" r="52%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.11" />
              <stop offset="62%" stopColor="currentColor" stopOpacity="0.03" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g opacity="0.34">
            <path d="M28 62V28H62" stroke="currentColor" />
            <path d="M358 28H392V62" stroke="currentColor" />
            <path d="M28 458V492H62" stroke="currentColor" />
            <path d="M358 492H392V458" stroke="currentColor" />
          </g>

          <g transform="translate(210 258)">
            <circle r="158" fill="url(#hero-sphere)" />
            <circle r="158" stroke="currentColor" opacity="0.58" />
            <circle
              r="188"
              stroke="currentColor"
              strokeDasharray="1 7"
              opacity="0.44"
            />

            <g stroke="currentColor" opacity="0.5">
              <ellipse rx="158" ry="56" />
              <ellipse rx="158" ry="103" />
              <ellipse rx="56" ry="158" />
              <ellipse rx="103" ry="158" />
              <path d="M-158 0H158" />
              <path d="M0-158V158" />
            </g>

            <g stroke="currentColor" opacity="0.24">
              <ellipse rx="158" ry="26" />
              <ellipse rx="158" ry="80" />
              <ellipse rx="158" ry="130" />
              <ellipse rx="26" ry="158" />
              <ellipse rx="80" ry="158" />
              <ellipse rx="130" ry="158" />
            </g>

            <path
              d="M-158 0A158 158 0 0 1 158 0"
              stroke="currentColor"
              strokeDasharray="4 7"
              opacity="0.62"
            />

            <circle r="8" fill="currentColor" />
            <circle r="20" stroke="currentColor" opacity="0.5" />

            <g fill="currentColor">
              <circle cx="112" cy="-89" r="3.5" />
              <circle cx="-137" cy="62" r="2.5" />
              <circle cx="42" cy="151" r="2" />
            </g>
          </g>

          <g
            fill="currentColor"
            fontFamily="var(--font-mono-code)"
            fontSize="9"
            letterSpacing="1.6"
            opacity="0.7"
          >
            <text x="44" y="242">
              SYSTEM
            </text>
            <text x="44" y="258">
              / 01
            </text>
            <text x="303" y="242">
              WEB
            </text>
            <text x="303" y="258">
              / 02
            </text>
          </g>

          <g stroke="currentColor" opacity="0.4">
            <path d="M210 52V72" />
            <path d="M210 444V464" />
            <path d="M54 258H74" />
            <path d="M346 258H366" />
          </g>
        </svg>

        <span className="hero-visual__number">01</span>
        <span className="hero-visual__caption">
          Superfície interativa / CODE_PH
        </span>
      </div>

      <div className="hero-visual__foot">
        <span>Web</span>
        <span>Sistemas</span>
        <span>Automação</span>
      </div>
    </div>
  );
}
