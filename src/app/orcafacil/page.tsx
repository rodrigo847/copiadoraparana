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
        <section className="mx-auto w-full max-w-screen-2xl pb-2 px-4 pt-10 text-center sm:px-6 sm:pt-12 mt-5 min-[900px]:max-w-[94vw]">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#0f1f39] sm:text-2xl">
            Quer saber quanto vai custar seu material e não quer depender de um Atendente? 
          </h1>
          <p className="mx-auto mt-2 mb-3 max-w-3xl text-l leading-8 text-[#5f7390] sm:text-xl">
            Use nosso Sistema <strong>Orça Fácil</strong> para uma estimativa rápida! Caso tenha dificuldade em montar, utilize o chat abaixo para uma ajuda automática. 
          </p>
        </section>

        <section className="mt-2">
          <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 min-[900px]:max-w-[94vw]">
            <div className="mx-auto w-full min-[900px]:w-[85%]">
              <details className="group overflow-hidden rounded-4xl border border-[#c9d8ea] bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fd_100%)] shadow-[0_14px_35px_rgba(19,38,68,0.08)]">
                <summary className="cursor-pointer list-none border-b border-[#e2ebf5] px-5 py-4 sm:px-8 sm:py-5">
                  <span className="inline-flex rounded-full bg-[#e7f0ff] px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#2d63a8] uppercase">
                    Vídeo Curto de Demonstração
                  </span>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-heading text-l font-bold tracking-tight text-[#0f1f39] sm:text-3xl">
                        Como usar o chat do Orça Fácil
                      </h2>
                    </div>
                    <span className="inline-flex min-w-54 items-center justify-center whitespace-nowrap rounded-full bg-[#79a2e3] px-5 py-2 text-sm font-semibold text-white transition group-open:bg-[#668fd3] sm:min-w-58 sm:px-6">
                      <span className="inline-flex items-center gap-2 group-open:hidden">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                          <path d="M8 6.4a1 1 0 0 1 1.52-.85l7.5 4.6a1 1 0 0 1 0 1.7l-7.5 4.6A1 1 0 0 1 8 15.6V6.4z" />
                        </svg>
                        <span>Assistir demonstração</span>
                      </span>
                      <span className="hidden items-center gap-2 group-open:inline-flex">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M6 6l12 12" />
                          <path d="M18 6l-12 12" />
                        </svg>
                        <span>Fechar demonstração</span>
                      </span>
                    </span>
                  </div>
                </summary>

                <div className="px-5 py-5 sm:px-8 sm:py-8">
                  <div className="max-w-4xl">
                    <div className="relative overflow-hidden rounded-[1.75rem] border border-[#cfe0f3] bg-[linear-gradient(135deg,#dce9ff_0%,#f4f8ff_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex-1">
                          <div className="demo-sequence-stage mt-4 rounded-3xl bg-white/95 p-3 shadow-[0_10px_24px_rgba(19,38,68,0.08)] sm:p-4">
                            <div className="demo-sequence-card demo-sequence-card-first rounded-3xl bg-white/95 p-3 sm:p-4">
                              <p className="text-sm text-[#385979]">Cliente: 250 adesivos 3x3cm em vinil fosco com meio corte</p>
                              <div className="mt-3 space-y-2 rounded-2xl bg-[#eef5ff] px-3 py-2 text-sm leading-6 text-[#193a62] sm:px-4 sm:py-3">
                                <div className="relative flex items-center gap-3 overflow-hidden rounded-xl bg-white px-3 py-2 shadow-[0_8px_20px_rgba(19,38,68,0.06)]">
                                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e2ecfb] text-[#1f69cc]">
                                    <span className="absolute inset-0 rounded-full border border-[#9fc0ef] demo-mouse-click" aria-hidden="true" />
                                    <svg viewBox="0 0 24 24" className="demo-mouse-path h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
                                      <path d="M4 4l7 16 2.1-6.1L20 12 4 4z" />
                                    </svg>
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6b86a6]">Digitando o pedido</p>
                                    <p className="mt-1 text-sm font-medium text-[#193a62]">
                                      <span className="demo-typing-text demo-typing-first align-bottom">250 adesivos 3x3cm em vinil fosco com meio corte</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="demo-response-reveal demo-response-first rounded-2xl bg-[#eef5ff] px-3 py-2 text-sm leading-6 text-[#193a62] sm:px-4 sm:py-3">
                                  <p className="font-semibold text-[#164983]">Exemplo interpretado</p>
                                  <p className="mt-1">
                                    Entendi como 250 adesivos de 3x3cm em vinil fosco com meio corte.
                                  </p>
                                </div>
                                <div className="demo-response-reveal demo-response-first rounded-2xl border border-[#dbe7f4] bg-white px-3 py-2 text-sm leading-6 text-[#193a62] sm:px-4 sm:py-3">
                                  <p className="font-semibold text-[#164983]">Orçamento simulado</p>
                                  <div className="mt-2 space-y-1 text-sm text-[#385979]">
                                    <p>• Item: Adesivo vinil fosco com meio corte</p>
                                    <p>• Quantidade: 250 un.</p>
                                    <p>• Tamanho: 3x3cm</p>
                                    <p>• Unitário estimado: R$ 0,00</p>
                                    <p>• Total estimado: R$ 0,00</p>
                                  </div>
                                  <p className="mt-2 text-xs text-[#6b86a6]">
                                    Exemplo visual. O valor real é gerado pela ferramenta abaixo.
                                  </p>
                                </div>
                              </div>

                            </div>

                            <div className="demo-sequence-card demo-sequence-card-second rounded-3xl bg-white/95 p-3 sm:p-4">
                              <p className="text-sm text-[#385979]">Cliente: Banner 100x150cm brilho com ilhós</p>
                              <div className="mt-3 space-y-2 rounded-2xl bg-[#eef5ff] px-3 py-2 text-sm leading-6 text-[#193a62] sm:px-4 sm:py-3">
                                <div className="relative flex items-center gap-3 overflow-hidden rounded-xl bg-white px-3 py-2 shadow-[0_8px_20px_rgba(19,38,68,0.06)]">
                                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e2ecfb] text-[#1f69cc]">
                                    <span className="absolute inset-0 rounded-full border border-[#9fc0ef] demo-mouse-click" aria-hidden="true" />
                                    <svg viewBox="0 0 24 24" className="demo-mouse-path h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
                                      <path d="M4 4l7 16 2.1-6.1L20 12 4 4z" />
                                    </svg>
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6b86a6]">Novo pedido</p>
                                    <p className="mt-1 text-sm font-medium text-[#193a62]">
                                      <span className="demo-typing-text demo-typing-second align-bottom">Banner 100x150cm brilho com ilhós</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="demo-response-reveal demo-response-second rounded-2xl bg-[#eef5ff] px-3 py-2 text-sm leading-6 text-[#193a62] sm:px-4 sm:py-3">
                                  <p className="font-semibold text-[#164983]">Exemplo interpretado</p>
                                  <p className="mt-1">
                                    Entendi como banner 100x150cm brilho com ilhós, com 1 unidade para orçamento.
                                  </p>
                                </div>
                                <div className="demo-response-reveal demo-response-second rounded-2xl border border-[#dbe7f4] bg-white px-3 py-2 text-sm leading-6 text-[#193a62] sm:px-4 sm:py-3">
                                  <p className="font-semibold text-[#164983]">Orçamento simulado</p>
                                  <div className="mt-2 space-y-1 text-sm text-[#385979]">
                                    <p>• Item: Banner brilho com ilhós</p>
                                    <p>• Quantidade: 1 un.</p>
                                    <p>• Tamanho: 100x150cm</p>
                                    <p>• Unitário estimado: R$ 0,00</p>
                                    <p>• Total estimado: R$ 0,00</p>
                                  </div>
                                  <p className="mt-2 text-xs text-[#6b86a6]">
                                    O próximo exemplo aparece no mesmo espaço para não aumentar a altura da tela.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-5">
                            <a
                              href="#orcamento-virtual"
                              className="inline-flex items-center justify-center rounded-full bg-[#79a2e3] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#668fd3]"
                            >
                              Ir para a ferramenta
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </section>

        <section className="mt-2">
          <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 min-[900px]:max-w-[94vw]">
            <div className="flex flex-col gap-6 min-[900px]:items-center">
              <div id="orcamento-virtual" className="scroll-mt-28 w-full min-[900px]:w-[85%]">
                <OrcamentoChatBasic />
              </div>

              <div className="w-full min-[900px]:w-[85%]">
                <OrcamentoCalculator whatsappHref={site.whatsappHref} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}