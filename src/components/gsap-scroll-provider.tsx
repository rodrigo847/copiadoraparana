"use client";

import { useEffect } from "react";

export function GsapScrollProvider() {
  useEffect(() => {
    let smoother: { kill: () => void } | null = null;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    let isMounted = true;

    const setup = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { ScrollSmoother } = await import("gsap/ScrollSmoother");

      if (!isMounted) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.15,
        smoothTouch: 0,
        normalizeScroll: true,
      });
    };

    setup();

    return () => {
      isMounted = false;
      smoother?.kill();
    };
  }, []);

  return null;
}