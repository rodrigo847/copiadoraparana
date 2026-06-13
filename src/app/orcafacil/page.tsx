import type { Metadata } from "next";

import { OrcamentoChatBasic } from "@/components/orcamento-chat-basic";
import { OrcamentoCalculator } from "@/components/orcamento-calculator";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Orca Facil | Copiadora Parana Laser",
  description:
    "Calculadora de orcamento para impressao, adesivos, banners e materiais rigidos da Copiadora Parana Laser.",
  alternates: {
    canonical: "/orcafacil",
  },
};

export default function OrcaFacilPage() {
  return (
    <div className="min-h-screen bg-[#e4e6e9]">
      <SiteHeader />

      <main className="pb-10">
        <section className="mx-auto w-full max-w-6xl pb-2 px-4 pt-10 text-center sm:px-6 sm:pt-12 mt-5">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#0f1f39] sm:text-2xl">
            Precisa saber quanto vai custar seu material e não quer depender de um Atendente? 
          </h1>
          <p className="mx-auto mt-2 mb-3 max-w-3xl text-l leading-8 text-[#5f7390] sm:text-xl">
            Use nosso Sistema <strong>Orça Fácil</strong> e tenha uma estimativa rápida e prática!
          </p>
        </section>

        <section className="mt-2">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">

            <OrcamentoCalculator whatsappHref={site.whatsappHref} />

            <div className="mt-8 mb-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-[#c6d6ea]" />
                <h2 className="font-heading text-lg font-semibold tracking-tight text-[#14355a] sm:text-xl">
                  Orcamento Virtual (Chat)
                </h2>
                <div className="h-px flex-1 bg-[#c6d6ea]" />
              </div>
              <p className="mt-2 text-center text-sm text-[#5d7392]">
                Digite seu pedido em linguagem natural para receber uma estimativa rapida.
              </p>
            </div>

            <div id="orcamento-virtual" className="mt-6 scroll-mt-28">
              <OrcamentoChatBasic />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}