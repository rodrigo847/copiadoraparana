"use client";

import { useRef } from "react";

type RequestedItem = {
  title: string;
  demand: string;
  description: string;
};

type ServicesProductsCarouselProps = {
  items: RequestedItem[];
  imageMap: Record<string, string>;
};

export function ServicesProductsCarousel({ items, imageMap }: ServicesProductsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const resolveImageSrc = (title: string) => {
    const mapped = imageMap[title];
    if (!mapped) {
      return "/img/banner.jpg";
    }

    return mapped.startsWith("/img/")
      ? mapped
      : `/img/${mapped.replace(/^\//, "")}`;
  };

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector<HTMLElement>("[data-carousel-card]");
    const styles = getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "16") || 16;
    const cardWidth = firstCard?.offsetWidth ?? track.clientWidth * 0.8;
    // Scroll a bit less than one full card for a subtler, smoother transition.
    const amount = (cardWidth + gap) * 0.82;

    track.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });
  };

  return (
    <section id="servicos" className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-5">
        <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">Serviços e Produtos</h2>
        <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
          <button
            type="button"
            aria-label="Ver itens anteriores"
            onClick={() => scrollByCard(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white shadow-[0_8px_22px_rgba(4,18,37,0.35)] transition active:scale-95"
          >
            &lt;
          </button>
          <button
            type="button"
            aria-label="Ver próximos itens"
            onClick={() => scrollByCard(1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white shadow-[0_8px_22px_rgba(4,18,37,0.35)] transition active:scale-95"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label="Ver itens anteriores"
          onClick={() => scrollByCard(-1)}
          className="absolute top-1/2 left-0 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-[0_8px_22px_rgba(4,18,37,0.45)] transition hover:bg-white/20 lg:inline-flex"
        >
          &lt;
        </button>

        <div ref={trackRef} className="no-scrollbar flex snap-x snap-proximity scroll-smooth gap-3 overflow-x-auto pb-4 after:min-w-4 sm:gap-4 sm:pb-2">
          {items.map((item, index) => {
            const isRoundSticker = item.title === "Adesivos, rótulos e etiquetas";

            return (
              <article
              key={item.title}
              data-carousel-card
              className={`reveal-up min-w-[calc(100%-1rem)] snap-start overflow-hidden rounded-3xl border border-[#b6d3fb] bg-white/90 transition duration-300 hover:border-[#7eb2f3] sm:min-w-[calc(50%-0.75rem)] lg:min-w-[calc(33.333%-0.85rem)] xl:min-w-[calc(20%-0.82rem)] ${
                index % 4 === 0
                  ? "reveal-delay-1"
                  : index % 4 === 1
                    ? "reveal-delay-2"
                    : index % 4 === 2
                      ? "reveal-delay-3"
                      : "reveal-delay-4"
              }`}
            >
              <div
                className={`relative overflow-hidden ${isRoundSticker ? "bg-[#eef5ff] p-3 ring-1 ring-[#cfe0fb]" : ""}`}
                style={{ aspectRatio: "4 / 3" }}
              >
                <img
                  src={resolveImageSrc(item.title)}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: isRoundSticker ? 'contain' : 'cover', borderRadius: isRoundSticker ? '50%' : undefined }}
                  className={isRoundSticker ? "object-contain scale-90" : "object-cover"}
                  loading="lazy"
                  onError={(event) => {
                    const target = event.currentTarget;
                    if (target.src.endsWith("/img/banner.jpg")) {
                      return;
                    }
                    target.src = "/img/banner.jpg";
                  }}
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-xl font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-[0.69rem] font-semibold uppercase tracking-[0.16em] text-[#1664cf]">{item.demand}</p>
                <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
              </div>
              </article>
            );
          })}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 h-full w-10 bg-linear-to-l from-[#071f3c] to-transparent sm:hidden"
        />

        <button
          type="button"
          aria-label="Ver próximos itens"
          onClick={() => scrollByCard(1)}
          className="absolute top-1/2 right-0 z-10 hidden h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-[0_8px_22px_rgba(4,18,37,0.45)] transition hover:bg-white/20 lg:inline-flex"
        >
          &gt;
        </button>
      </div>
    </section>
  );
}