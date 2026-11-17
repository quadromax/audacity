"use client";
import { useQuery } from "@tanstack/react-query";
import { api, useSite } from "@/components/providers";
import { defaultMetadata } from "@/lib/token-data";
import type { Market } from "@/lib/types";
export function useToken() {
  const config = useSite();
  const query = useQuery({
    queryKey: ["market", config.mint],
    queryFn: () => api<Market>("/api/market"),
    enabled: Boolean(config.mint),
    refetchInterval: 45000,
    staleTime: 40000,
    retry: 1,
  });
  const data = query.data?.mint === config.mint ? query.data : undefined;
  const verified = data?.verification === "verified" && !query.isError;
  return {
    ...query,
    data,
    config: {
      ...config,
      pump: verified && data?.pumpAvailable ? config.pump : null,
      dex: verified ? config.dex : null,
    },
    token: data?.metadata ?? defaultMetadata(),
  };
}
