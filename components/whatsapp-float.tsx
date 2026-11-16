import { getWhatsAppUrl } from "@/lib/site";

export function WhatsAppFloat() {
  const whatsappUrl = getWhatsAppUrl(
    "Olá! Vim pelo site da CODE_PH e gostaria de conversar sobre um projeto.",
  );

  if (!whatsappUrl) {
    return null;
  }

  return (
    <a
      href={whatsappUrl}
      className="whatsapp-float"
      aria-label="Fale conosco pelo WhatsApp"
      title="Fale conosco pelo WhatsApp"
      target="_blank"
      rel="noreferrer"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M20.52 3.48A11.87 11.87 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.16 1.6 5.98L.05 24l6.24-1.64a11.9 11.9 0 0 0 5.78 1.48h.01c6.58 0 11.93-5.35 11.93-11.93a11.87 11.87 0 0 0-3.49-8.43ZM12.08 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.7.97.99-3.61-.23-.37a9.9 9.9 0 0 1-1.52-5.27c0-5.46 4.44-9.9 9.9-9.9a9.84 9.84 0 0 1 7.01 2.91 9.84 9.84 0 0 1 2.9 7c0 5.46-4.44 9.9-9.9 9.9Zm5.43-7.41c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"
        />
      </svg>
    </a>
  );
}
