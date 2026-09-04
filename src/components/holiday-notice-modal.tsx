"use client";

import Image from "next/image";
import { useState } from "react";

export function HolidayNoticeModal() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#041022]/80 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="holiday-notice-title"
    >
      <div className="relative w-fit max-w-full overflow-hidden rounded-lg bg-white shadow-2xl">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#071427]/85 text-2xl leading-none text-white transition hover:bg-[#0c57d0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f79ff]"
          aria-label="Fechar aviso de feriado"
          title="Fechar aviso"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <Image
          src="/img/feriado.jpeg"
          alt="Aviso de feriado e fechamento da Paraná Laser Copy"
          width={1200}
          height={1200}
          priority
          sizes="(max-width: 640px) calc(100vw - 2rem), 36rem"
          className="block max-h-[68vh] w-auto max-w-full object-contain"
        />
        <div className="p-4 sm:p-5">
          <h2 id="holiday-notice-title" className="sr-only">
            Aviso de feriado
          </h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full rounded-md bg-[#0c57d0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0846ab] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f79ff]"
          >
            Fechar aviso
          </button>
        </div>
      </div>
    </div>
  );
}