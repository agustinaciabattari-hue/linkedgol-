import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { apiFetch, type RequestConfig } from "./http";

type SendContactMessageVariables = { data: { name: string; email: string; message: string } };

export function useSendContactMessage(options?: {
  mutation?: Omit<UseMutationOptions<{ sent: boolean }, Error, SendContactMessageVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<{ sent: boolean }, Error, SendContactMessageVariables>({
    mutationFn: ({ data }) =>
      apiFetch<{ sent: boolean }>("/contact", { method: "POST", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}
