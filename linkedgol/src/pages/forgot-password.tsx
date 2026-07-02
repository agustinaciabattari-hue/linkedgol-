import { useState } from "react";
import { Link } from "wouter";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card, Input, Button, Label } from "@/components/ui/shared";
import { useAuthForgotPassword } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const mutation = useAuthForgotPassword({
    mutation: {
      onSuccess: () => setSent(true),
      // We intentionally always show the "sent" state, even on error,
      // to avoid leaking whether an email is registered. Network/server
      // errors are rare enough that this tradeoff is worth it here.
      onError: () => setSent(true),
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    mutation.mutate({ data: { email } });
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
          <h1 className="text-2xl font-semibold text-white tracking-tight">Recuperar contraseña</h1>
          <p className="text-slate-400 mt-2 text-center max-w-xs">
            Ingresá tu email y te mandamos un enlace para restablecer tu contraseña.
          </p>
        </div>

        <Card className="p-8 border-slate-800 bg-slate-800/50 backdrop-blur-xl shadow-2xl mb-6">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-white font-semibold mb-2">Revisá tu email</p>
              <p className="text-slate-400 text-sm">
                Si existe una cuenta con ese email, te enviamos un enlace para restablecer tu contraseña. Puede tardar unos minutos en llegar.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-500" />
                  </div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-primary"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar enlace de recuperación"}
              </Button>
            </form>
          )}
        </Card>

        <div className="text-center">
          <Link href="/ingresar" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver a iniciar sesión
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
