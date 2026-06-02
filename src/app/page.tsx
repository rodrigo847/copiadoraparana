import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

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
  title: "Gráfica Rápida em Curitiba | Paraná Laser Copy",
  description:
    "Gráfica rápida em Curitiba para impressão digital, adesivos, banners, encadernações e materiais corporativos com produção ágil e atendimento especializado.",
  keywords: [
    "gráfica rápida curitiba",
    "impressão digital curitiba",
    "adesivos personalizados curitiba",
    "banners curitiba",
    "encadernação curitiba",
    "copiadora paraná laser",
  ],
  alternates: {
    canonical: "/",
  },
};

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
  "Canetas personalizadas": "/img/caneta.png",
  "Displays de mesa": "/img/display.jpg",
  "Caixas em acrílico": "/img/caixa.png",
  "Sacolas personalizadas": "/img/sacolas.jpg",
  "Wobblers promocionais": "/img/wobler.jpg",
};

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
        <section id="inicio" className="mx-auto w-full max-w-7xl scroll-mt-28 px-3 pt-5 pb-7 sm:px-6 sm:pt-8 sm:pb-9 lg:px-10 lg:pt-16 lg:pb-16">
          <div className="hero-panel relative isolate overflow-hidden rounded-3xl px-4 py-6 text-white sm:rounded-[2.1rem] sm:px-8 sm:py-10 lg:px-12 lg:py-14">
            <Image
              src="/img/Fundo.png"
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="(min-width: 640px) 100vw, 0px"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                opacity: 0.85,
                borderRadius: "2.1rem",
              }}
              className="hidden object-contain object-center opacity-85 sm:block sm:object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(8,26,49,0.58)_10%,rgba(10,37,68,0.42)_55%,rgba(12,48,88,0.34)_100%)]" />

            <div className="relative z-10 grid gap-6 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>

                <h1 className="text-3xl mb-3">Bem vindo a <br></br> Copiadora Paraná Laser</h1>
                <h1 className="mb-4 max-w-2xl font-heading text-2xl font-bold tracking-tight text-balance sm:mb-6 sm:text-5xl lg:text-6xl">
                  Soluções gráficas em tempo recorde
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-[#c5dcfb] sm:mt-6 sm:text-xl sm:leading-8">
                  Impressões em alta Gramatura, Adesivos com Recorte Eletrônico, banners, Digitalizações até A0, Impressões em Acrílico, PS, Vidro e Metal, tudo com a agilidade que sua marca precisa para se destacar em Curitiba.
                </p>

                <span className="mt-4 inline-flex rounded-full bg-white/5 px-4 py-2 text-[0.72rem] tracking-[0.24em] text-[#a9cbfb]">
                  Impressões Rápidas e com Qualidade
                </span>

                <div className="mt-7 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:gap-5">
                  <a
                    href={site.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-[#1f84ff] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#136edc] sm:w-auto"
                  >
                    <Image src="/img/Whats.png" alt="" width={24} height={24} aria-hidden="true" className="h-5 w-5 object-contain mr-2" />
                    Orçar por WhatsApp
                  </a>
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
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/5 p-5 sm:rounded-4xl sm:p-9 lg:p-10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(2,10,22,0.25)]">
                <div className="absolute inset-0 rounded-4xl bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01))]" />
                <div className="relative z-10">
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

                    <a
                      href={site.whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-2xl border border-[#4f7eb5] bg-[linear-gradient(180deg,rgba(31,132,255,0.24),rgba(16,83,166,0.18))] px-3 py-3 transition hover:border-[#86b8f5] hover:bg-[linear-gradient(180deg,rgba(31,132,255,0.32),rgba(16,83,166,0.24))]"
                    >
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/14 text-[#d9ebff]">
                        <Image src="/img/Whats.png" alt="" width={20} height={20} aria-hidden="true" className="h-5 w-5 object-contain" />
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-[0.12em] text-[#c9e2ff]">WhatsApp</span>
                        <span className="block font-heading text-xl font-bold text-white">{site.whatsappDisplay}</span>
                      </span>
                    </a>
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

        <section className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.title}
                className="section-card relative isolate overflow-hidden rounded-[1.75rem] p-7 transition duration-300 hover:border-[#95c1ff]"
              >
                {service.backgroundImage ? (
                  <>
                    <Image
                      src={service.backgroundImage}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      style={{ objectFit: "cover", objectPosition: "center", opacity: 0.6, borderRadius: "1.75rem" }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(242,248,255,0.74))]" />
                  </>
                ) : null}

                <h2 className="relative z-10 mt-4 font-heading text-2xl font-bold tracking-tight text-[#08284c]">{service.title}</h2>
                <p className="relative z-10 mt-3 text-base leading-7 text-[#234a74]">{service.description}</p>
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
            <article className="reveal-up reveal-delay-1 relative isolate overflow-hidden rounded-xl border border-[#6ea5ea] p-5 text-white shadow-[0_16px_32px_rgba(7,22,44,0.32)] sm:p-6">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,21,42,0.88)_0%,rgba(5,21,42,0.78)_28%,rgba(5,21,42,0.34)_62%,rgba(5,21,42,0.08)_100%),url('/img/Empresas.png')] bg-cover bg-center" />

              <span className="relative z-10 inline-flex rounded-sm border border-[#79b3ff]/70 bg-white/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#c9e2ff]">
                Condição especial para empresas
              </span>

              <h2 className="relative z-10 mt-3 max-w-2xl font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                Faturamento com prazo para pagamento
              </h2>
              <p className="relative z-10 mt-2 max-w-2xl text-sm leading-7 text-[#e3efff] sm:text-base">
                {highlights[0]} Mediante cadastro e analise comercial, sua empresa pode centralizar pedidos com mais previsibilidade.
              </p>

              <div className="relative z-10 mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                  href={site.financialEmailHref}
                  className="inline-flex items-center justify-center rounded-md bg-[#1b8bff] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(12,81,165,0.45)] transition hover:bg-[#0f6ed7]"
                >
                  Solicitar cadastro comercial
                </a>
              </div>
            </article>
          </div>
        </section>

        <section id="projetos" className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="section-card rounded-4xl p-8 lg:p-10">
            <div className="max-w-3xl">
              <span className="eyebrow">Processos de impressão!</span>
              <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Você tem a idéia, nós temos a solução gráfica para tornar realidade. <br /><br />Veja como funciona!
              </h2>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {projectSteps.map((step, index) => (
                <article key={step.title} className="rounded-3xl border border-[#b6d3fb] bg-white/80 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">Etapa {index + 1}</p>
                  <h3 className="mt-3 font-heading text-2xl font-bold text-foreground">{step.title}</h3>
                  <p className="mt-3 text-base leading-7 text-muted">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>



        <section id="quem-somos" className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <div className="max-w-6xl border rounded-4xl border-[#cfe0fb]p-8 text-base leading-7 text-foreground p-4">
            <span className="eyebrow">Quem somos</span>
            <h2 className="mt-4 font-heading text-2xl tracking-tight text-white sm:text-3xl">
              Uma empresa do ramo de Gráfica Rápida, Impressão Digital, Comunicação Visual e Papelaria fundada em 1997, com foco em agilidade, qualidade e atendimento personalizado para clientes corporativos e individuais em Curitiba.
            </h2>
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
