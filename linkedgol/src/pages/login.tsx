import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { Card, Input, Button, Label } from "@/components/ui/shared";
import { useAuthLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isLoggedIn, isLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useAuthLogin({
    mutation: {
      onSuccess: (data) => {
        login(data.token, data.user as any, data.profile);
        setLocation("/mi-perfil");
      },
      onError: (err: any) => {
        if (err?.response?.status === 401 || err?.status === 401 || err?.message?.includes("401")) {
          setError("Email o contraseña incorrectos.");
        } else {
          setError("Error al iniciar sesión. Intentá de nuevo.");
        }
      }
    }
  });

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      setLocation("/mi-perfil");
    }
  }, [isLoading, isLoggedIn, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setError("");
    loginMutation.mutate({ data: { email, password } });
  };

  if (isLoading || isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background effects */}
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
          <h1 className="text-2xl font-semibold text-white tracking-tight">Iniciar Sesión</h1>
          <p className="text-slate-400 mt-2 text-center max-w-xs">Ingresá a tu cuenta para gestionar tu perfil y conectar con la red.</p>
        </div>

        <Card className="p-8 border-slate-800 bg-slate-800/50 backdrop-blur-xl shadow-2xl mb-6">
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Contraseña</Label>
                <Link href="/olvide-password" className="text-xs text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-500" />
                </div>
                <Input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-primary"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {error}
              </motion.div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ingresar a mi cuenta"}
            </Button>
          </form>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-slate-400 text-sm">¿No tenés cuenta? Registrate gratis:</p>
          <div className="flex flex-col gap-2">
            <Link href="/registro/jugador">
              <Button variant="outline" className="w-full bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white justify-between px-6">
                <span>Soy Jugador</span> <ArrowRight className="w-4 h-4 text-slate-400" />
              </Button>
            </Link>
            <Link href="/registro/agente">
              <Button variant="outline" className="w-full bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white justify-between px-6">
                <span>Soy Agente</span> <ArrowRight className="w-4 h-4 text-slate-400" />
              </Button>
            </Link>
            <Link href="/registro/club">
              <Button variant="outline" className="w-full bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white justify-between px-6">
                <span>Soy Club</span> <ArrowRight className="w-4 h-4 text-slate-400" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
