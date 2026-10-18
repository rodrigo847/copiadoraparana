import type { Metadata } from "next";

import { DataExtractor } from "@/components/data-extractor";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Protótipo de Extração de Dados | Paraná Laser Copy",
  description:
    "Cole um texto e extraia data, hora, coordenadas GPS e placa em um resultado estruturado.",
  alternates: {
    canonical: "/extrator-dados",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DataExtractorPage() {
  return (
    <div className="min-h-screen bg-[#e4e6e9]">
      <SiteHeader />
      <main className="pb-10">
        <section className="mx-auto mt-5 w-full max-w-5xl px-4 pb-7 pt-10 text-center sm:px-6 sm:pt-12">
          <span className="inline-flex rounded-full bg-[#e7f0ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#2d63a8]">
            Protótipo utilizável
          </span>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-[#0f1f39] sm:text-4xl">
            Extrator de dados do texto
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#5f7390] sm:text-lg">
            Cole um registro para identificar data, hora, coordenadas e placa.
            Revise o resultado e copie os dados em JSON.
          </p>
        </section>
        <DataExtractor />
      </main>
      <SiteFooter />
    </div>
  );
}
