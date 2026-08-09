import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { CopyWhatsappCard } from "@/components/copy-whatsapp-card";
import { SilentVideo } from "@/components/silent-video";
import { ServicesProductsCarousel } from "@/components/services-products-carousel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  faqEntries,
  faqJsonLd,
  highlights,
  localBusinessJsonLd,
  mostRequested,
  projectSteps,
  serviceLandingPages,
  serviceCatalogJsonLd,
  services,
  site,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Copiadora e Gráfica Rápida em Curitiba | Paraná Laser Copy",
  description:
    "Copiadora em Curitiba com impressão digital, impressão a laser, adesivos com recorte, panfletos, banners, faixas, plotagem e materiais corporativos com produção ágil.",
  keywords: [
    "copiadora em curitiba",
    "copiadora curitiba",
    "gráfica rápida curitiba",
    "gráfica para adesivos",
    "impressão digital curitiba",
    "impressão a laser",
    "impressão de adesivos",
    "Adesivos com recorte especial",
    "Adesivos prova d'água",
    "impressão colorida",
    "adesivos personalizados curitiba",
    "adesivo recorte",
    "panfletos curitiba",
    "flyers curitiba",
    "banners curitiba",
    "banner curitiba",
    "faixas curitiba",
    "plotagem curitiba",
    "impressão a3",
    "impressão de apostilas",
    "encadernação curitiba",
    "copiadora paraná laser",
    "copiadora parana laser",
  ],
  alternates: {
    canonical: "/",
  },
};

const searchHighlightTopics = [
  {
    title: "Gráfica rápida e impressão digital",
    description:
      "Atendimento para quem busca gráfica rápida, impressão digital, impressão colorida e impressão a laser em Curitiba.",
  },
  {
    title: "Adesivos com recorte especial",
    description:
      "Produção de gráfica para adesivos, adesivo com recorte eletrônico, rótulos e etiquetas para marca, vitrine e embalagem.",
  },
  {
    title: "Panfletos, flyers e apostilas",
    description:
      "Impressão de panfletos, flyers, apostilas e materiais promocionais com orientação sobre papel, formato e acabamento.",
  },
  {
    title: "Banners, faixas e comunicação visual",
    description:
      "Impressão de banners, faixas e peças de comunicação visual para loja, evento, campanha e ponto de venda.",
  },
  {
    title: "Material para eventos e campanhas",
    description:
      "Crachás, folders, cartazes e peças promocionais para feiras, convenções e ações especiais em Curitiba.",
  },
  {
    title: "Plotagem e impressão A3",
    description:
      "Serviço de plotagem, plotagem gráfica, impressão A3 e grandes formatos para arquitetura, engenharia e apresentação técnica.",
  },
  {
    title: "Gráfica perto de mim em Curitiba",
    description:
      "Estrutura no Batel para quem procura gráfica perto de mim, com retirada local, atendimento por WhatsApp e suporte comercial.",
  },
];

const productImageMap: Record<string, string> = {
  "Banners e Roll-ups": "/img/banner.jpg",
  "Cartões de visita especiais": "/img/cartao%20de%20visita.jpg",
  "Encadernações": "/img/encadernacao2.png",
  "Carimbos personalizados": "/img/carimbos.png",
  "Plotagens de engenharia e arquitetura": "/img/projetos.jpg",
  "Flyers, folders e panfletos": "/img/folder.jpg",
  "Adesivos, rótulos e etiquetas": "/img/adesivoredondo.png",
  "Papel timbrado": "/img/papel%20timbrado.jpg",
  "Calendário": "/img/calendario.jpg",
  "Crachás personalizados": "/img/cracha.jpg",
  "Crachás e Credenciais em PS ou PVC": "/img/cracha.jpg",
  "Canetas personalizadas": "/img/caneta.png",
  "Displays de mesa": "/img/display.jpg",
  "Caixas em acrílico": "/img/caixa.png",
  "Sacolas personalizadas": "/img/sacolas.jpg",
  "Wobblers promocionais": "/img/wobler.jpg",
};

