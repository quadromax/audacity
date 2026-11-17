"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import type { SiteConfig } from "@/config/site";
const Context = createContext<SiteConfig | null>(null);
export const useSite = () => useContext(Context)!;
export async function api<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok)
    throw new Error("The signal is temporarily unavailable. Try again.");
  return response.json();
}
export const discoveries = [
  "dossier",
  "evidence",
  "route",
  "market",
  "transmission",
] as const;
export type Discovery = (typeof discoveries)[number];
const Wanted = createContext<{
  found: Discovery[];
  discover: (id: Discovery) => void;
  reset: () => void;
}>({ found: [], discover: () => {}, reset: () => {} });
export const useWanted = () => useContext(Wanted);
export function Providers({
  config,
  children,
}: {
  config: SiteConfig;
  children: React.ReactNode;
}) {
  const [q] = useState(() => new QueryClient()),
    [found, setFound] = useState<Discovery[]>([]);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("audacity-discoveries-v3") || "[]",
      );
      if (Array.isArray(saved))
        setFound([
          ...new Set(
            saved.filter((id): id is Discovery => discoveries.includes(id)),
          ),
        ]);
    } catch {}
  }, []);
  const discover = useCallback(
    (id: Discovery) =>
      setFound((current) => {
        if (current.includes(id)) return current;
        const next = [...current, id];
        try {
          localStorage.setItem("audacity-discoveries-v3", JSON.stringify(next));
        } catch {}
        return next;
      }),
    [],
  );
  const reset = () => {
    setFound([]);
    try {
      localStorage.removeItem("audacity-discoveries-v3");
    } catch {}
  };
  return (
    <Context value={config}>
      <QueryClientProvider client={q}>
        <Wanted value={{ found, discover, reset }}>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </Wanted>
      </QueryClientProvider>
    </Context>
  );
}
