"use client";
import { DeferredImage as Image } from "../deferred-image";
import { ArrowUpRight, MoveUpRight } from "lucide-react";
import { useState } from "react";
const locations = [
  {
    title: "THE LONG WAY HOME.",
    name: "The causeway",
    src: "/assets/backgrounds/leonida-causeway.webp",
    alt: "A burgundy muscle car on a causeway over turquoise water in the fictional Leonida Keys",
    copy: "One road in. A hundred reasons to stay. Out here, the long way is the only way worth taking.",
    note: "EXHIBIT 01 / THE KEYS",
  },
  {
    title: "ROOM FOR ONE MORE.",
    name: "The waterfront",
    src: "/assets/backgrounds/leonida-dusk.webp",
    alt: "A sunset motel beside the Leonida waterfront",
    copy: "Cash up front. No questions at the desk. Somewhere behind the neon, a new story is already checking in.",
    note: "EXHIBIT 02 / THE WATERFRONT",
  },
  {
    title: "AFTER DARK, ANYTHING.",
    name: "After hours",
    src: "/assets/backgrounds/leonida-afterhours-v4.webp",
    alt: "Jason-inspired character standing on a rain-wet street outside a neon motel",
    copy: "The city changes its colors. The rules get harder to read. Keep your eyes on the road.",
    note: "EXHIBIT 03 / AFTER HOURS",
  },
];
export function Leonida() {
  const [selected, setSelected] = useState(0),
    place = locations[selected];
  return (
    <section className="leonida-scene director-leonida" id="leonida">
      <div className="leonida-intro">
        <p className="eyebrow">
          <span className="chapter-disc">01</span> POSTCARDS FROM THE OTHER SIDE
        </p>
        <h2>
          PARADISE.
          <br />
          <em>WITH A PAST.</em>
        </h2>
        <div className="leonida-description">
          <p>
            Beautiful from a distance.
            <br />A little more complicated up close.
          </p>
          <p>
            Welcome to our side of Leonida.
            <br />
            Stay a while. Leave a little different.
          </p>
        </div>
        <span className="leonida-script">Wish you weren’t here.</span>
      </div>
      <div className="location-gallery">
        <div className="landscape-frame" key={place.src}>
          <Image
            src={place.src}
            alt={place.alt}
            fill
            sizes="(max-width:700px) 100vw, 76vw"
            quality={90}
          />
          <div className="landscape-overlay" />
          <div className="location-caption">
            <span className="mono">{place.note}</span>
            <h3>{place.title}</h3>
            <p>{place.copy}</p>
          </div>
          <span className="location-count mono">0{selected + 1} / 03</span>
          <MoveUpRight className="location-arrow" size={36} />
        </div>
        <div
          className="location-selector"
          role="group"
          aria-label="Explore Leonida locations"
        >
          {locations.map((location, i) => (
            <button
              key={location.name}
              aria-pressed={i === selected}
              onClick={() => setSelected(i)}
            >
              <span className="mono">0{i + 1}</span>
              <span>{location.name}</span>
              <ArrowUpRight size={17} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
