"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { TokenPanel, BuyAction } from "./token-promotion";
import { WantedStars } from "./controls";
export function AudacityHero() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    let alive = true,
      dispose = () => {};
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (!alive) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from(".audacity-sky", { scale: 1.06, duration: 1.5 })
            .from(
              ".lead-character",
              { y: 35, opacity: 0, duration: 1.1, stagger: 0.1 },
              0.1,
            )
            .from(".audacity-title", { y: 45, opacity: 0, duration: 0.9 }, 0.25)
            .from(
              ".campaign-copy,.audacity-contract",
              { y: 20, opacity: 0, duration: 0.7 },
              0.5,
            );
          if (matchMedia("(min-width:900px) and (pointer:fine)").matches) {
            gsap.to(".audacity-sky", {
              yPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: ref.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          }
        }, ref);
        dispose = () => ctx.revert();
      },
    );
    return () => {
      alive = false;
      dispose();
    };
  }, []);
  return (
    <section className="audacity-hero" ref={ref}>
      <div className="audacity-sky">
        <Image
          src="/assets/backgrounds/leonida-dusk.webp"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="audacity-grade" />
      <div className="hero-overline mono">
        <span>A SOLANA ORIGINAL. A LEONIDA STATE OF MIND.</span>
        <span>HIGH AMBITION / NO APOLOGIES</span>
      </div>
      <h1 className="audacity-title">
        AUDACITY<span aria-hidden="true">®</span>
      </h1>
      <div className="support-character support-cal">
        <Image
          src="/assets/audacity/cal.webp"
          alt="Cal Hampton"
          fill
          sizes="25vw"
        />
      </div>
      <div className="support-character support-boobie">
        <Image
          src="/assets/audacity/boobie.webp"
          alt="Boobie Ike"
          fill
          sizes="25vw"
        />
      </div>
      <div className="lead-character lead-jason">
        <Image
          src="/assets/audacity/jason.webp"
          alt="Jason Duval, original fan artwork"
          fill
          priority
          sizes="(max-width:700px) 75vw, 45vw"
        />
      </div>
      <div className="lead-character lead-lucia">
        <Image
          src="/assets/audacity/lucia.webp"
          alt="Lucia Caminos, original fan artwork"
          fill
          priority
          sizes="(max-width:700px) 75vw, 45vw"
        />
      </div>
      <div className="hero-floor" />
      <div className="campaign-copy">
        <p className="eyebrow">FORTUNE DOESN’T ASK PERMISSION.</p>
        <h2>
          NO GUTS. NO GLORY.
          <br />
          <em>JUST AUDACITY.</em>
        </h2>
        <p>
          A little nerve. A lot of ambition.
          <br />
          The bold have a new home on Solana.
        </p>
        <Link href="/cast">
          Meet the faces of Leonida
          <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="audacity-contract">
        <TokenPanel />
      </div>
      <div className="hero-wanted">
        <WantedStars />
        <span className="mono">MAKE YOUR PRESENCE KNOWN.</span>
      </div>
      <a className="audacity-scroll" href="#leonida">
        <ArrowDown size={15} />
        <span>TAKE THE LONG WAY DOWN</span>
      </a>
      <div className="film-grain" />
    </section>
  );
}
export function AudacityTakeover() {
  return (
    <section className="audacity-takeover" id="final-job">
      <div className="takeover-backdrop">
        <Image
          src="/assets/backgrounds/leonida-dusk.webp"
          alt=""
          fill
          sizes="100vw"
        />
      </div>
      <div className="takeover-heading">
        <p className="eyebrow">THE LAST WORD BELONGS TO THE BOLD.</p>
        <h2>AUDACITY</h2>
        <WantedStars large />
      </div>
      <div className="takeover-cast" aria-label="The complete Leonida ensemble">
        {[
          "cal",
          "boobie",
          "raul",
          "jason",
          "lucia",
          "drequan",
          "real-dimez",
          "brian",
        ].map((id, i) => (
          <div key={id} className={"ensemble-person person-" + i}>
            <Image
              src={"/assets/audacity/" + id + ".webp"}
              alt={
                id === "real-dimez"
                  ? "Bae-Luxe and Roxy"
                  : id === "drequan"
                    ? "Dre’Quan Priest"
                    : id === "boobie"
                      ? "Boobie Ike"
                      : id === "raul"
                        ? "Raul Bautista"
                        : id === "brian"
                          ? "Brian Heder"
                          : id === "cal"
                            ? "Cal Hampton"
                            : id === "jason"
                              ? "Jason Duval"
                              : "Lucia Caminos"
              }
              fill
              sizes="(max-width:700px) 50vw, 22vw"
            />
          </div>
        ))}
      </div>
      <div className="takeover-action">
        <p>LEONIDA BELONGS TO THE BOLD.</p>
        <TokenPanel final />
      </div>
      <div className="film-grain" />
    </section>
  );
}
export function HowToBuy() {
  return (
    <section className="how-to-buy" id="how-to-buy">
      <div>
        <p className="eyebrow">YOUR NEXT MOVE</p>
        <h2>
          MAKE IT
          <br />
          <em>AUDACIOUS.</em>
        </h2>
        <p>
          Your wallet. Your decision.
          <br />
          Three steps to your next move.
        </p>
        <div className="how-buy-action">
          <BuyAction long />
        </div>
      </div>
      <ol>
        <li>
          <span>01</span>
          <div>
            <h3>GET A SOLANA WALLET.</h3>
            <p>
              Download{" "}
              <a
                href="https://phantom.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Phantom
              </a>{" "}
              or use your favorite Solana wallet to get started.
            </p>
          </div>
        </li>
        <li>
          <span>02</span>
          <div>
            <h3>LOAD UP ON SOL.</h3>
            <p>
              Add SOL to your wallet and keep a little extra for network fees.
            </p>
          </div>
        </li>
        <li>
          <span>03</span>
          <div>
            <h3>BUY AUDACITY ON PUMP.FUN.</h3>
            <p>
              Head to our official Pump.fun token page, verify the contract
              address, and make your move.
            </p>
          </div>
        </li>
      </ol>
    </section>
  );
}