const landingProcessVideos = [
  {
    id: "impressao-uv",
    title: "Impressao UV",
    description: "Qualidade de impressão em materiais rígidos com acabamento profissional.",
    videoSrc: "/videos/impressao_uv.mp4",
    posterSrc: "/img/banner.jpg",
  },
  {
    id: "impressao-ecosolvente",
    title: "Impressão ecosolvente",
    description: "Produção em escala para comunicação visual com consistência de cor.",
    videoSrc: "/videos/impressao_ecosolvente.mp4",
    posterSrc: "/img/material_evento.png",
  },
  {
    id: "meio-corte",
    title: "Meio corte",
    description: "Recorte limpo para adesivos, rótulos e peças personalizadas.",
    videoSrc: "/videos/meio_corte.mp4",
    posterSrc: "/img/adesivoredondo.png",
  },
  {
    id: "corte-laser",
    title: "Corte laser",
    description: "Detalhamento técnico para peças especiais e acabamento premium.",
    videoSrc: "/videos/corte_laser.mp4",
    posterSrc: "/img/display.jpg",
  },
  {
    id: "adesivo",
    title: "Produção de adesivos",
    description: "Padrão visual uniforme para campanhas, vitrines e rotulagem.",
    videoSrc: "/videos/Adesivo.mp4",
    posterSrc: "/img/adesivoredondo.png",
  },
  {
    id: "cracha",
    title: "Crachas",
    description: "Identificação corporativa com agilidade e apresentação profissional.",
    videoSrc: "/videos/cracha.mp4",
    posterSrc: "/img/cracha.jpg",
  },
] as const;

