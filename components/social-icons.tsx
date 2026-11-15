import type { SVGProps } from "react";

type SocialIconProps = SVGProps<SVGSVGElement>;

export function InstagramIcon(props: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon(props: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      focusable="false"
      {...props}
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h3.96V21H3V9.75Zm7.02 0h3.79v1.54h.05c.53-.95 1.82-1.95 3.75-1.95 4.01 0 4.75 2.5 4.75 5.76V21h-3.96v-4.9c0-1.17-.02-2.67-1.71-2.67-1.71 0-1.97 1.27-1.97 2.58V21h-3.7V9.75Z" />
    </svg>
  );
}

export function GitHubIcon(props: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      focusable="false"
      {...props}
    >
      <path d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.49.09.67-.21.67-.47v-1.7c-2.72.59-3.3-1.16-3.3-1.16-.45-1.14-1.1-1.44-1.1-1.44-.9-.61.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.88 1.52 2.32 1.08 2.89.82.09-.64.35-1.08.63-1.33-2.17-.25-4.45-1.09-4.45-4.84 0-1.07.38-1.94 1.01-2.63-.1-.25-.44-1.25.1-2.6 0 0 .82-.26 2.7 1a9.3 9.3 0 0 1 4.9 0c1.87-1.26 2.69-1 2.69-1 .54 1.35.2 2.35.1 2.6.63.69 1.01 1.56 1.01 2.63 0 3.76-2.29 4.58-4.47 4.83.36.31.68.92.68 1.85v2.74c0 .26.18.57.68.47A9.8 9.8 0 0 0 12 2.2Z" />
    </svg>
  );
}
