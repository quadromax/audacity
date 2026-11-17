"use client";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Download,
  Share2,
  Check,
  RotateCcw,
} from "lucide-react";
import { useToken } from "@/hooks/use-token";
import { useWanted, type Discovery } from "../providers";
import { WantedStars } from "./controls";

const objectives: {
  id: Discovery;
  title: string;
  description: string;
  href: string;
}[] = [
  {
    id: "dossier",
    title: "Open the Leonida Files.",
    description: "Read a character dossier.",
    href: "#dossier",
  },
  {
    id: "evidence",
    title: "Meet the crew.",
    description: "Choose another character.",
    href: "#dossier",
  },
  {
    id: "route",
    title: "The Real Dimez.",
    description: "Discover Bae-Luxe and Roxy.",
    href: "#dossier",
  },
  {
    id: "market",
    title: "Follow the frequency.",
    description: "Visit the market terminal.",
    href: "#market",
  },
  {
    id: "transmission",
    title: "Spread the word.",
    description: "Open sharing or copy the scene link.",
    href: "#transmissions",
  },
];
export function WantedLevel() {
  const { found, reset } = useWanted(),
    [confirm, setConfirm] = useState(false);
  const next = objectives.find((o) => !found.includes(o.id));
  const ranks = [
    "OFF THE RADAR",
    "PERSON OF INTEREST",
    "GETTING NOTICED",
    "ON THE RECORD",
    "HEAT IS RISING",
    "LEONIDA LEGEND",
  ];
  return (
    <section className="wanted-scene wanted-upgrade" id="wanted">
      <div className="wanted-copy">
        <p className="eyebrow">04 / LEONIDA WANTED SYSTEM</p>
        <h2>
          MAKE A<br />
          <em>NAME FOR</em>
          <br />
          YOURSELF.
        </h2>
        <div className="wanted-readout">
          <strong>{String(found.length).padStart(2, "0")}</strong>
          <div>
            <span className="mono">WANTED LEVEL / 05</span>
            <h3>{ranks[found.length]}</h3>
          </div>
        </div>
        <div
          className="mission-progress"
          role="progressbar"
          aria-label="Discovery progress"
          aria-valuemin={0}
          aria-valuemax={5}
          aria-valuenow={found.length}
        >
          <span style={{ width: found.length * 20 + "%" }} />
        </div>
        <div className="mission-context">
          <span className="mono">
            {next ? "NEXT ON YOUR RECORD" : "YOUR RECORD IS COMPLETE"}
          </span>
          <p>
            {next
              ? next.description
              : "Nine faces. Five discoveries. You know your way around Leonida."}
          </p>
        </div>
        <p className="cosmetic-label">
          YOUR DEVICE. YOUR RECORD.
          <br />
          Cosmetic progress, saved in this browser.
        </p>
      </div>
      <div className="wanted-interaction">
        <div className="wanted-display">
          <WantedStars large />
          <div className="wanted-meter mono" aria-live="polite">
            <span>{found.length} / 05 DISCOVERIES</span>
            <span>LOCAL RECORD</span>
          </div>
        </div>
        <ol className="discovery-list">
          {objectives.map((item, i) => (
            <li
              key={item.id}
              className={found.includes(item.id) ? "discovered" : ""}
            >
              <a href={item.href}>
                <span className="discovery-number">
                  {found.includes(item.id) ? (
                    <Check size={18} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    {found.includes(item.id)
                      ? "RECORDED ON THIS DEVICE"
                      : item.description}
                  </small>
                </span>
                <ArrowUpRight size={17} />
              </a>
            </li>
          ))}
        </ol>
        <div className="mission-reset">
          {confirm ? (
            <div
              className="reset-confirm"
              role="group"
              aria-label="Confirm record reset"
            >
              <span>Clear all five discoveries?</span>
              <button
                onClick={() => {
                  reset();
                  setConfirm(false);
                }}
              >
                Yes, reset record
              </button>
              <button onClick={() => setConfirm(false)}>Keep record</button>
            </div>
          ) : (
            <button
              className="reset-record"
              disabled={!found.length}
              onClick={() => setConfirm(true)}
            >
              <RotateCcw size={13} />
              Reset this device’s record
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
const artworks = [
  {
    id: "afterhours",
    title: "AFTER HOURS.",
    subtitle: "The Keys don’t close.",
    src: "/assets/backgrounds/leonida-afterhours-v4.webp",
    download: "/assets/backgrounds/leonida-afterhours-v4.png",
    label: "AUDACITY / after hours",
  },
  {
    id: "postcard",
    title: "BAD INFLUENCE.",
    subtitle: "Greetings from the other side.",
    src: "/assets/backgrounds/leonida-dusk.webp",
    download: "/assets/backgrounds/leonida-dusk.png",
    label: "Leonida / postcard",
  },
];
export function Transmissions() {
  const [selected, setSelected] = useState(0),
    [message, setMessage] = useState(""),
    { discover } = useWanted(),
    { token } = useToken(),
    art = artworks[selected];
  async function share() {
    try {
      const url = `${location.origin}/#transmissions`;
      if (navigator.share) {
        const sharing = navigator.share({
          title: `AUDACITY — ${art.title}`,
          text: art.subtitle,
          url,
        });
        discover("transmission");
        await sharing;
        setMessage("Share interface closed.");
      } else {
        await navigator.clipboard.writeText(url);
        discover("transmission");
        setMessage("Scene link copied.");
      }
    } catch (e) {
      setMessage(
        e instanceof DOMException && e.name === "AbortError"
          ? "Share cancelled."
          : "Sharing isn’t available. You can save the artwork instead.",
      );
    }
  }
  return (
    <section className="transmissions-scene" id="transmissions">
      <div className="scene-index mono">
        <span>05 / PUT THE WORD OUT</span>
        <span>ORIGINAL ART. OPEN FREQUENCY.</span>
      </div>
      <div className="transmission-layout">
        <div className="transmission-art">
          <Image
            key={art.src}
            src={art.src}
            alt={art.label + " — original fan artwork"}
            fill
            sizes="(max-width:700px) 100vw, 55vw"
          />
          <div className="transmission-grade" />
          <span className="mono">LEONIDA TRANSMISSION / 0{selected + 1}</span>
          <div>
            <p>{art.subtitle}</p>
            <h3>{art.title}</h3>
            <span className="mono">AUDACITY / UNOFFICIAL FAN ART</span>
          </div>
        </div>
        <div className="transmission-copy">
          <p className="eyebrow">THE SIGNAL IS YOURS</p>
          <h2>
            GOOD STORIES
            <br />
            <em>GET AROUND.</em>
          </h2>
          <p>
            No borrowed hype. Just original scenes from our side of Leonida.
            Save one. Pass it on. Give someone a reason to take the wrong turn.
          </p>
          <div className="art-selector" aria-label="Select artwork">
            {artworks.map((a, i) => (
              <button
                key={a.id}
                aria-pressed={i === selected}
                onClick={() => setSelected(i)}
              >
                <span className="mono">0{i + 1}</span>
                {a.label}
                <ArrowRight size={15} />
              </button>
            ))}
          </div>
          <div className="transmission-actions">
            <a className="world-button" href={art.download} download>
              Save artwork
              <Download size={16} />
            </a>
            <button
              className="share-scene"
              onClick={share}
              aria-label="Share this scene"
            >
              <Share2 size={18} />
            </button>
          </div>
          <p className="world-feedback" role="status">
            {message}
          </p>
          {Object.values(token.socials).some(Boolean) && (
            <div className="metadata-socials">
              <span className="mono">
                TOKEN CHANNELS / FROM PUBLIC METADATA
              </span>
              {Object.entries(token.socials)
                .filter(([, url]) => url)
                .map(([type, url]) => (
                  <a
                    key={type}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {type === "x"
                      ? "Follow the signal on X"
                      : type === "telegram"
                        ? "Find the crew on Telegram"
                        : "Join the Discord"}
                    <ArrowUpRight size={16} />
                  </a>
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
