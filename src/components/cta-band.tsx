import { site } from "@/lib/site";

export function CtaBand() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
      <div className="rounded-4xl border border-[#18457f] bg-gradient-to-r from-[#082249] via-[#0c2e5e] to-[#13427e] p-8 text-white shadow-[0_25px_70px_rgba(5,25,52,0.45)] lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-[#3f70a8] bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#afd0ff]">
              Atendimento Personalizado
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Deseja um atendimento humano, ágil e focado em resultados para suas demandas de impressão?
            </h2>
            <p className="mt-4 text-base leading-7 text-[#b9d6fb]">
              Faça-nos uma visita, envie uma mensagem ou solicite um orçamento por e-mail. Estamos prontos para ajudar a transformar suas ideias em realidade com qualidade e eficiência.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#1c84ff] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#126bda]"
            >
              Atendimento WhatsApp
            </a>
            <a
              href={`mailto:${site.email}`}
              className="rounded-full border border-[#4e7eb5] px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-[#74a6df] hover:text-[#d7eaff]"
            >
              Solicitar proposta
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
