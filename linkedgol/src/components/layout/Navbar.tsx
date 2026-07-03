import { Link, useLocation } from "wouter";
import { Menu, X, User as UserIcon, LogOut, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/shared";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { isLoggedIn, isLoading, user, profile, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.players"), path: "/jugador" },
    { name: t("nav.agents"), path: "/agente" },
    { name: t("nav.clubs"), path: "/club" },
    { name: t("nav.opportunities"), path: "/oportunidades" },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const toggleLanguage = () => setLanguage(language === "es" ? "en" : "es");

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
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-slate-50"
            title={language === "es" ? "Switch to English" : "Cambiar a Español"}
          >
            <Globe className="w-4 h-4" />
            {language === "es" ? "EN" : "ES"}
          </button>

          <Link href="/perfiles" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mr-2">
            {t("nav.viewProfiles")}
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
              <Button variant="ghost" size="sm" onClick={handleLogout} className="px-2 text-slate-500 hover:text-red-600 hover:bg-red-50" title={t("nav.logout")}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link href="/ingresar">
              <Button size="sm">{t("nav.login")}</Button>
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

          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-lg border border-border w-fit self-end"
          >
            <Globe className="w-4 h-4" />
            {language === "es" ? "English" : "Español"}
          </button>

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
                    <Button variant="outline" className="w-full justify-center">{t("nav.myProfile")}</Button>
                  </Link>
                  <Button variant="ghost" onClick={handleLogout} className="w-full justify-center text-red-600 bg-red-50 hover:bg-red-100">{t("nav.logout")}</Button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/ingresar" onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-center shadow-md shadow-primary/20">{t("nav.login")}</Button>
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
              {t("nav.viewProfiles")}
            </div>
          </Link>
        </div>
      )}
    </header>
  );
}
