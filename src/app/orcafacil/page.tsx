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
            Quer saber quanto vai custar seu material e não quer depender de um Atendente? 
          </h1>
          <p className="mx-auto mt-2 mb-3 max-w-3xl text-l leading-8 text-[#5f7390] sm:text-xl">
            Use nosso Sistema <strong>Orça Fácil</strong> para uma estimativa rápida! Caso tenha dificuldade em montar, utilize o chat abaixo para uma ajuda automática. 
          </p>
        </section>

        <section className="mt-2">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">

            <OrcamentoCalculator whatsappHref={site.whatsappHref} />

            <div className="mt-8 mb-6 rounded-3xl border border-[#bfd3ec] bg-[linear-gradient(140deg,rgba(246,250,255,0.95),rgba(233,242,253,0.92))] p-5 shadow-[0_14px_34px_rgba(19,38,68,0.08)] sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="max-w-5xl mx-auto">
                  <h2 className="mt-3 font-heading text-2xl text-center font-bold tracking-tight text-[#14355a] sm:text-3xl">
                    Use o chat abaixo para um orçamento automático
                  </h2>
                  <p className="mt-4 text-center text-[#4a6486] text-lg leading-8">
                    Nosso sistema de chat de orçamento está em treinamento para fornecer respostas automáticas. Sinta-se à vontade para experimentar e obter uma estimativa rápida para o seu pedido!
                  </p>
                </div>
              </div>
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