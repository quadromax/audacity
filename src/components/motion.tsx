"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function SmoothScroll() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    let alive = true,
      dispose = () => {};
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (!alive) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          gsap.utils
            .toArray<HTMLElement>(
              ".leonida-intro h2,.cast-heading h2,.exchange-heading h2,.wanted-copy h2,.transmission-copy h2,.takeover-heading h2",
            )
            .forEach((el) =>
              gsap.from(el, {
                y: 32,
                opacity: 0.4,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 94%", once: true },
              }),
            );
          if (matchMedia("(min-width:900px) and (pointer:fine)").matches) {
            if (document.querySelector(".landscape-frame"))
              gsap.to(".landscape-frame img", {
                yPercent: -8,
                ease: "none",
                scrollTrigger: {
                  trigger: ".landscape-frame",
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              });
            if (document.querySelector(".evidence-photo"))
              gsap.from(".evidence-photo", {
                rotation: -7,
                y: 30,
                duration: 1.1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: ".evidence-photo",
                  start: "top 90%",
                  once: true,
                },
              });
          }
        });
        dispose = () => ctx.revert();
      },
    );
    return () => {
      alive = false;
      dispose();
    };
  }, [path]);
  return null;
}
