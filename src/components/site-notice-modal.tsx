"use client";

import { useEffect, useRef, useState } from "react";

type SiteNoticeModalProps = {
  enabled?: boolean;
};

export function SiteNoticeModal({ enabled = false }: SiteNoticeModalProps) {
  const [isOpen, setIsOpen] = useState(enabled);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!enabled || !isOpen || !dialog) {
      return;
    }

    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [enabled, isOpen]);

  if (!enabled || !isOpen) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={() => setIsOpen(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          setIsOpen(false);
        }
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh_-_3rem)] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-3xl border border-[#18457f] bg-white p-0 text-[#071427] shadow-2xl backdrop:bg-[#041022]/80 backdrop:backdrop-blur-sm"
      aria-modal="true"
      aria-labelledby="site-notice-title"
      aria-describedby="site-notice-description"
    >
      <div className="relative bg-linear-to-br from-[#082249] to-[#13427e] px-6 pt-8 pb-6 sm:px-8">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#071427]/85 text-2xl leading-none text-white transition hover:bg-[#0c57d0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f79ff]"
          aria-label="Fechar aviso de atendimento"
          title="Fechar aviso"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <p className="pr-12 text-xs font-bold uppercase tracking-[0.18em] text-[#afd0ff]">
          Comunicado importante
        </p>
        <h2
          id="site-notice-title"
          className="mt-3 font-heading text-3xl font-bold tracking-tight text-white"
        >
          Novo horário de atendimento
        </h2>
      </div>
      <div className="space-y-5 p-6 sm:p-8">
        <div id="site-notice-description" className="space-y-3 text-base leading-7">
          <p>
            A partir de <strong>7 de novembro de 2026</strong>, não abriremos mais
            aos <strong>sábados</strong>.
          </p>
          <p>
            A mudança ocorre devido à adoção da escala de trabalho{" "}
            <strong>5x2</strong>.
          </p>
        </div>
        <div className="rounded-2xl border border-[#c9def7] bg-[#f0f6ff] p-4 text-center">
          <p className="font-semibold text-[#0c2e5e]">Segunda a sexta-feira</p>
          <p className="mt-1 text-2xl font-bold text-[#0c57d0]">9h às 18h</p>
        </div>
        <p className="text-center text-sm text-[#3f526b]">
          Agradecemos a compreensão!
        </p>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="w-full rounded-md bg-[#0c57d0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0846ab] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f79ff]"
        >
          Fechar aviso
        </button>
      </div>
    </dialog>
  );
}