import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
import { apiFetch, type RequestConfig } from "./http";

export type AdminMessage = {
  id: number;
  type: "contact_form" | "curated_offer_application" | "player_contact" | "opportunity_application";
  fromEmail: string;
  fromName?: string | null;
  context?: string | null;
  subject: string;
  body: string;
  read: boolean;
  repliedAt?: string | null;
  replyBody?: string | null;
  createdAt?: string;
};

// --- GET /admin/messages ---
export function getAdminListMessagesQueryKey() {
  return ["admin", "messages"] as const;
}

export function useAdminListMessages(options?: {
  request?: RequestConfig;
  query?: Partial<UseQueryOptions<AdminMessage[]>>;
}) {
  return useQuery<AdminMessage[]>({
    queryKey: getAdminListMessagesQueryKey(),
    queryFn: () => apiFetch<AdminMessage[]>("/admin/messages", {}, options?.request),
    ...(options?.query || {}),
  });
}

// --- PATCH /admin/messages/{id}/read ---
type MarkMessageReadVariables = { id: number; data: { read: boolean } };

export function useAdminMarkMessageRead(options?: {
  mutation?: Omit<UseMutationOptions<AdminMessage, Error, MarkMessageReadVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<AdminMessage, Error, MarkMessageReadVariables>({
    mutationFn: ({ id, data }) =>
      apiFetch<AdminMessage>(`/admin/messages/${id}/read`, { method: "PATCH", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

// --- POST /admin/messages/{id}/reply ---
type ReplyToMessageVariables = { id: number; data: { body: string } };

export function useAdminReplyToMessage(options?: {
  mutation?: Omit<UseMutationOptions<AdminMessage, Error, ReplyToMessageVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<AdminMessage, Error, ReplyToMessageVariables>({
    mutationFn: ({ id, data }) =>
      apiFetch<AdminMessage>(`/admin/messages/${id}/reply`, { method: "POST", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

// --- DELETE /admin/messages/{id} ---
type DeleteMessageVariables = { id: number };

export function useAdminDeleteMessage(options?: {
  mutation?: Omit<UseMutationOptions<void, Error, DeleteMessageVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<void, Error, DeleteMessageVariables>({
    mutationFn: ({ id }) => apiFetch<void>(`/admin/messages/${id}`, { method: "DELETE" }, options?.request),
    ...(options?.mutation || {}),
  });
}

// --- POST /admin/messages/send ---
type SendAdminEmailVariables = { data: { to: string; subject: string; body: string } };

export function useAdminSendEmail(options?: {
  mutation?: Omit<UseMutationOptions<{ sent: boolean }, Error, SendAdminEmailVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<{ sent: boolean }, Error, SendAdminEmailVariables>({
    mutationFn: ({ data }) =>
      apiFetch<{ sent: boolean }>("/admin/messages/send", { method: "POST", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}
