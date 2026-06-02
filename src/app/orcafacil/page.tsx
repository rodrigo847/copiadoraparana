import type { Metadata } from "next";

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
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}