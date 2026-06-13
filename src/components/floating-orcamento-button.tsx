"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingOrcamentoButton() {
  const pathname = usePathname();

  if (pathname === "/orcafacil-chat") {
    return null;
  }

  return (
    <Link
      href="/orcafacil-chat"
      className="fixed bottom-5 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-[#5e98df] bg-[#1f84ff] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(13,72,150,0.45)] transition hover:bg-[#136edc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9d6ff] sm:bottom-6 sm:right-6"
      aria-label="Abrir Orçamento Virtual"
      title="Abrir Orçamento Virtual"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      </svg>
      <span>Orçamento Virtual</span>
    </Link>
  );
}