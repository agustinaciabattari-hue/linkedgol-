import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Shield, Lock } from "lucide-react";
import { Card, Input, Button, Label } from "@/components/ui/shared";
import { useAdminLogin } from "@workspace/api-client-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("admin_token")) {
      setLocation("/admin/dashboard");
    }
  }, [setLocation]);

  const loginMutation = useAdminLogin({
    mutation: {
      onSuccess: (data) => {
        localStorage.setItem("admin_token", data.token);
        setLocation("/admin/dashboard");
      },
      onError: () => {
        setError("Contraseña incorrecta. Por favor, intentá nuevamente.");
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setError("");
    loginMutation.mutate({ data: { password } });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Linkedgol Admin</h1>
          <p className="text-slate-400 mt-2">Panel de control de la plataforma</p>
        </div>

        <Card className="p-8 border-slate-800 bg-slate-800/50 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Contraseña de acceso</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-500" />
                </div>
                <Input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-primary"
                  placeholder="Ingresá la contraseña de administrador"
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
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Verificando..." : "Ingresar al Panel"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
