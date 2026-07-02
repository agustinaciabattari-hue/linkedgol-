import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Card, Button } from "@/components/ui/shared";
import { useAuthVerifyEmail, useAuthResendVerification } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyEmail() {
  const search = useSearch();
  const token = new URLSearchParams(search).get("token") || "";
  const { refreshProfile, user } = useAuth();

  // GET /auth/verify-email?token=... — modeled as a query, only enabled
  // when we actually have a token, and never retried (a bad/expired token
  // will keep being bad, no point hammering the server).
  const { data, isLoading, isError } = useAuthVerifyEmail(
    { token },
    { query: { enabled: !!token, retry: false } }
  );

  useEffect(() => {
    if (data?.verified) refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const resendMutation = useAuthResendVerification();
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    if (!user?.email) return;
    resendMutation.mutate({ data: { email: user.email } }, { onSuccess: () => setResent(true) });
  };

  const status: "loading" | "success" | "error" = !token
    ? "error"
    : isLoading
    ? "loading"
    : data?.verified
    ? "success"
    : "error";

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="text-2xl font-bold text-white">⚽</span>
            </div>
            <span className="font-display font-bold text-3xl tracking-tight text-white">Linkedgol</span>
          </Link>
        </div>

        <Card className="p-8 border-slate-800 bg-slate-800/50 backdrop-blur-xl shadow-2xl text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-white font-semibold">Verificando tu email...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-white font-semibold mb-2">¡Email verificado!</p>
              <p className="text-slate-400 text-sm mb-6">Tu cuenta ya está confirmada.</p>
              <Link href="/mi-perfil">
                <Button className="w-full">Ir a mi perfil</Button>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-white font-semibold mb-2">
                {isError || !token ? "El enlace es inválido o expiró" : "No se pudo verificar el email"}
              </p>
              <p className="text-slate-400 text-sm mb-6">
                {token
                  ? "Pedí un nuevo enlace de verificación."
                  : "Este enlace no incluye un token válido."}
              </p>
              {user?.email && !resent && (
                <Button
                  variant="outline"
                  className="w-full bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white"
                  onClick={handleResend}
                  disabled={resendMutation.isPending}
                >
                  {resendMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reenviar email de verificación"}
                </Button>
              )}
              {resent && <p className="text-green-400 text-sm">Te enviamos un nuevo enlace, revisá tu email.</p>}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
