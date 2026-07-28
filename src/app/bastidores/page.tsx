import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

const productionSteps = [
  {
    id: "impressao-uv",
    title: "Impressao UV",
    description:
      "Destaque qualidade de impressao em materiais rigidos com acabamento profissional.",
    videoSrc: "/videos/impressao-uv.mp4",
    posterSrc: "/img/banner.jpg",
    benefit: "Alta definicao e fidelidade visual",
  },
  {
    id: "impressao-ecosolvente",
    title: "Impressao Ecosolvente",
    description:
      "Mostre velocidade de producao para materiais de grande formato e comunicacao visual.",
    videoSrc: "/videos/impressao_ecosolvente.mp4",
    posterSrc: "/img/material_evento.png",
    benefit: "Escala com consistencia de cor",
  },
  {
    id: "meio-corte",
    title: "Meio Corte",
    description:
      "Apresente o recorte preciso para adesivos e rotulos com acabamento limpo.",
    videoSrc: "/videos/meio_corte.mp4",
    posterSrc: "/img/adesivoredondo.png",
    benefit: "Precisao no acabamento final",
  },
  {
    id: "corte-laser",
    title: "Corte Laser",
    description:
      "Mostre detalhamento em pecas personalizadas com alto nivel de precisao.",
    videoSrc: "/videos/corte_laser.mp4",
    posterSrc: "/img/display.jpg",
    benefit: "Recorte tecnico e acabamento premium",
  },
  {
    id: "adesivo",
    title: "Producao de Adesivos",
    description:
      "Evidencie padrao visual uniforme para campanhas, vitrines e rotulagem.",
    videoSrc: "/videos/Adesivo.mp4",
    posterSrc: "/img/adesivoredondo.png",
    benefit: "Repetibilidade e alta nitidez",
  },
  {
    id: "cracha",
    title: "Crachas",
    description:
      "Mostre o fluxo de producao para identificacao corporativa e eventos.",
    videoSrc: "/videos/cracha.mp4",
    posterSrc: "/img/cracha.jpg",
    benefit: "Agilidade com padrao profissional",
  },
] as const;

export const metadata: Metadata = {
  title: "Bastidores de Producao | Copiadora Parana Laser",
  description:
    "Pagina para apresentar videos curtos dos equipamentos e etapas de producao da Copiadora Parana Laser.",
  alternates: {
    canonical: "/bastidores",
  },
};

export default function BastidoresPage() {
  return (
    <div className="min-h-screen bg-[#e4e6e9]">
      <SiteHeader />

      <main className="pb-14">
        <section className="mx-auto mt-6 w-full max-w-screen-2xl px-4 sm:px-6 min-[900px]:max-w-[94vw]">
          <div className="mx-auto w-full rounded-4xl border border-[#c9d8ea] bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fd_100%)] px-5 py-7 shadow-[0_14px_35px_rgba(19,38,68,0.08)] sm:px-8 sm:py-9 min-[900px]:w-[85%]">
            <span className="inline-flex rounded-full bg-[#e7f0ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2d63a8]">
              Bastidores
            </span>
            <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight text-[#0f1f39] sm:text-4xl">
              Conheca nossos equipamentos em acao
            </h1>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-[#58708f] sm:text-base">
              Esta pagina foi pensada para videos curtos que mostram processo real, qualidade de acabamento e
              agilidade na producao. O objetivo e reforcar confianca dentro da landing de forma limpa.
            </p>

            <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-3">
              {productionSteps.map((step) => (
                <article
                  key={step.id}
                  className="overflow-hidden rounded-3xl border border-[#d0e0f2] bg-white shadow-[0_10px_26px_rgba(19,38,68,0.09)]"
                >
                  <div className="aspect-video bg-[#ddeaff]">
                    <video
                      className="h-full w-full object-cover"
                      controls
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster={step.posterSrc}
                    >
                      <source src={step.videoSrc} type="video/mp4" />
                      Seu navegador nao suporta reproducao de video.
                    </video>
                  </div>

                  <div className="space-y-2 px-4 py-4">
                    <h2 className="font-heading text-xl font-semibold text-[#14365f]">{step.title}</h2>
                    <p className="text-sm leading-6 text-[#3f5f83]">{step.description}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2d63a8]">
                      {step.benefit}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-7 rounded-3xl border border-dashed border-[#bfd4ec] bg-[#f8fbff] px-4 py-4 sm:px-5">
              <h3 className="font-heading text-lg font-semibold text-[#123860]">Como publicar seus videos</h3>
              <p className="mt-2 text-sm leading-6 text-[#4f6f91]">
                Coloque os arquivos em <strong>public/videos</strong> e os posters em <strong>public/img</strong>.
                Depois, ajuste somente os campos <strong>videoSrc</strong> e <strong>posterSrc</strong> nesta pagina.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-[#79a2e3] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#668fd3]"
              >
                Voltar para Landing
              </Link>
              <a
                href={site.whatsappHref}
                className="inline-flex items-center justify-center rounded-full border border-[#9dbbe0] bg-white px-5 py-2 text-sm font-semibold text-[#2d63a8] transition hover:bg-[#edf4ff]"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
