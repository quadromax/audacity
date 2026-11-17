"use client";
import { DeferredImage as Image } from "../deferred-image";
import { useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus, Minus } from "lucide-react";
import { characters, characterSource } from "@/config/characters";
import { useWanted } from "../providers";
export function CastGallery() {
  const [index, setIndex] = useState(0),
    [expanded, setExpanded] = useState(false),
    start = useRef<number | null>(null),
    reduced = useReducedMotion(),
    { discover } = useWanted(),
    entry = characters[index];
  function select(next: number) {
    const n = (next + characters.length) % characters.length;
    setIndex(n);
    setExpanded(false);
    if (n !== 0) discover("evidence");
    if (n === 5) discover("route");
  }
  return (
    <section
      className="cast-gallery"
      id="dossier"
      style={{ "--cast-accent": entry.accent } as CSSProperties}
    >
      <div className="cast-heading">
        <div>
          <p className="eyebrow">02 / THE PEOPLE WHO MAKE THE PLACE</p>
          <h2>
            THE LEONIDA<span>FILES.</span>
          </h2>
        </div>
        <p>
          Eight entries. Nine unforgettable faces.
          <br />
          Everybody wants something.
        </p>
      </div>
      <div
        className="cast-stage"
        onPointerDown={(e) => {
          if (e.pointerType === "touch") start.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (e.pointerType === "touch" && start.current !== null) {
            const diff = e.clientX - start.current;
            if (Math.abs(diff) > 55) select(index + (diff < 0 ? 1 : -1));
            start.current = null;
          }
        }}
      >
        <div className="cast-atmosphere">
          <Image src="/assets/backgrounds/leonida-dusk.webp" alt="" fill sizes="100vw" />
        </div>
        <span className="cast-giant-index" aria-hidden="true">
          0{index + 1}
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            className={
              "cast-portrait " + (entry.id === "real-dimez" ? "duo" : "")
            }
            key={entry.id}
            initial={reduced ? false : { opacity: 0, x: 35, scale: 1.025 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: reduced ? 0 : -20 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
          >
            <Image
              src={"/assets/audacity/" + entry.image + ".webp"}
              alt={
                entry.id === "real-dimez"
                  ? "Original fan art of both Real Dimez members, Bae-Luxe and Roxy"
                  : "Original fan art of " + entry.name
              }
              fill
              sizes="(max-width:700px) 100vw, 65vw"
            />
          </m.div>
        </AnimatePresence>
        <div
          className="cast-profile"
          role="tabpanel"
          id="cast-panel"
          aria-labelledby={"cast-tab-" + entry.id}
          tabIndex={0}
        >
          <p className="mono">AUDACITY / CHARACTER ARCHIVE / 0{index + 1}</p>
          <AnimatePresence mode="wait" initial={false}>
            <m.h3
              key={entry.id}
              initial={reduced ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
            >
              {entry.name}
            </m.h3>
          </AnimatePresence>
          <span className="cast-role">{entry.role}</span>
          <p className="cast-bio">{entry.bio}</p>
          <button
            className="file-toggle"
            aria-expanded={expanded}
            onClick={() => {
              setExpanded(!expanded);
              discover("dossier");
            }}
          >
            {expanded ? "Close dossier" : "Open dossier"}
            {expanded ? <Minus size={16} /> : <Plus size={16} />}
          </button>
          {expanded && (
            <div className="cast-details">
              <dl>
                <div>
                  <dt>PROFILE</dt>
                  <dd>{entry.name}</dd>
                </div>
                <div>
                  <dt>SETTING</dt>
                  <dd>{entry.location}</dd>
                </div>
                {entry.id === "real-dimez" && (
                  <div>
                    <dt>MEMBERS</dt>
                    <dd>Bae-Luxe · Roxy</dd>
                  </div>
                )}
              </dl>
              <a
                href={characterSource}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the official Rockstar profile
                <ArrowUpRight size={13} />
              </a>
              <small>
                Biography paraphrased from Rockstar. Artwork and thematic labels
                are original fan interpretations.
              </small>
            </div>
          )}
        </div>
        <div className="cast-controls">
          <span className="mono">0{index + 1} / 08</span>
          <button
            aria-label="Previous character"
            onClick={() => select(index - 1)}
          >
            <ArrowLeft />
          </button>
          <button aria-label="Next character" onClick={() => select(index + 1)}>
            <ArrowRight />
          </button>
        </div>
      </div>
      <div
        className="cast-roster"
        role="tablist"
        aria-label="The Leonida Files characters"
      >
        {characters.map((c, i) => (
          <button
            role="tab"
            id={"cast-tab-" + c.id}
            aria-controls="cast-panel"
            aria-selected={i === index}
            tabIndex={i === index ? 0 : -1}
            key={c.id}
            onClick={() => select(i)}
            onKeyDown={(e) => {
              if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
                e.preventDefault();
                const n =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? 7
                      : (i + (e.key === "ArrowRight" ? 1 : 7)) % 8;
                select(n);
                document
                  .getElementById("cast-tab-" + characters[n].id)
                  ?.focus();
              }
            }}
          >
            <span className="roster-art">
              <Image
                src={"/assets/audacity/" + c.image + ".webp"}
                alt=""
                fill
                sizes="(max-width:700px) 90px, 140px"
              />
            </span>
            <span className="mono">0{i + 1}</span>
            <strong>{c.short}</strong>
          </button>
        ))}
      </div>
      <p className="cast-source">
        Original fan artwork. Character biographies reference{" "}
        <a href={characterSource} target="_blank" rel="noopener noreferrer">
          Rockstar’s official profiles ↗
        </a>
        . AUDACITY is not affiliated with Rockstar Games.
      </p>
    </section>
  );
}
