import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { serviceLandingPages, site } from "@/lib/site";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

const findServicePage = (slug: string) =>
  serviceLandingPages.find((page) => page.slug === slug);

export function generateStaticParams() {
  return serviceLandingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const servicePage = findServicePage(slug);

  if (!servicePage) {
    return {
      title: "Servico nao encontrado",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical = `/servicos/${servicePage.slug}`;

  return {
    title: `${servicePage.title} | ${site.shortName}`,
    description: servicePage.metaDescription,
    keywords: servicePage.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${servicePage.title} | ${site.shortName}`,
      description: servicePage.metaDescription,
      url: canonical,
      locale: "pt_BR",
      type: "article",
      siteName: site.name,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const servicePage = findServicePage(slug);

  if (!servicePage) {
    notFound();
  }

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: servicePage.title,
    serviceType: servicePage.headline,
    description: servicePage.summary,
    areaServed: "Curitiba e regiao metropolitana",
    provider: {
      "@type": "LocalBusiness",
      name: site.name,
      url: site.domain,
      telephone: "+55 41 3078-2039",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site.domain,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Servicos",
        item: `${site.domain}/#servicos`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: servicePage.title,
        item: `${site.domain}/servicos/${servicePage.slug}`,
      },
    ],
  };

  return (
    <div className="page-shell">
      <Script id="service-jsonld" type="application/ld+json">
        {JSON.stringify(serviceJsonLd)}
      </Script>
      <Script id="breadcrumb-jsonld" type="application/ld+json">
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>

      <SiteHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <article className="section-card rounded-4xl p-6 sm:p-8 lg:p-10">
          <p className="eyebrow">Serviço especializado</p>
          <h1 className="mt-5 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {servicePage.headline}
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-8 text-muted sm:text-lg">{servicePage.summary}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {servicePage.highlights.map((highlight) => (
              <div key={highlight} className="rounded-2xl border border-[#cfe0fb] bg-white/78 p-4 text-base text-foreground">
                {highlight}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center sm:justify-start">
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#1f84ff] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#136edc]"
            >
              Solicitar atendimento no WhatsApp
            </a>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
