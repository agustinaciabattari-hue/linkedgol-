import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import NotFound from "@/pages/not-found";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Pages — lazy-loaded so each route ships its own JS chunk instead of one
// giant bundle. Improves initial load time (and Core Web Vitals), since
// visitors only download the code for the page they're actually on.
const Home = lazy(() => import("@/pages/home"));
const Profiles = lazy(() => import("@/pages/profiles"));
const PlayerProfile = lazy(() => import("@/pages/player-profile"));
const Opportunities = lazy(() => import("@/pages/opportunities"));
const LandingJugador = lazy(() => import("@/pages/jugador"));
const LandingAgente = lazy(() => import("@/pages/agente"));
const LandingClub = lazy(() => import("@/pages/club"));

// Auth/Registration Pages
const Login = lazy(() => import("@/pages/login"));
const MiPerfil = lazy(() => import("@/pages/mi-perfil"));
const RegistroJugador = lazy(() => import("@/pages/registro-jugador"));
const RegistroAgente = lazy(() => import("@/pages/registro-agente"));
const RegistroClub = lazy(() => import("@/pages/registro-club"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const ResetPassword = lazy(() => import("@/pages/reset-password"));
const VerifyEmail = lazy(() => import("@/pages/verify-email"));
const Terminos = lazy(() => import("@/pages/terminos"));
const Privacidad = lazy(() => import("@/pages/privacidad"));
const Contacto = lazy(() => import("@/pages/contacto"));

// Admin Pages
const AdminLogin = lazy(() => import("@/pages/admin-login"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));

function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {!isAdminRoute && <Navbar />}
      
      <main className={cn("flex-grow", isAdminRoute ? "h-screen overflow-hidden" : "")}>
        <Suspense fallback={<RouteFallback />}>
          <Switch>
            <Route path="/" component={Home} />
            
            <Route path="/perfiles" component={Profiles} />
            <Route path="/perfil/:id" component={PlayerProfile} />
            <Route path="/oportunidades" component={Opportunities} />
            
            <Route path="/jugador" component={LandingJugador} />
            <Route path="/agente" component={LandingAgente} />
            <Route path="/club" component={LandingClub} />
            
            <Route path="/ingresar" component={Login} />
            <Route path="/mi-perfil" component={MiPerfil} />
            <Route path="/olvide-password" component={ForgotPassword} />
            <Route path="/restablecer-password" component={ResetPassword} />
            <Route path="/verificar-email" component={VerifyEmail} />

            <Route path="/terminos" component={Terminos} />
            <Route path="/privacidad" component={Privacidad} />
            <Route path="/contacto" component={Contacto} />
            
            <Route path="/registro/jugador" component={RegistroJugador} />
            <Route path="/registro/agente" component={RegistroAgente} />
            <Route path="/registro/club" component={RegistroClub} />

            {/* Admin Routes */}
            <Route path="/admin" component={AdminLogin} />
            <Route path="/admin/dashboard" component={AdminDashboard} />

            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
