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
        <section className="mx-auto w-full max-w-screen-2xl pb-2 px-4 pt-10 text-center sm:px-6 sm:pt-12 mt-5">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#0f1f39] sm:text-2xl">
            Quer saber quanto vai custar seu material e não quer depender de um Atendente? 
          </h1>
          <p className="mx-auto mt-2 mb-3 max-w-3xl text-l leading-8 text-[#5f7390] sm:text-xl">
            Use nosso Sistema <strong>Orça Fácil</strong> para uma estimativa rápida! Caso tenha dificuldade em montar, utilize o chat abaixo para uma ajuda automática. 
          </p>
        </section>

        <section className="mt-2">
          <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-start">
              <div className="xl:col-span-7">
                <OrcamentoCalculator whatsappHref={site.whatsappHref} />
              </div>

              <div id="orcamento-virtual" className="scroll-mt-28 xl:col-span-5">
                <OrcamentoChatBasic />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}