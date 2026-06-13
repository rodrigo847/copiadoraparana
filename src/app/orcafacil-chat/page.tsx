import type { Metadata } from "next";

import { OrcamentoChatBasic } from "@/components/orcamento-chat-basic";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Orca Facil Chat (Teste) | Copiadora Parana Laser",
  description:
    "Versao basica de chat para estimativa de orcamento em linguagem natural. Ambiente de testes isolado.",
  alternates: {
    canonical: "/orcafacil-chat",
  },
};

export default function OrcaFacilChatPage() {
  return (
    <div className="min-h-screen bg-[#e4e6e9]">
      <SiteHeader />

      <main className="pb-10">
        <section className="mx-auto mt-5 w-full max-w-5xl px-4 pb-2 pt-10 text-center sm:px-6 sm:pt-12">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#0f1f39] sm:text-2xl">
            Teste de Chat para Orcamento
          </h1>
          <p className="mx-auto mb-3 mt-2 max-w-3xl text-l leading-8 text-[#5f7390] sm:text-xl">
            Esta pagina e separada da calculadora oficial. Aqui voce testa pedidos em linguagem natural.
          </p>
        </section>

        <section className="mt-2">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
            <OrcamentoChatBasic />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
