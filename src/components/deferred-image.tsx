"use client";
import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

const empty =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E";

/** Native lazy loading can fetch several screens ahead on mobile.
 * Keep the same image box, but request offscreen artwork only near the viewport. */
export function DeferredImage(props: ImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    if (!("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <Image
        {...props}
        alt={props.alt}
        ref={ref}
        src={ready ? props.src : empty}
        unoptimized={!ready || props.unoptimized}
      />
      <noscript>
        <Image {...props} alt={props.alt} />
      </noscript>
    </>
  );
}
