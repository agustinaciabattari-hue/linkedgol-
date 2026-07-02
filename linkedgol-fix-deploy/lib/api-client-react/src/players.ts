import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
import { apiFetch, buildQueryString, type RequestConfig } from "./http";
import type { Player } from "./types";

// --- GET /players ---
export type ListPlayersFilters = {
  position?: string;
  nationality?: string;
  status?: string;
  minAge?: number;
  maxAge?: number;
};

export function getListPlayersQueryKey(filters?: ListPlayersFilters) {
  return ["players", "list", filters ?? {}] as const;
}

export function useListPlayers(
  filters?: ListPlayersFilters,
  options?: { request?: RequestConfig; query?: Partial<UseQueryOptions<Player[]>> },
) {
  return useQuery<Player[]>({
    queryKey: getListPlayersQueryKey(filters),
    queryFn: () => apiFetch<Player[]>(`/players${buildQueryString(filters)}`, {}, options?.request),
    ...(options?.query || {}),
  });
}

// --- GET /players/{id} ---
export function getGetPlayerQueryKey(id: number) {
  return ["players", "detail", id] as const;
}

export function useGetPlayer(
  id: number,
  options?: { request?: RequestConfig; query?: Partial<UseQueryOptions<Player>> },
) {
  return useQuery<Player>({
    queryKey: getGetPlayerQueryKey(id),
    queryFn: () => apiFetch<Player>(`/players/${id}`, {}, options?.request),
    ...(options?.query || {}),
  });
}

// --- POST /players/{id}/contact ---
type ContactPlayerVariables = { id: number; data: { message: string } };

export function useContactPlayer(options?: {
  mutation?: Omit<UseMutationOptions<{ sent: boolean }, Error, ContactPlayerVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<{ sent: boolean }, Error, ContactPlayerVariables>({
    mutationFn: ({ id, data }) =>
      apiFetch<{ sent: boolean }>(
        `/players/${id}/contact`,
        { method: "POST", body: JSON.stringify(data) },
        options?.request,
      ),
    ...(options?.mutation || {}),
  });
}
