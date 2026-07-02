import { Link, useLocation } from "wouter";
import { Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/shared";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { isLoggedIn, isLoading, user, profile, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", path: "/" },
    { name: "Jugadores", path: "/jugador" },
    { name: "Agentes", path: "/agente" },
    { name: "Clubes", path: "/club" },
    { name: "Oportunidades", path: "/oportunidades" },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const displayName = profile?.name || user?.email?.split('@')[0] || "Usuario";
  const truncatedName = displayName.length > 16 ? displayName.substring(0, 14) + "..." : displayName;

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
      scrolled ? "bg-white/80 backdrop-blur-md border-border shadow-sm py-3" : "bg-white border-transparent py-4"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <span className="text-xl font-bold text-white">⚽</span>
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-foreground">Linkedgol</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={cn(
                "text-sm font-semibold transition-colors hover:text-primary",
                location === link.path ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/perfiles" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mr-2">
            Ver Perfiles
          </Link>
          
          {isLoading ? (
            <div className="w-24 h-9 bg-slate-100 animate-pulse rounded-lg"></div>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/mi-perfil">
                <Button variant="outline" size="sm" className="gap-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10">
                  <UserIcon className="w-4 h-4" />
                  <span className="truncate max-w-[120px]">{truncatedName}</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="px-2 text-slate-500 hover:text-red-600 hover:bg-red-50" title="Cerrar sesión">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link href="/ingresar">
              <Button size="sm">Ingresar</Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-border shadow-xl py-4 px-4 flex flex-col gap-4">
          
          {/* Mobile Auth Area */}
          {!isLoading && (
            <div className="bg-slate-50 p-4 rounded-xl mb-2 flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{truncatedName}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link href="/mi-perfil" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Mi Cuenta</Button>
                  </Link>
                  <Button variant="ghost" onClick={handleLogout} className="w-full justify-center text-red-600 bg-red-50 hover:bg-red-100">Cerrar Sesión</Button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-center text-slate-500 font-medium mb-1">Accedé a tu perfil profesional</p>
                  <Link href="/ingresar" onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-center shadow-md shadow-primary/20">Ingresar a mi cuenta</Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="h-px bg-border/50 mb-2" />

          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-base font-semibold px-4 py-2 rounded-lg",
                location === link.path ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-slate-50"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/perfiles" onClick={() => setIsOpen(false)}>
            <div className="text-base font-semibold px-4 py-2 rounded-lg text-muted-foreground hover:bg-slate-50 mt-2">
              Ver Perfiles y Mercado
            </div>
          </Link>
        </div>
      )}
    </header>
  );
}
