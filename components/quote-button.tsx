"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { useContactIntent } from "@/components/contact-intent-provider";

type QuoteButtonProps = {
  solution: string;
  children: ReactNode;
  className?: string;
};

export function QuoteButton({
  solution,
  children,
  className = "link-arrow",
}: QuoteButtonProps) {
  const { requestQuote } = useContactIntent();

  return (
    <Link
      href="/#contato"
      className={className}
      data-solution={solution}
      onClick={(event) => {
        event.preventDefault();
        requestQuote(solution);
      }}
    >
      <span>{children}</span>
      <ArrowUpRight className="icon-arrow" aria-hidden="true" />
    </Link>
  );
}
