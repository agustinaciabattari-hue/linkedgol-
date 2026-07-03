import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import NotFound from "@/pages/not-found";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Pages
import Home from "@/pages/home";
import Profiles from "@/pages/profiles";
import PlayerProfile from "@/pages/player-profile";
import Opportunities from "@/pages/opportunities";
import LandingJugador from "@/pages/jugador";
import LandingAgente from "@/pages/agente";
import LandingClub from "@/pages/club";

// Auth/Registration Pages
import Login from "@/pages/login";
import MiPerfil from "@/pages/mi-perfil";
import RegistroJugador from "@/pages/registro-jugador";
import RegistroAgente from "@/pages/registro-agente";
import RegistroClub from "@/pages/registro-club";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import VerifyEmail from "@/pages/verify-email";
import Terminos from "@/pages/terminos";
import Privacidad from "@/pages/privacidad";
import Contacto from "@/pages/contacto";

// Admin Pages
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";

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