export default function HomePage() {
  return (
    <div className="page-shell">
      <Script id="local-business-jsonld" type="application/ld+json">
        {JSON.stringify(localBusinessJsonLd)}
      </Script>
      <Script id="service-catalog-jsonld" type="application/ld+json">
        {JSON.stringify(serviceCatalogJsonLd)}
      </Script>
      <Script id="faq-jsonld" type="application/ld+json">
        {JSON.stringify(faqJsonLd)}
      </Script>

      <SiteHeader />

      <main className="flex flex-1 flex-col">
        <section id="inicio" className="mx-auto w-full max-w-7xl scroll-mt-28 px-3 pt-2 pb-7 sm:px-6 sm:pt-4 sm:pb-9 lg:px-10 lg:pt-6 lg:pb-16">
          <div className="hero-panel relative isolate overflow-hidden rounded-3xl px-4 py-4 text-white sm:rounded-4xl sm:px-8 sm:py-8 lg:min-h-160 lg:px-12 lg:py-10">
            <Image
              src="/img/Fundo.png"
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[75%_22%] opacity-60 brightness-110 sm:object-cover sm:object-center sm:opacity-60 sm:brightness-110"
            />
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(10,28,49,0.72)_10%,rgba(12,37,62,0.64)_55%,rgba(14,48,78,0.56)_100%)]" />

            <div className="relative z-10 grid gap-6 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
              <div>

                <p className="text-2xl mb-3">Bem vindo a <br></br> Copiadora Paraná Laser</p>
                <h1 className="mb-4 max-w-3xl font-heading text-3xl font-bold leading-[1.06] tracking-[-0.01em] text-balance sm:mb-5 sm:text-4xl lg:text-5xl">
                  Copiadora e gráfica rápida em Curitiba para impressão digital, adesivos, banners e plotagem
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-[#c5dcfb] sm:mt-6 sm:text-xl sm:leading-8">
                  Se você procura uma copiadora em Curitiba para impressão digital, impressão a laser, adesivos com recorte especial, panfletos, flyers, banners, faixas, impressão A3 e serviço de plotagem, temos atendimento rápido e suporte especializado.
                </p>

                <span className="mt-4 inline-flex rounded-full bg-white/5 px-4 py-2 text-[0.72rem] tracking-[0.24em] text-[#a9cbfb]">
                  Impressões Rápidas e com Qualidade
                </span>

                <div className="mt-7 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:gap-5">
                  <Link
                    href="/orcafacil"
                    className="inline-flex items-center justify-center rounded-full border border-[#4f7eb5] bg-[linear-gradient(180deg,rgba(31,132,255,0.24),rgba(16,83,166,0.18))] px-6 py-3 text-center text-sm font-semibold text-[#1f84ff] transition hover:border-[#86b8f5] hover:bg-[linear-gradient(180deg,rgba(31,132,255,0.32),rgba(16,83,166,0.24))] sm:w-auto"
                  >
                    <svg viewBox="0 0 24 24" className="h-6 w-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="6" y="2.8" width="12" height="18.4" rx="2.2" />
                      <path d="M9.4 7.2h5.2M9.4 10.2h5.2M9.4 13.2h5.2M12 17.2h.01" />
                    </svg>
                    Orça Fácil
                  </Link>
                  <a
                    href={site.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/12 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/20 sm:w-auto"
                  >
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M7 4h10a3 3 0 013 3v10a3 3 0 01-3 3H9l-4 3V7a3 3 0 013-3z" />
                      <path d="M8.5 9.5h7M8.5 12.5h4.5" />
                    </svg>
                    Falar no WhatsApp
                  </a>
                </div>
              </div>

              <div className="relative h-full self-stretch overflow-hidden rounded-3xl border border-white/12 bg-white/5 p-5 sm:rounded-4xl sm:p-9 lg:p-10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(2,10,22,0.25)]">
                <div className="absolute inset-0 rounded-4xl bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01))]" />
                <div className="relative z-10 flex h-full flex-col justify-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d8e8ff]">Fale Conosco</p>
                  <h2 className="mt-3 font-heading text-xl font-bold tracking-tight text-white sm:text-2xl">Atendimento rápido e direto</h2>

                  <div className="mt-5 space-y-3">
                    <a
                      href={site.phoneHref}
                      className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8 px-3 py-3 transition hover:border-[#78a9e2] hover:bg-white/12"
                    >
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12 text-[#cce1ff]">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-[0.12em] text-[#b6d0ef]">Telefone</span>
                        <span className="block font-heading text-xl font-bold text-white">{site.phoneDisplay}</span>
                      </span>
                    </a>

                    <CopyWhatsappCard whatsappDisplay={site.whatsappDisplay} />
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/12 bg-white/7 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-[#b6d0ef]">Atendimento presencial</p>
                    <p className="mt-1 text-sm leading-6 text-[#e7f0fb]">
                      Rua Teixeira Coelho, 61, Batel, <span className="whitespace-nowrap">Curitiba - PR</span>
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#d8e8ff]">Seg a Sex - 9h às 18h | Sábados - 9h às 12h</p>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <a
                        href={site.googleMapsDirections}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-[#7faee2] bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#d6e8ff] transition hover:bg-white/16 sm:w-auto sm:justify-start"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Abrir no Google Maps
                      </a>
                      <a
                        href={site.wazeDirections}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-[#7faee2] bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#d6e8ff] transition hover:bg-white/16 sm:w-auto sm:justify-start"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" /></svg>
                        Abrir no Waze
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        <ServicesProductsCarousel items={mostRequested} imageMap={productImageMap} />

        <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="section-card rounded-4xl p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <span className="eyebrow">Por que escolher a Paraná Laser</span>
                <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Mais do que impressão: parceria para entregar seu projeto com rapidez e confiança
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-muted">
                Atuamos com agilidade, orientação técnica e acabamento profissional para empresas, eventos e projetos pessoais.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[#dceaff] bg-white/80 p-5">
                <h3 className="font-heading text-xl font-bold text-[#123159]">Produção ágil</h3>
                <p className="mt-2 text-sm leading-7 text-[#365a84]">Prazo enxuto para materiais urgentes e entregas com mais previsibilidade.</p>
              </div>
              <div className="rounded-2xl border border-[#dceaff] bg-white/80 p-5">
                <h3 className="font-heading text-xl font-bold text-[#123159]">Atendimento humanizado</h3>
                <p className="mt-2 text-sm leading-7 text-[#365a84]">Orientação prática para escolher o melhor material, acabamento e formato para cada demanda.</p>
              </div>
              <div className="rounded-2xl border border-[#dceaff] bg-white/80 p-5">
                <h3 className="font-heading text-xl font-bold text-[#123159]">Qualidade técnica</h3>
                <p className="mt-2 text-sm leading-7 text-[#365a84]">Foco em leitura, acabamento e resultado final para valorizar sua marca.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-10 lg:py-6">
          <div className="section-card rounded-4xl p-6 sm:p-8 lg:p-10">
            <div className="max-w-3xl">
              <span className="eyebrow">Serviços mais buscados</span>
              <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Destaques da Copiadora para as buscas mais frequentes dos clientes em Curitiba
              </h2>
              <p className="mt-3 text-base leading-7 text-muted">
                Reforçamos abaixo os serviços com maior volume de procura para facilitar a navegação e conectar a home com as demandas reais de pesquisa.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {searchHighlightTopics.map((topic) => (
                <article
                  key={topic.title}
                  className="rounded-2xl border border-[#dceaff] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,249,255,0.88))] p-5 transition hover:border-[#8eb8ee]"
                >
                  <h3 className="font-heading text-xl font-bold tracking-tight text-[#123159]">{topic.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#365a84]">{topic.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="servicos" className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.title}
                className="section-card relative isolate overflow-hidden rounded-3xl transition duration-300 hover:border-[#95c1ff]"
              >
                {service.backgroundImage ? (
                  <>
                    <div className="relative h-52 sm:hidden">
                      <Image
                        src={service.backgroundImage}
                        alt={service.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    </div>

                    <Image
                      src={service.backgroundImage}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="hidden sm:block"
                      style={{ objectFit: "cover", objectPosition: "center", opacity: 0.6, borderRadius: "1.75rem" }}
                    />
                    <div className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(242,248,255,0.74))] sm:block" />
                  </>
                ) : null}

                <div className="relative z-10 px-5 py-5 sm:p-7">
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-[#08284c]">{service.title}</h2>
                  <p className="mt-3 text-base leading-7 text-[#234a74]">{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="section-card rounded-4xl p-6 sm:p-8">
            <span className="eyebrow">Serviços por especialidade</span>
            <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Páginas dedicadas para os principais serviços em Curitiba
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
              Veja detalhes de atendimento para cada tipo de demanda de impressão e material gráfico.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {serviceLandingPages.map((servicePage) => (
                <Link
                  key={servicePage.slug}
                  href={`/servicos/${servicePage.slug}`}
                  className="rounded-2xl border border-[#cfe0fb] bg-white/78 px-4 py-3 text-sm font-semibold text-[#0f3864] transition hover:border-[#7aa9e3] hover:bg-white"
                >
                  {servicePage.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div>
            <article className="reveal-up reveal-delay-1 relative isolate overflow-hidden rounded-4xl border border-white/18 p-5 text-white shadow-[0_24px_50px_rgba(4,16,34,0.35)] backdrop-blur-2xl sm:p-6">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(11,23,40,0.78),rgba(12,28,50,0.62)),url('/img/Empresas.png')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(9,24,44,0.78)_0%,rgba(9,24,44,0.64)_38%,rgba(9,24,44,0.4)_68%,rgba(9,24,44,0.22)_100%)]" />

              <span className="relative z-10 inline-flex rounded-sm border border-white/20 bg-white/8 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#c9d9ee]">
                Condição especial para empresas
              </span>

              <h2 className="relative z-10 mt-3 max-w-2xl font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                Faturamento com prazo para pagamento
              </h2>
              <p className="relative z-10 mt-2 max-w-2xl text-sm leading-7 text-[#e3efff] sm:text-base">
                {highlights[0]} Mediante cadastro e analise comercial, sua empresa pode centralizar pedidos com mais previsibilidade.
              </p>

              <div className="relative z-10 mt-5 grid gap-3 sm:gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-white/16 bg-[linear-gradient(150deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))] p-4 shadow-[0_10px_24px_rgba(6,22,44,0.22)] sm:p-5">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#cde5ff]">Cadastro comercial por e-mail</p>
                  <h3 className="mt-2 font-heading text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Envie sua solicitação em uma mensagem
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#e8f2ff]">
                    Para iniciar a análise comercial, encaminhe os dados para o e-mail abaixo.
                  </p>

                  <div className="mt-4 w-full rounded-xl border border-white/18 bg-[#0f233d]/58 px-4 py-3 sm:w-auto">
                    <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#bfd3ed]">E-mail financeiro</span>
                    <span className="mt-0.5 block text-sm font-semibold text-white sm:text-base select-all">{site.financialEmail}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/16 bg-white/10 p-4 sm:p-5">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#cdddf2]">Dados obrigatórios</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[#e8f2ff]">
                    <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#9cc1ea]" />Empresa (Razão social)</li>
                    <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#9cc1ea]" />CNPJ</li>
                    <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#9cc1ea]" />Responsável pelo contato</li>
                    <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#9cc1ea]" />Telefone</li>
                    <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#9cc1ea]" />E-mail comercial</li>
                    <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#9cc1ea]" />Observações (opcional)</li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="projetos" className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="section-card rounded-4xl p-8 lg:p-10">
            <div className="max-w-3xl">
              <span className="eyebrow">Processos de impressão!</span>
              <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Você tem a ideia, nós temos a solução gráfica para tornar realidade. <br /><br />Veja como funciona!
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {landingProcessVideos.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-[#d8e6fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(246,250,255,0.9))] shadow-[0_10px_24px_rgba(19,38,68,0.08)]"
                >
                  <div className="aspect-video bg-[#e6efff]">
                    <SilentVideo
                      src={item.videoSrc}
                      poster={item.posterSrc}
                      className="h-full w-full object-cover"
                      controls
                      loop
                      playsInline
                      preload="metadata"
                    />
                  </div>
                  <div className="space-y-1 px-4 py-3 sm:px-5 sm:py-4">
                    <h3 className="font-heading text-xl font-bold text-[#123159]">{item.title}</h3>
                    <p className="text-sm leading-6 text-[#365a84]">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="relative mt-8">
              <div className="pointer-events-none absolute left-[12%] right-[12%] top-10 hidden h-0.5 bg-[linear-gradient(90deg,rgba(22,100,207,0.18),rgba(22,100,207,0.48),rgba(22,100,207,0.18))] lg:block" />

              <div className="grid gap-5 lg:grid-cols-4">
                {projectSteps.map((step, index) => {
                  const variants = [
                    {
                      tag: "Preparação",
                      border: "border-[#b9d4ff]",
                      glow: "group-hover:shadow-[0_18px_40px_rgba(40,119,232,0.18)]",
                      badgeBg: "bg-[linear-gradient(180deg,#1f84ff,#1664cf)]",
                    },
                    {
                      tag: "Conferência",
                      border: "border-[#b7dbec]",
                      glow: "group-hover:shadow-[0_18px_40px_rgba(42,146,171,0.18)]",
                      badgeBg: "bg-[linear-gradient(180deg,#2aa7c2,#1f7c95)]",
                    },
                    {
                      tag: "Execução",
                      border: "border-[#c7dbef]",
                      glow: "group-hover:shadow-[0_18px_40px_rgba(60,104,155,0.2)]",
                      badgeBg: "bg-[linear-gradient(180deg,#4b7eb8,#2b5f96)]",
                    },
                    {
                      tag: "Entrega",
                      border: "border-[#c6d4f7]",
                      glow: "group-hover:shadow-[0_18px_40px_rgba(88,116,189,0.2)]",
                      badgeBg: "bg-[linear-gradient(180deg,#6a86da,#425fb3)]",
                    },
                  ] as const;

                  const variant = variants[index % variants.length];

                  return (
                    <article
                      key={step.title}
                      className={`group relative isolate overflow-hidden rounded-4xl border ${variant.border} bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,251,255,0.9))] p-6 transition duration-300 hover:-translate-y-1.5 ${variant.glow}`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_8%,rgba(62,129,225,0.17),transparent_35%)]" />

                      <div className="relative z-10 flex items-center justify-between gap-3">
                        <span className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full text-sm font-bold text-white ${variant.badgeBg}`}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="rounded-full border border-[#d8e6fb] bg-white/85 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#35669e]">
                          {variant.tag}
                        </span>
                      </div>

                      <div className="relative z-10 mt-5">
                        <div>
                          <h3 className="font-heading text-3xl font-bold leading-tight tracking-tight text-[#123159]">{step.title}</h3>
                          <p className="mt-3 text-[1.02rem] leading-8 text-[#365a84]">{step.description}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>



        <section id="quem-somos" className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="max-w-6xl rounded-4xl border border-[#cfe0fb] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(242,248,255,0.9))] p-6 text-base leading-7 text-[#234a74] sm:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <div>
                <span className="eyebrow">Quem somos</span>
                <h2 className="mt-4 font-heading text-2xl tracking-tight text-[#123159] sm:text-3xl">
                  Gráfica rápida em Curitiba desde 1997, com atendimento ágil para empresas e clientes finais
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-[#365a84] sm:text-lg">
                  A Copiadora Paraná Laser atua no Batel, em Curitiba, com soluções em impressão digital, impressão a laser, adesivos, banners, plotagem, comunicação visual, encadernações e papelaria. Nosso foco é unir rapidez, orientação técnica e acabamento profissional para demandas corporativas e pedidos sob medida.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href={site.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-[#7faee2] bg-white px-5 py-3 text-sm font-semibold text-[#0f3864] transition hover:bg-[#eff6ff] sm:w-auto"
                  >
                    Solicitar atendimento
                  </a>
                  <a
                    href={site.googleMapsDirections}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-[#c8d9ef] bg-[#f7fbff] px-5 py-3 text-sm font-semibold text-[#335981] transition hover:bg-white sm:w-auto"
                  >
                    Ver localização no Batel
                  </a>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-3xl border border-[#dceaff] bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f7ea5]">Desde 1997</p>
                  <p className="mt-1 font-heading text-xl font-bold text-[#123159]">Experiência no mercado gráfico local</p>
                </div>
                <div className="rounded-3xl border border-[#dceaff] bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f7ea5]">Localização</p>
                  <p className="mt-1 font-heading text-xl font-bold text-[#123159]">Batel, Curitiba, com retirada e atendimento rápido</p>
                </div>
                <div className="rounded-3xl border border-[#dceaff] bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f7ea5]">Atendimento</p>
                  <p className="mt-1 font-heading text-xl font-bold text-[#123159]">Empresas, profissionais e clientes finais</p>
                </div>
                <div className="rounded-3xl border border-[#dceaff] bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f7ea5]">Especialidades</p>
                  <p className="mt-1 font-heading text-xl font-bold text-[#123159]">Impressão digital, adesivos, banners, plotagem e papelaria</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="space-y-8">
            <section id="perguntas-frequentes" className="scroll-mt-28">
              <div className="section-card rounded-4xl p-6 sm:p-8">
                <span className="eyebrow">Perguntas frequentes!</span>
                <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Dúvidas comuns sobre serviços de impressão em Curitiba
                </h2>
                <div className="mt-6 space-y-4">
                  {faqEntries.map((entry) => (
                    <details
                      key={entry.question}
                      className="group rounded-2xl border border-[#cfe0fb] bg-white/80 p-4 open:border-[#7aa9e3] sm:p-5"
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
                        <h3 className="font-heading text-xl font-bold text-foreground">{entry.question}</h3>
                        <span
                          aria-hidden="true"
                          className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#9dbce6] text-lg font-semibold text-[#1664cf] transition-transform duration-200 group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-base leading-7 text-muted">{entry.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </section>
            
            <section id="contato" className="scroll-mt-28">
              <div className="mb-6 max-w-3xl">
                <span className="eyebrow">Contato</span>
                <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Como entrar em contato conosco?
                </h2>
              </div>

              <div className="relative overflow-hidden rounded-4xl border border-white/18 bg-[linear-gradient(145deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06))] p-5 text-[#e8f1ff] shadow-[0_24px_50px_rgba(4,16,34,0.35)] backdrop-blur-2xl sm:p-7 lg:p-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_100%,rgba(18,97,199,0.25),transparent_42%)]" />

                <div className="relative z-10 space-y-3.5">
                  <div className="rounded-3xl border border-white/12 bg-white/8 p-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/14 text-[#d5e8ff]">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#bfd8f9]">Telefone</p>
                        <a href={site.phoneHref} className="mt-0.5 block font-heading text-2xl font-bold text-white">
                          {site.phoneDisplay}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-[#5e99df] bg-[linear-gradient(180deg,rgba(31,132,255,0.22),rgba(16,84,166,0.16))] p-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/14 text-[#d9ebff]">
                        <Image src="/img/Whats.png" alt="" width={24} height={24} aria-hidden="true" className="h-5 w-5 object-contain" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d2e8ff]">WhatsApp</p>
                        <a href={site.whatsappHref} target="_blank" rel="noreferrer" className="mt-0.5 block font-heading text-2xl font-bold text-white">
                          {site.whatsappDisplay}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/12 bg-white/8 p-4 text-sm leading-6 text-[#e4eefc]">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#bfd8f9]">Atendimento presencial</p>
                    <p className="mt-1.5">{site.address.street}, {site.address.district}, {site.address.city} - {site.address.region}</p>
                    <p className="mt-2 font-semibold text-[#f0f6ff]">Seg a Sex - 9h às 18h | Sábados - 9h às 12h</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={site.googleMapsDirections}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#7faee2] bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#d6e8ff] transition hover:bg-white/16"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Abrir no Google Maps
                      </a>
                      <a
                        href={site.wazeDirections}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#7faee2] bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#d6e8ff] transition hover:bg-white/16"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" /></svg>
                        Abrir no Waze
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
