"use client";

import { useEffect, useState } from "react";

const notices = [
  {
    title: "Férias coletivas",
    description:
      "Estaremos em férias coletivas: \n18 de dezembro de 2026 a \n14 de janeiro de 2027.",
  },
  {
    title: "Sábados fechado!",
    description:
      "Atendimento segunda a sexta, \ndas 9h às 18h.",
  },
];

export function RotatingSiteNotice() {
  const [noticeIndex, setNoticeIndex] = useState(0);
  const notice = notices[noticeIndex];
  const isHolidayNotice = noticeIndex === 0;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNoticeIndex((currentIndex) => (currentIndex + 1) % notices.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [noticeIndex]);

  return (
    <aside
      aria-label={`Aviso: ${notice.title}`}
      className={`relative mt-8 flex shrink-0 items-center gap-3 overflow-hidden rounded-2xl border px-4 py-4 transition-colors duration-500 sm:gap-4 ${
        isHolidayNotice
          ? "border-amber-200/35 bg-[linear-gradient(110deg,rgba(251,191,36,0.12),rgba(255,255,255,0.025))]"
          : "border-cyan-200/35 bg-[linear-gradient(110deg,rgba(34,211,238,0.14),rgba(255,255,255,0.025))]"
      }`}
    >
      <svg
        className={`pointer-events-none order-last h-14 w-14 shrink-0 opacity-20 sm:h-20 sm:w-20 ${
          isHolidayNotice ? "text-amber-100" : "text-cyan-100"
        }`}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        {isHolidayNotice ? (
          <>
            <rect x="22" y="34" width="56" height="48" rx="8" />
            <path d="M37 34v-8a7 7 0 017-7h12a7 7 0 017 7v8M22 51h56M36 50v9m28-9v9M34 82v5m32-5v5" />
          </>
        ) : (
          <>
            <rect x="19" y="25" width="62" height="59" rx="7" />
            <path d="M34 18v14M66 18v14M19 42h62M31 54h.01M48 54h.01M65 54h.01M31 68h.01M48 68h.01" />
            <circle cx="66" cy="69" r="9" />
            <path d="m62 65 8 8m0-8-8 8" />
          </>
        )}
      </svg>
      <div className="min-w-0 flex-1">
        <p
          className={`text-xs font-semibold uppercase tracking-[0.12em] ${
            isHolidayNotice ? "text-amber-200" : "text-cyan-200"
          }`}
        >
          Aviso!
        </p>
        <div className="grid">
          {notices.map((item, index) => (
            <div
              key={item.title}
              className={`col-start-1 row-start-1 ${noticeIndex === index ? "" : "invisible"}`}
              aria-hidden={noticeIndex !== index}
            >
              <div
                key={noticeIndex === index ? "active" : "inactive"}
                className={noticeIndex === index ? "notice-slide" : undefined}
              >
                <h3 className="mt-1 font-heading text-base font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#e7f0fb]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div
          className="-ml-2 mt-2 flex items-center gap-1.5"
          role="group"
          aria-label="Selecionar aviso"
        >
          {notices.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setNoticeIndex(index)}
              className="flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
              aria-label={`Mostrar aviso ${index + 1}: ${item.title}`}
              aria-current={noticeIndex === index ? "true" : undefined}
            >
              <span
                className={`h-2 rounded-full transition-all duration-300 ${
                  noticeIndex === index
                    ? isHolidayNotice
                      ? "w-5 bg-amber-200"
                      : "w-5 bg-cyan-200"
                    : "w-2 bg-white/45 hover:bg-white/75"
                }`}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
