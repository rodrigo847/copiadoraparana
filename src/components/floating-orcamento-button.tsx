"use client";

import { usePathname } from "next/navigation";

import { site } from "@/lib/site";

export function FloatingOrcamentoButton() {
  const pathname = usePathname();

  if (pathname === "/orcafacil-chat") {
    return null;
  }

  return (
    <a
      href={site.whatsappHref}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_10px_28px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-110 hover:shadow-[0_12px_32px_rgba(37,211,102,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#98e9b7] sm:bottom-6 sm:right-6 sm:h-16 sm:w-16 motion-safe:animate-[whatsappPulse_2s_infinite]"
      aria-label="Fale conosco pelo WhatsApp"
      title="Fale conosco pelo WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 sm:h-8 sm:w-8" fill="currentColor" aria-hidden="true">
        <path d="M19.11 17.23c-.27-.14-1.58-.78-1.82-.87-.24-.09-.42-.14-.6.14-.18.27-.69.87-.85 1.05-.15.18-.31.2-.58.07-.27-.14-1.12-.41-2.14-1.3-.79-.71-1.33-1.57-1.49-1.84-.15-.27-.02-.41.12-.54.12-.12.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.14-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46h-.51c-.18 0-.47.07-.72.34s-.94.92-.94 2.24.96 2.6 1.1 2.78c.14.18 1.89 2.88 4.57 4.04.64.27 1.14.44 1.53.57.64.2 1.22.17 1.68.1.51-.08 1.58-.65 1.8-1.28.22-.63.22-1.17.15-1.28-.06-.11-.24-.18-.51-.32Z" />
        <path d="M16.02 3.2c-6.99 0-12.66 5.65-12.66 12.62 0 2.23.59 4.4 1.71 6.3L3.2 28.8l6.85-1.79a12.71 12.71 0 0 0 5.97 1.52h.01c6.98 0 12.65-5.66 12.65-12.63 0-3.37-1.31-6.55-3.7-8.93A12.56 12.56 0 0 0 16.02 3.2Zm0 23.2h-.01a10.6 10.6 0 0 1-5.39-1.48l-.39-.23-4.06 1.06 1.08-3.95-.25-.4a10.48 10.48 0 0 1-1.62-5.58c0-5.78 4.73-10.49 10.56-10.49 2.82 0 5.47 1.09 7.46 3.07a10.41 10.41 0 0 1 3.09 7.42c0 5.79-4.74 10.5-10.47 10.58Z" />
      </svg>
    </a>
  );
}