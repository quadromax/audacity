"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { ArrowUpRight, Menu, X, ArrowUp } from "lucide-react";
import { AddressDisplay, CopyCA, LaunchStatus } from "./token-promotion";
import { WantedStars } from "./controls";
import { useToken } from "@/hooks/use-token";
import { AudioWidget } from "./audio-widget";
const links = [
  ["/#leonida", "The world"],
  ["/cast", "The cast"],
  ["/markets", "The exchange"],
  ["/how-to-buy", "How to buy"],
];
export function WorldHeader() {
  const [open, setOpen] = useState(false),
    path = usePathname(),
    dialog = useRef<HTMLDialogElement>(null),
    button = useRef<HTMLButtonElement>(null),
    { config, token } = useToken();
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  function close() {
    setOpen(false);
    button.current?.focus();
  }
  return (
    <>
      <header className={`world-header ${path !== "/" ? "solid" : ""}`}>
        <Link className="world-brand" href="/" aria-label="AUDACITY home">
          AUDACITY<span>®</span>
          <i>
            LEONIDA
            <br />
            STATE OF MIND
          </i>
        </Link>
        <nav className="world-nav" aria-label="Main navigation">
          {links.map(([href, label], i) => (
            <Link key={href} href={href}>
              <sup>0{i + 1}</sup>
              {label}
            </Link>
          ))}
        </nav>
        <Link
          className="nav-wanted"
          href="/#wanted"
          aria-label="View your cosmetic wanted level"
        >
          <WantedStars />
          <small>YOUR WANTED LEVEL</small>
        </Link>
        {config.pump && (
          <a
            className="nav-buy"
            href={config.pump}
            target="_blank"
            rel="noopener noreferrer"
          >
            ${token.symbol}
            <ArrowUpRight size={14} />
          </a>
        )}
        <AudioWidget />
        <button
          className="world-menu-button"
          ref={button}
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={23} />
        </button>
      </header>
      <dialog
        className="world-menu"
        ref={dialog}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        aria-label="Explore Leonida"
      >
        <AnimatePresence>
          {open && (
            <m.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="menu-top">
                <span className="mono">LEONIDA / MAIN MENU</span>
                <button autoFocus aria-label="Close menu" onClick={close}>
                  <X />
                </button>
              </div>
              <nav aria-label="Mobile navigation">
                {[...links, ["/about", "Behind the story"]].map(
                  ([href, label], i) => (
                    <Link key={href} href={href} onClick={close}>
                      <span>0{i + 1}</span>
                      {label}
                      <ArrowUpRight />
                    </Link>
                  ),
                )}
              </nav>
              <div className="menu-bottom">
                <WantedStars />
                <p>
                  A little heat never hurt.
                  <br />
                  The Leonida state of mind.
                </p>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </dialog>
    </>
  );
}
export function WorldFooter() {
  const { token } = useToken();
  return (
    <footer className="world-footer">
      <div className="footer-wordmark">
        AUDACITY<span>NO GUTS. NO GLORY. JUST AUDACITY.</span>
      </div>
      <div className="world-footer-nav">
        <Link href="/#dossier">The files</Link>
        <Link href="/markets">The exchange</Link>
        <Link href="/about">About & disclosures</Link>
        {Object.entries(token.socials)
          .filter(([, url]) => url)
          .map(([type, url]) => (
            <a key={type} href={url!} target="_blank" rel="noopener noreferrer">
              {type.toUpperCase()} ↗
            </a>
          ))}
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
                ? "instant"
                : "smooth",
            })
          }
        >
          Back to the scene
          <ArrowUp size={15} />
        </button>
      </div>
      <div className="footer-contract">
        <AddressDisplay />
        <CopyCA />
        <LaunchStatus />
      </div>
      <div className="world-legal" id="legal">
        <p>
          UNOFFICIAL FAN EXPERIENCE. Not affiliated with Rockstar Games or
          Take-Two Interactive. Original fan-inspired artwork and sourced
          character summaries.
        </p>
        <p>
          Meme tokens are speculative and may lose all value. No guaranteed
          returns. Cosmetic wanted levels have no financial value.
          <br />
          <a href="/licenses/lightweight-charts-NOTICE.txt">
            Chart attribution
          </a>
          {" · "}
          <a href="/licenses/lightweight-charts-LICENSE.txt">
            Open-source license
          </a>
        </p>
        <span className="mono">
          SOLANA / AUDACITY
          <br />© {new Date().getFullYear()} AUDACITY
        </span>
      </div>
    </footer>
  );
}
