import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-sm font-bold text-white">⚽</span>
              </div>
              <span className="font-display font-bold text-xl text-white">Linkedgol</span>
            </Link>
            <p className="text-sm max-w-sm">
              {t("footer.tagline")}
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">{t("footer.platform")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jugador" className="hover:text-white transition-colors">{t("footer.forPlayers")}</Link></li>
              <li><Link href="/agente" className="hover:text-white transition-colors">{t("footer.forAgents")}</Link></li>
              <li><Link href="/club" className="hover:text-white transition-colors">{t("footer.forClubs")}</Link></li>
              <li><Link href="/perfiles" className="hover:text-white transition-colors">{t("footer.searchTalent")}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terminos" className="hover:text-white transition-colors">{t("footer.terms")}</Link></li>
              <li><Link href="/privacidad" className="hover:text-white transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">{t("footer.contact")}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs">
          <p>© {new Date().getFullYear()} Linkedgol. {t("footer.rights")}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              className="hover:text-white transition-colors"
            >
              {language === "es" ? "English" : "Español"}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
