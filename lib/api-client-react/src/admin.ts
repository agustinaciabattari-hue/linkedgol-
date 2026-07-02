import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
import { apiFetch, type RequestConfig } from "./http";
import type { AdminPlayer, Agent, Club } from "./types";

// ===================== Admin login =====================

type AdminLoginVariables = { data: { password: string } };

export function useAdminLogin(options?: {
  mutation?: Omit<UseMutationOptions<{ token: string }, Error, AdminLoginVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<{ token: string }, Error, AdminLoginVariables>({
    mutationFn: ({ data }) =>
      apiFetch<{ token: string }>("/admin/login", { method: "POST", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

// ===================== Players (admin) =====================

export function getAdminListPlayersQueryKey() {
  return ["admin", "players"] as const;
}

export function useAdminListPlayers(options?: {
  request?: RequestConfig;
  query?: Partial<UseQueryOptions<AdminPlayer[]>>;
}) {
  return useQuery<AdminPlayer[]>({
    queryKey: getAdminListPlayersQueryKey(),
    queryFn: () => apiFetch<AdminPlayer[]>("/admin/players", {}, options?.request),
    ...(options?.query || {}),
  });
}

type SetPlayerVerifiedVariables = { id: number; data: { verified: boolean } };

export function useSetPlayerVerified(options?: {
  mutation?: Omit<UseMutationOptions<AdminPlayer, Error, SetPlayerVerifiedVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<AdminPlayer, Error, SetPlayerVerifiedVariables>({
    mutationFn: ({ id, data }) =>
      apiFetch<AdminPlayer>(
        `/admin/players/${id}/verify`,
        { method: "PATCH", body: JSON.stringify(data) },
        options?.request,
      ),
    ...(options?.mutation || {}),
  });
}

type UpdatePlayerVariables = { id: number; data: Record<string, any> };

export function useUpdatePlayer(options?: {
  mutation?: Omit<UseMutationOptions<AdminPlayer, Error, UpdatePlayerVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<AdminPlayer, Error, UpdatePlayerVariables>({
    mutationFn: ({ id, data }) =>
      apiFetch<AdminPlayer>(`/admin/players/${id}`, { method: "PATCH", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

type DeletePlayerVariables = { id: number };

export function useDeletePlayer(options?: {
  mutation?: Omit<UseMutationOptions<void, Error, DeletePlayerVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<void, Error, DeletePlayerVariables>({
    mutationFn: ({ id }) => apiFetch<void>(`/admin/players/${id}`, { method: "DELETE" }, options?.request),
    ...(options?.mutation || {}),
  });
}

type AdminCreatePlayerVariables = { data: Record<string, any> };

export function useAdminCreatePlayer(options?: {
  mutation?: Omit<UseMutationOptions<AdminPlayer, Error, AdminCreatePlayerVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<AdminPlayer, Error, AdminCreatePlayerVariables>({
    mutationFn: ({ data }) =>
      apiFetch<AdminPlayer>("/admin/players", { method: "POST", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

// ===================== Agents (admin) =====================

export function getAdminListAgentsQueryKey() {
  return ["admin", "agents"] as const;
}

export function useAdminListAgents(options?: { request?: RequestConfig; query?: Partial<UseQueryOptions<Agent[]>> }) {
  return useQuery<Agent[]>({
    queryKey: getAdminListAgentsQueryKey(),
    queryFn: () => apiFetch<Agent[]>("/admin/agents", {}, options?.request),
    ...(options?.query || {}),
  });
}

type SetAgentVerifiedVariables = { id: number; data: { verified: boolean } };

export function useSetAgentVerified(options?: {
  mutation?: Omit<UseMutationOptions<Agent, Error, SetAgentVerifiedVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<Agent, Error, SetAgentVerifiedVariables>({
    mutationFn: ({ id, data }) =>
      apiFetch<Agent>(`/admin/agents/${id}/verify`, { method: "PATCH", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

type UpdateAgentVariables = { id: number; data: Record<string, any> };

export function useUpdateAgent(options?: {
  mutation?: Omit<UseMutationOptions<Agent, Error, UpdateAgentVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<Agent, Error, UpdateAgentVariables>({
    mutationFn: ({ id, data }) =>
      apiFetch<Agent>(`/admin/agents/${id}`, { method: "PATCH", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

type DeleteAgentVariables = { id: number };

export function useDeleteAgent(options?: {
  mutation?: Omit<UseMutationOptions<void, Error, DeleteAgentVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<void, Error, DeleteAgentVariables>({
    mutationFn: ({ id }) => apiFetch<void>(`/admin/agents/${id}`, { method: "DELETE" }, options?.request),
    ...(options?.mutation || {}),
  });
}

type AdminCreateAgentVariables = { data: Record<string, any> };

export function useAdminCreateAgent(options?: {
  mutation?: Omit<UseMutationOptions<Agent, Error, AdminCreateAgentVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<Agent, Error, AdminCreateAgentVariables>({
    mutationFn: ({ data }) =>
      apiFetch<Agent>("/admin/agents", { method: "POST", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

// ===================== Clubs (admin) =====================

export function getAdminListClubsQueryKey() {
  return ["admin", "clubs"] as const;
}

export function useAdminListClubs(options?: { request?: RequestConfig; query?: Partial<UseQueryOptions<Club[]>> }) {
  return useQuery<Club[]>({
    queryKey: getAdminListClubsQueryKey(),
    queryFn: () => apiFetch<Club[]>("/admin/clubs", {}, options?.request),
    ...(options?.query || {}),
  });
}

type SetClubVerifiedVariables = { id: number; data: { verified: boolean } };

export function useSetClubVerified(options?: {
  mutation?: Omit<UseMutationOptions<Club, Error, SetClubVerifiedVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<Club, Error, SetClubVerifiedVariables>({
    mutationFn: ({ id, data }) =>
      apiFetch<Club>(`/admin/clubs/${id}/verify`, { method: "PATCH", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

type UpdateClubVariables = { id: number; data: Record<string, any> };

export function useUpdateClub(options?: {
  mutation?: Omit<UseMutationOptions<Club, Error, UpdateClubVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<Club, Error, UpdateClubVariables>({
    mutationFn: ({ id, data }) =>
      apiFetch<Club>(`/admin/clubs/${id}`, { method: "PATCH", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

type DeleteClubVariables = { id: number };

export function useDeleteClub(options?: {
  mutation?: Omit<UseMutationOptions<void, Error, DeleteClubVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<void, Error, DeleteClubVariables>({
    mutationFn: ({ id }) => apiFetch<void>(`/admin/clubs/${id}`, { method: "DELETE" }, options?.request),
    ...(options?.mutation || {}),
  });
}

type AdminCreateClubVariables = { data: Record<string, any> };

export function useAdminCreateClub(options?: {
  mutation?: Omit<UseMutationOptions<Club, Error, AdminCreateClubVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<Club, Error, AdminCreateClubVariables>({
    mutationFn: ({ data }) =>
      apiFetch<Club>("/admin/clubs", { method: "POST", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}
