import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { apiFetch, type RequestConfig } from "./http";

type TranslateVariables = { data: { text: string; target: "es" | "en" } };

export function useTranslateText(options?: {
  mutation?: Omit<UseMutationOptions<{ translatedText: string }, Error, TranslateVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<{ translatedText: string }, Error, TranslateVariables>({
    mutationFn: ({ data }) =>
      apiFetch<{ translatedText: string }>("/translate", { method: "POST", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}
