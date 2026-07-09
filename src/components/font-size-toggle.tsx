"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "a11y-font-size";
const HTML_CLASS = "a11y-font-large";

export function FontSizeToggle() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(STORAGE_KEY) === "on";
  });

  useEffect(() => {
    document.documentElement.classList.toggle(HTML_CLASS, enabled);
  }, [enabled]);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    document.documentElement.classList.toggle(HTML_CLASS, next);
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Desativar fonte maior" : "Ativar fonte maior"}
      className="fixed bottom-4 left-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#8cb7ef] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(236,246,255,0.95))] text-base font-bold text-[#0f4f9f] shadow-[0_12px_30px_rgba(7,45,91,0.22)] transition hover:-translate-y-0.5 hover:border-[#6f9ddd] hover:text-[#083a79] active:translate-y-0 sm:bottom-6 sm:left-6 sm:h-16 sm:w-16"
    >
      {enabled ? "A-" : "A+"}
    </button>
  );
}
