"use client";

import { useState } from "react";

import Image from "next/image";

type CopyWhatsappCardProps = {
  whatsappDisplay: string;
};

export function CopyWhatsappCard({ whatsappDisplay }: CopyWhatsappCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(whatsappDisplay);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex w-full items-center gap-3 rounded-2xl border border-[#4f7eb5] bg-[linear-gradient(180deg,rgba(31,132,255,0.24),rgba(16,83,166,0.18))] px-3 py-3 text-left transition hover:border-[#86b8f5] hover:bg-[linear-gradient(180deg,rgba(31,132,255,0.32),rgba(16,83,166,0.24))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86b8f5]"
      aria-label={`Copiar número do WhatsApp ${whatsappDisplay}`}
      title={copied ? "Número copiado" : "Clique para copiar o número"}
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/14 text-[#d9ebff]">
        <Image src="/img/Whats.png" alt="" width={20} height={20} aria-hidden="true" className="h-5 w-5 object-contain" />
      </span>
      <span>
        <span className="block text-xs uppercase tracking-[0.12em] text-[#c9e2ff]">WhatsApp</span>
        <span className="block font-heading text-xl font-bold text-white">{whatsappDisplay}</span>
        <span className="mt-1 block text-xs font-semibold text-[#d8ecff]">{copied ? "Número copiado" : "Clique para copiar o número"}</span>
      </span>
    </button>
  );
}