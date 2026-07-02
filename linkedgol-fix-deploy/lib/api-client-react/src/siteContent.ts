import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
import { apiFetch, type RequestConfig } from "./http";
import type { SiteContent } from "./types";

// --- GET /site-content ---
export function getListSiteContentQueryKey() {
  return ["site-content", "list"] as const;
}

export function useListSiteContent(options?: {
  request?: RequestConfig;
  query?: Partial<UseQueryOptions<SiteContent[]>>;
}) {
  return useQuery<SiteContent[]>({
    queryKey: getListSiteContentQueryKey(),
    queryFn: () => apiFetch<SiteContent[]>("/site-content", {}, options?.request),
    ...(options?.query || {}),
  });
}

// --- PUT /admin/site-content ---
type UpsertSiteContentVariables = { data: { key: string; value: string } };

export function useUpsertSiteContent(options?: {
  mutation?: Omit<UseMutationOptions<SiteContent, Error, UpsertSiteContentVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<SiteContent, Error, UpsertSiteContentVariables>({
    mutationFn: ({ data }) =>
      apiFetch<SiteContent>(
        "/admin/site-content",
        { method: "PUT", body: JSON.stringify(data) },
        options?.request,
      ),
    ...(options?.mutation || {}),
  });
}
