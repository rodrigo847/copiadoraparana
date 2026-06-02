"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";

import { navLinks, site } from "@/lib/site";

export function SiteHeader() {
  const [logoError, setLogoError] = useState(false);
  const [currentSection, setCurrentSection] = useState("inicio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = navLinks
      .filter((item) => item.href.startsWith("/#"))
      .map((item) => item.href.slice(2));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setCurrentSection(visibleEntry.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-40% 0px -45% 0px",
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;

    const pendingSection = window.sessionStorage.getItem("plc-scroll-target");
    if (!pendingSection) return;

    window.sessionStorage.removeItem("plc-scroll-target");
    window.requestAnimationFrame(() => {
      const target = document.getElementById(pendingSection);
      if (!target) return;

      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", "/");
      setCurrentSection(pendingSection);
    });
  }, [pathname]);

  const getSectionIdFromHref = (href: string) => {
    if (!href.startsWith("/#")) return null;
    return href.slice(2);
  };

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", "/");
    setCurrentSection(sectionId);
  };

  const isActive = (href: string) => {
    const sectionId = getSectionIdFromHref(href);
    if (sectionId) {
      return pathname === "/" && currentSection === sectionId;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleSectionNavigation = (
    sectionId: string,
    event?: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (pathname !== "/") {
      window.sessionStorage.setItem("plc-scroll-target", sectionId);
      setMobileMenuOpen(false);
      return;
    }

    event?.preventDefault();
    scrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const isExternalLink = (href: string) => /^https?:\/\//.test(href);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071f3c]/92 text-white backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          <Link href="/" className="flex items-center" onClick={(event) => handleSectionNavigation("inicio", event)}>
            {!logoError ? (
              <img
                src="/img/logo.png"
                alt="Paraná Laser Copy"
                width="260"
                height="56"
                className="h-10 w-auto object-contain sm:h-12"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="font-heading text-lg font-bold tracking-tight text-white">{site.shortName}</span>
            )}
          </Link>

          <nav className="hidden items-center gap-3 text-sm font-medium lg:flex">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              const isHashLink = item.href.startsWith("/#");
              const isBudgetLink = item.href === "/orcafacil";
              const externalLink = isExternalLink(item.href);

              // Estilo especial para o botão Orça Fácil
              if (isBudgetLink) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex items-center gap-2 rounded-full bg-[#1681ff] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(22,129,255,0.45)] transition hover:bg-[#0d69d7] border border-[#1681ff] ${active ? "brightness-110" : ""}`}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="6" y="2.8" width="12" height="18.4" rx="2.2" />
                      <path d="M9.4 7.2h5.2M9.4 10.2h5.2M9.4 13.2h5.2M12 17.2h.01" />
                    </svg>
                    <span>Orça Fácil</span>
                  </Link>
                );
              }

              const linkProps = {
                className: `group relative rounded-full px-3 py-2 transition ${
                  active
                    ? "rounded-md border border-[#4f7eb5] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] text-white shadow-[0_6px_20px_rgba(7,18,35,0.35)]"
                    : "rounded-md border border-transparent text-[#c1d8f8] hover:border-[#335b8a] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] hover:text-white"
                }`,
              };

              const childElement = (
                <>
                  <span className="tracking-[0.01em]">{item.label}</span>
                  <span
                    className={`pointer-events-none absolute -bottom-px left-1/2 h-0.5 -translate-x-1/2 bg-linear-to-r from-[#78b8ff] to-[#1681ff] transition-all duration-300 ${
                      active
                        ? "w-[68%] opacity-100"
                        : "w-0 opacity-0 group-hover:w-[52%] group-hover:opacity-80"
                    }`}
                  />
                </>
              );

              if (isHashLink) {
                const sectionId = getSectionIdFromHref(item.href);
                if (!sectionId) return null;

                return (
                  <Link
                    key={item.href}
                    href="/"
                    onClick={(event) => handleSectionNavigation(sectionId, event)}
                    aria-current={active ? "page" : undefined}
                    {...linkProps}
                  >
                    {childElement}
                  </Link>
                );
              }

              if (externalLink) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    {...linkProps}
                  >
                    {childElement}
                  </a>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  {...linkProps}
                >
                  {childElement}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1681ff] px-3 py-2 text-xs font-semibold text-white shadow-[0_8px_30px_rgba(22,129,255,0.45)] transition hover:bg-[#0d69d7] sm:px-4 sm:text-sm"
            >
              <img src="/img/Whats.png" alt="" width="18" height="18" aria-hidden="true" className="h-4 w-4 object-contain sm:h-4.5 sm:w-4.5" />
              <span className="hidden sm:inline">Atendimento</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>

            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#2f5785] bg-[#0a2e57] text-[#d5e7ff] shadow-lg transition hover:border-[#72a9e6] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#1681ff] lg:hidden"
            >
              {mobileMenuOpen ? (
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <nav
          id="mobile-menu"
          className={`fixed left-0 top-0 z-40 w-full transition-all duration-300 lg:hidden ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          style={{ minHeight: "100dvh" }}
        >
          <div className="flex min-h-screen flex-col items-center justify-center bg-[#071f3c]/95 px-6 py-10 shadow-2xl">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              const isBudgetLink = item.href === "/orcafacil";
              const externalLink = isExternalLink(item.href);
              const isHashLink = item.href.startsWith("/#");
              const sectionId = getSectionIdFromHref(item.href);

              if (isHashLink && sectionId) {
                return (
                  <Link
                    key={item.href}
                    href="/"
                    onClick={(event) => handleSectionNavigation(sectionId, event)}
                    aria-current={active ? "page" : undefined}
                    className={`mb-3 w-full max-w-xs rounded-2xl border-2 px-6 py-4 text-lg font-semibold shadow-md transition-all duration-200 text-center ${
                      active
                        ? "border-[#72a9e6] bg-[#0f3d70] text-white"
                        : "border-[#2f5785] bg-[#0a2e57] text-[#c8ddf7] hover:bg-[#12305a] hover:text-white"
                    }`}
                    style={{ letterSpacing: "0.01em" }}
                  >
                    {item.label}
                  </Link>
                );
              }

              if (externalLink) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`mb-3 w-full max-w-xs rounded-2xl border-2 px-6 py-4 text-lg font-semibold shadow-md transition-all duration-200 text-center ${
                      isBudgetLink
                        ? "border-[#8bc0ff] bg-[linear-gradient(135deg,#2f97ff_0%,#1a7ff8_50%,#1469de_100%)] text-white shadow-[0_8px_20px_rgba(20,105,222,0.38)]"
                        : "border-[#2f5785] bg-[#0a2e57] text-[#c8ddf7] hover:bg-[#12305a] hover:text-white"
                    }`}
                    style={{ letterSpacing: "0.01em" }}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    closeMobileMenu();
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`mb-3 w-full max-w-xs rounded-2xl border-2 px-6 py-4 text-lg font-semibold shadow-md transition-all duration-200 text-center ${
                    isBudgetLink
                      ? "border-[#8bc0ff] bg-[linear-gradient(135deg,#2f97ff_0%,#1a7ff8_50%,#1469de_100%)] text-white shadow-[0_8px_20px_rgba(20,105,222,0.38)]"
                      : active
                      ? "border-[#72a9e6] bg-[#0f3d70] text-white"
                      : "border-[#2f5785] bg-[#0a2e57] text-[#c8ddf7] hover:bg-[#12305a] hover:text-white"
                  }`}
                  style={{ letterSpacing: "0.01em" }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
