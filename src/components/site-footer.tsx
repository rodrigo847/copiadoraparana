import Link from "next/link";

import { navLinks, site } from "@/lib/site";

export function SiteFooter() {
  const fullAddress = `${site.address.street} - CEP ${site.address.postalCode}`;
  const cityLine = `${site.address.district} - ${site.address.city} - ${site.address.region}`;

  return (
    <footer className="mt-16 text-[#dbebff] sm:mt-20">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-t-[2.2rem] rounded-b-[1.8rem] border border-white/12 bg-[#0f386e] shadow-[0_28px_70px_rgba(3,18,43,0.38)]">
          <div className="pointer-events-none absolute -top-20 right-[18%] h-32 w-64 rounded-[50%] bg-[#071a33]" aria-hidden="true" />

          <div className="relative bg-[linear-gradient(160deg,#174789_0%,#123f7c_56%,#103a72_100%)] px-4 pt-4 pb-6 sm:px-8 sm:pt-5 sm:pb-8">
            <div className="grid gap-4 text-[0.95rem] sm:grid-cols-[1fr_auto] sm:items-center sm:text-base">
              <div className="grid gap-2 text-[#d3e6ff]">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-2 font-semibold text-white">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M7 4h10a3 3 0 013 3v10a3 3 0 01-3 3H9l-4 3V7a3 3 0 013-3z" />
                      <path d="M8.5 9.5h7M8.5 12.5h4.5" />
                    </svg>
                    {site.whatsappDisplay}
                  </span>
                  <span className="text-[#a7c7ef]">|</span>
                  <span>{site.phoneDisplay}</span>
                </div>

                <a href={site.domain} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
                  </svg>
                  {site.domain.replace("https://", "")}
                </a>
              </div>

              <a
                href={site.googleMapsDirections}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-start gap-3 rounded-2xl border border-white/18 bg-white/6 px-4 py-3 text-[#d9ebff] transition hover:bg-white/12"
              >
                <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 21s7-5.1 7-11a7 7 0 10-14 0c0 5.9 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span className="leading-5">
                  <span className="block text-white">{fullAddress}</span>
                  <span className="block text-[#bbd6f6]">{cityLine}</span>
                </span>
              </a>
            </div>
          </div>

          <div className="pointer-events-none relative h-9 overflow-hidden sm:h-11" aria-hidden="true">
            <svg viewBox="0 0 1200 140" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <path
                d="M0 0 C220 8, 460 86, 740 88 L1200 88 L1200 140 L0 140 Z"
                fill="#12386c"
              />
              <path
                d="M0 0 C220 8, 460 86, 740 88 L1200 88"
                fill="none"
                stroke="rgba(206,228,255,0.28)"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="grid gap-8 bg-[#12386c] px-4 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.3fr_1fr_1fr]">
            <div className="space-y-4">
              <p className="font-heading text-2xl font-bold text-white">{site.name}</p>
              <p className="max-w-lg text-[0.97rem] leading-7 text-[#b8d4f2] sm:text-sm">
                A melhor em impressão gráfica de Curitiba, agora com uma estrutura digital pensada para desempenho,
                clareza comercial e visibilidade orgânica.
              </p>
              <p className="text-[0.95rem] text-[#b8d4f2] sm:text-sm">Razão Social: Onograf Cópias Ltda <br /> CNPJ: 01.906.658/0001-20</p>
            </div>

            <div className="space-y-3 text-[0.97rem] text-[#b8d4f2] sm:text-sm">
              <p className="font-heading text-lg font-semibold text-white">Contato</p>
              <a href={site.whatsappHref} target="_blank" rel="noreferrer" className="block hover:text-white">
                {site.whatsappDisplay}
              </a>
              <a href={site.phoneHref} className="block hover:text-white">
                {site.phoneDisplay}
              </a>
              <a href={`mailto:${site.email}`} className="block hover:text-white">
                {site.email}
              </a>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="block hover:text-white">
                Instagram
              </a>
            </div>

            <div className="space-y-3 text-[0.97rem] text-[#b8d4f2] sm:text-sm">
              <p className="font-heading text-lg font-semibold text-white">Navegação</p>
              <div className="grid gap-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-[#c4dcf8] transition-colors duration-200 hover:text-[#d9eaff]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/14 bg-[#12386c] px-4 py-4 text-xs text-[#b2cfee] sm:px-8 sm:text-sm">
            <p>© {new Date().getFullYear()} {site.name}. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
