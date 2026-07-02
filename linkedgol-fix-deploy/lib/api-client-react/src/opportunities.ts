import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
import { apiFetch, type RequestConfig } from "./http";
import type { AdminOpportunity, Opportunity } from "./types";

// --- GET /opportunities ---
export function getListOpportunitiesQueryKey() {
  return ["opportunities", "list"] as const;
}

export function useListOpportunities(options?: {
  request?: RequestConfig;
  query?: Partial<UseQueryOptions<Opportunity[]>>;
}) {
  return useQuery<Opportunity[]>({
    queryKey: getListOpportunitiesQueryKey(),
    queryFn: () => apiFetch<Opportunity[]>("/opportunities", {}, options?.request),
    ...(options?.query || {}),
  });
}

// --- GET /opportunities/mine ---
export function getListMyOpportunitiesQueryKey() {
  return ["opportunities", "mine"] as const;
}

export function useListMyOpportunities(options?: {
  request?: RequestConfig;
  query?: Partial<UseQueryOptions<AdminOpportunity[]>>;
}) {
  return useQuery<AdminOpportunity[]>({
    queryKey: getListMyOpportunitiesQueryKey(),
    queryFn: () => apiFetch<AdminOpportunity[]>("/opportunities/mine", {}, options?.request),
    ...(options?.query || {}),
  });
}

// --- POST /opportunities ---
type CreateOpportunityVariables = { data: { title: string; description?: string; role: string } };

export function useCreateOpportunity(options?: {
  mutation?: Omit<UseMutationOptions<Opportunity, Error, CreateOpportunityVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<Opportunity, Error, CreateOpportunityVariables>({
    mutationFn: ({ data }) =>
      apiFetch<Opportunity>("/opportunities", { method: "POST", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

// --- DELETE /opportunities/{id} ---
type DeleteOpportunityVariables = { id: number };

export function useDeleteOpportunity(options?: {
  mutation?: Omit<UseMutationOptions<void, Error, DeleteOpportunityVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<void, Error, DeleteOpportunityVariables>({
    mutationFn: ({ id }) => apiFetch<void>(`/opportunities/${id}`, { method: "DELETE" }, options?.request),
    ...(options?.mutation || {}),
  });
}

// --- POST /opportunities/{id}/apply ---
type ApplyToOpportunityVariables = { id: number; data?: { message?: string } };

export function useApplyToOpportunity(options?: {
  mutation?: Omit<UseMutationOptions<{ sent: boolean }, Error, ApplyToOpportunityVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<{ sent: boolean }, Error, ApplyToOpportunityVariables>({
    mutationFn: ({ id, data }) =>
      apiFetch<{ sent: boolean }>(
        `/opportunities/${id}/apply`,
        { method: "POST", body: JSON.stringify(data || {}) },
        options?.request,
      ),
    ...(options?.mutation || {}),
  });
}
