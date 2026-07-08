import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
import { apiFetch, type RequestConfig } from "./http";
import type { AuthResponse, MeResponse } from "./types";

// --- POST /auth/register ---
type AuthRegisterVariables = { data: Record<string, any> };

export function useAuthRegister(options?: {
  mutation?: Omit<UseMutationOptions<AuthResponse, Error, AuthRegisterVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<AuthResponse, Error, AuthRegisterVariables>({
    mutationFn: ({ data }) =>
      apiFetch<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

// --- POST /auth/login ---
type AuthLoginVariables = { data: { email: string; password: string } };

export function useAuthLogin(options?: {
  mutation?: Omit<UseMutationOptions<AuthResponse, Error, AuthLoginVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<AuthResponse, Error, AuthLoginVariables>({
    mutationFn: ({ data }) =>
      apiFetch<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

// --- POST /auth/google ---
type AuthGoogleVariables = { data: { credential: string; role?: "player" | "agent" | "club" } };

export function useAuthGoogle(options?: {
  mutation?: Omit<UseMutationOptions<AuthResponse, Error, AuthGoogleVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<AuthResponse, Error, AuthGoogleVariables>({
    mutationFn: ({ data }) =>
      apiFetch<AuthResponse>("/auth/google", { method: "POST", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

// --- GET /auth/me ---
export function getAuthMeQueryKey() {
  return ["auth", "me"] as const;
}

export function useAuthMe(options?: { request?: RequestConfig; query?: Partial<UseQueryOptions<MeResponse>> }) {
  return useQuery<MeResponse>({
    queryKey: getAuthMeQueryKey(),
    queryFn: () => apiFetch<MeResponse>("/auth/me", {}, options?.request),
    ...(options?.query || {}),
  });
}

// --- PATCH /auth/profile ---
type AuthUpdateProfileVariables = { data: Record<string, any> };

export function useAuthUpdateProfile(options?: {
  mutation?: Omit<UseMutationOptions<MeResponse, Error, AuthUpdateProfileVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<MeResponse, Error, AuthUpdateProfileVariables>({
    mutationFn: ({ data }) =>
      apiFetch<MeResponse>("/auth/profile", { method: "PATCH", body: JSON.stringify(data) }, options?.request),
    ...(options?.mutation || {}),
  });
}

// --- GET /auth/verify-email?token=... ---
export function getAuthVerifyEmailQueryKey(params: { token: string }) {
  return ["auth", "verify-email", params.token] as const;
}

export function useAuthVerifyEmail(
  params: { token: string },
  options?: { request?: RequestConfig; query?: Partial<UseQueryOptions<{ verified: boolean }>> },
) {
  return useQuery<{ verified: boolean }>({
    queryKey: getAuthVerifyEmailQueryKey(params),
    queryFn: () =>
      apiFetch<{ verified: boolean }>(
        `/auth/verify-email?token=${encodeURIComponent(params.token)}`,
        {},
        options?.request,
      ),
    ...(options?.query || {}),
  });
}

// --- POST /auth/resend-verification ---
type ResendVerificationVariables = { data: { email: string } };

export function useAuthResendVerification(options?: {
  mutation?: Omit<UseMutationOptions<{ sent: boolean }, Error, ResendVerificationVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<{ sent: boolean }, Error, ResendVerificationVariables>({
    mutationFn: ({ data }) =>
      apiFetch<{ sent: boolean }>(
        "/auth/resend-verification",
        { method: "POST", body: JSON.stringify(data) },
        options?.request,
      ),
    ...(options?.mutation || {}),
  });
}

// --- POST /auth/forgot-password ---
type ForgotPasswordVariables = { data: { email: string } };

export function useAuthForgotPassword(options?: {
  mutation?: Omit<UseMutationOptions<{ sent: boolean }, Error, ForgotPasswordVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<{ sent: boolean }, Error, ForgotPasswordVariables>({
    mutationFn: ({ data }) =>
      apiFetch<{ sent: boolean }>(
        "/auth/forgot-password",
        { method: "POST", body: JSON.stringify(data) },
        options?.request,
      ),
    ...(options?.mutation || {}),
  });
}

// --- POST /auth/reset-password ---
type ResetPasswordVariables = { data: { token: string; password: string } };

export function useAuthResetPassword(options?: {
  mutation?: Omit<UseMutationOptions<{ reset: boolean }, Error, ResetPasswordVariables>, "mutationFn">;
  request?: RequestConfig;
}) {
  return useMutation<{ reset: boolean }, Error, ResetPasswordVariables>({
    mutationFn: ({ data }) =>
      apiFetch<{ reset: boolean }>(
        "/auth/reset-password",
        { method: "POST", body: JSON.stringify(data) },
        options?.request,
      ),
    ...(options?.mutation || {}),
  });
}
