import Link from "next/link";

import { navLinks, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#051a34] text-[#dbebff]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-10 lg:py-14">
        <div className="space-y-4">
          <p className="font-heading text-2xl font-bold">{site.name}</p>
          <p className="max-w-lg text-[0.97rem] leading-7 text-[#a9c7ea] sm:text-sm">
            A melhor em impressão gráfica de Curitiba, agora com uma estrutura digital pensada para desempenho,
            clareza comercial e visibilidade orgânica.
          </p>
        </div>

        <div className="space-y-3 text-[0.97rem] text-[#a9c7ea] sm:text-sm">
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

        <div className="space-y-3 text-[0.97rem] text-[#a9c7ea] sm:text-sm">
          <p className="font-heading text-lg font-semibold text-white">Navegação</p>
          <div className="grid gap-2">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
