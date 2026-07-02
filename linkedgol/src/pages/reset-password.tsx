import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Lock, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Card, Input, Button, Label } from "@/components/ui/shared";
import { useAuthResetPassword } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const token = new URLSearchParams(search).get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const mutation = useAuthResetPassword({
    mutation: {
      onSuccess: () => setSuccess(true),
      onError: (err: any) => {
        if (err?.response?.status === 400 || err?.status === 400) {
          setError("El enlace es inválido o expiró. Pedí uno nuevo.");
        } else {
          setError("Ocurrió un error. Intentá de nuevo.");
        }
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    mutation.mutate({ data: { token, password } });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="text-2xl font-bold text-white">⚽</span>
            </div>
            <span className="font-display font-bold text-3xl tracking-tight text-white">Linkedgol</span>
          </Link>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Nueva contraseña</h1>
        </div>

        <Card className="p-8 border-slate-800 bg-slate-800/50 backdrop-blur-xl shadow-2xl mb-6">
          {!token ? (
            <div className="text-center py-4">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-white font-semibold mb-2">Enlace inválido</p>
              <p className="text-slate-400 text-sm mb-6">Este enlace no incluye un token válido. Pedí uno nuevo.</p>
              <Link href="/olvide-password">
                <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white">
                  Solicitar nuevo enlace
                </Button>
              </Link>
            </div>
          ) : success ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-white font-semibold mb-2">¡Contraseña actualizada!</p>
              <p className="text-slate-400 text-sm mb-6">Ya podés iniciar sesión con tu nueva contraseña.</p>
              <Button className="w-full" onClick={() => setLocation("/ingresar")}>
                Iniciar sesión
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Nueva contraseña</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-500" />
                  </div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-primary"
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Confirmar contraseña</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-500" />
                  </div>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-primary"
                    placeholder="Repetir contraseña"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Restablecer contraseña"}
              </Button>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
