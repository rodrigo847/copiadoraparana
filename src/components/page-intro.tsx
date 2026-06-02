type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pt-16 pb-8 lg:px-10 lg:pt-24">
      <span className="eyebrow">Conheça-nos · {eyebrow}</span>
      <div className="mt-6 max-w-3xl">
        <h1 className="font-heading text-4xl font-bold uppercase tracking-[0.02em] text-balance text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-[#d3def0]">{description}</p>
      </div>
    </section>
  );
}
