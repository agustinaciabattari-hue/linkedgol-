import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiFetch, type RequestConfig } from "./http";

export type Stats = { players: number; agents: number; clubs: number };

export function getGetStatsQueryKey() {
  return ["stats"] as const;
}

export function useGetStats(options?: { request?: RequestConfig; query?: Partial<UseQueryOptions<Stats>> }) {
  return useQuery<Stats>({
    queryKey: getGetStatsQueryKey(),
    queryFn: () => apiFetch<Stats>("/stats", {}, options?.request),
    ...(options?.query || {}),
  });
}
