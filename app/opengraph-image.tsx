import { ImageResponse } from "next/og";

export const alt =
  "CODE_PH — Tecnologia que transforma ideias em experiências digitais";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#080808",
          color: "#f5f5f1",
          padding: "64px 72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: "0.16em",
            color: "rgba(245,245,241,0.55)",
          }}
        >
          <span>CODE_PH</span>
          <span>ASSISTÊNCIA TÉCNICA &amp; SOLUÇÕES DIGITAIS</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              letterSpacing: "0.14em",
              color: "rgba(245,245,241,0.72)",
            }}
          >
            TECNOLOGIA / ESTRATÉGIA / DESENVOLVIMENTO
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              lineHeight: 1.02,
              letterSpacing: "-0.045em",
              maxWidth: 990,
              fontWeight: 600,
            }}
          >
            TECNOLOGIA QUE TRANSFORMA IDEIAS EM EXPERIÊNCIAS DIGITAIS.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(245,245,241,0.18)",
            paddingTop: 24,
            fontSize: 22,
            letterSpacing: "0.1em",
            color: "rgba(245,245,241,0.55)",
          }}
        >
          <span>SITES / SISTEMAS / AUTOMAÇÃO</span>
          <span>CODE_PH / DIGITAL EXPERIENCE</span>
        </div>

        <div
          style={{
            position: "absolute",
            right: -140,
            bottom: -260,
            width: 620,
            height: 620,
            border: "1px solid rgba(245,245,241,0.18)",
            borderRadius: "50%",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -10,
            bottom: -390,
            width: 620,
            height: 620,
            border: "1px solid rgba(245,245,241,0.1)",
            borderRadius: "50%",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
