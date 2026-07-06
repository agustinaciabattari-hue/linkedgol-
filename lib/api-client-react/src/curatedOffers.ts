import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
import { apiFetch, type RequestConfig } from "./http";

export type CuratedOffer = {
  id: number;
  title: string;
  league: string;
  position: string;
  characteristics?: string | null;
  salaryApprox?: string | null;
  transferValueApprox?: string | null;
  active?: boolean;
  createdAt?: string;
};

// --- GET /curated-offers (public) ---
export function getListCuratedOffersQueryKey() {
  return ["curated-offers", "list"] as const;
}

export function useListCuratedOffers(options?: {
  request?: RequestConfig;
  query?: Partial<UseQueryOptions<CuratedOffer[]>>;
}) {
  return useQuery<CuratedOffer[]>({
    queryKey: getListCuratedOffersQueryKey(),
    queryFn: () => apiFetch<CuratedOffer[]>("/curated-offers", {}, options?.request),
    ...(options?.query || {}),
  });
}

// --- POST /curated-offers/{id}/apply ---
type ApplyCuratedOfferVariables = { id: number; data?: { message?: string } };

export function useApplyToCuratedOffer(options?: {
  mutation?: Omit<UseMutationOptions<{ sent: boolean }, Error, ApplyCuratedOfferVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<{ sent: boolean }, Error, ApplyCuratedOfferVariables>({
    mutationFn: ({ id, data }) =>
      apiFetch<{ sent: boolean }>(
        `/curated-offers/${id}/apply`,
        { method: "POST", body: JSON.stringify(data || {}) },
        options?.request,
      ),
    ...(options?.mutation || {}),
  });
}

// --- GET /admin/curated-offers ---
export function getAdminListCuratedOffersQueryKey() {
  return ["admin", "curated-offers"] as const;
}

export function useAdminListCuratedOffers(options?: {
  request?: RequestConfig;
  query?: Partial<UseQueryOptions<CuratedOffer[]>>;
}) {
  return useQuery<CuratedOffer[]>({
    queryKey: getAdminListCuratedOffersQueryKey(),
    queryFn: () => apiFetch<CuratedOffer[]>("/admin/curated-offers", {}, options?.request),
    ...(options?.query || {}),
  });
}

// --- POST /admin/curated-offers ---
type CreateCuratedOfferVariables = { data: Omit<CuratedOffer, "id" | "createdAt"> };

export function useAdminCreateCuratedOffer(options?: {
  mutation?: Omit<UseMutationOptions<CuratedOffer, Error, CreateCuratedOfferVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<CuratedOffer, Error, CreateCuratedOfferVariables>({
    mutationFn: ({ data }) =>
      apiFetch<CuratedOffer>("/admin/curated-offers", { method: "POST", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

// --- PATCH /admin/curated-offers/{id} ---
type UpdateCuratedOfferVariables = { id: number; data: Partial<Omit<CuratedOffer, "id" | "createdAt">> };

export function useAdminUpdateCuratedOffer(options?: {
  mutation?: Omit<UseMutationOptions<CuratedOffer, Error, UpdateCuratedOfferVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<CuratedOffer, Error, UpdateCuratedOfferVariables>({
    mutationFn: ({ id, data }) =>
      apiFetch<CuratedOffer>(`/admin/curated-offers/${id}`, { method: "PATCH", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

// --- DELETE /admin/curated-offers/{id} ---
type DeleteCuratedOfferVariables = { id: number };

export function useAdminDeleteCuratedOffer(options?: {
  mutation?: Omit<UseMutationOptions<void, Error, DeleteCuratedOfferVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<void, Error, DeleteCuratedOfferVariables>({
    mutationFn: ({ id }) => apiFetch<void>(`/admin/curated-offers/${id}`, { method: "DELETE" }, options?.request),
    ...(options?.mutation || {}),
  });
}
