import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Users, Briefcase, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/shared";
import { useListSiteContent, useGetStats } from "@workspace/api-client-react";
import { getContentValue, getContentBoolean } from "@/lib/site-content";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

const beneficios = [
  { icon: <Users className="w-6 h-6" />, titulo: "Gestioná múltiples jugadores", desc: "Subí y administrá todos los jugadores que representás desde un solo panel." },
  { icon: <Briefcase className="w-6 h-6" />, titulo: "Acceso a clubes activos", desc: "Contactá directamente con los clubes que están buscando jugadores ahora." },
  { icon: <TrendingUp className="w-6 h-6" />, titulo: "Mayor visibilidad", desc: "Tus jugadores aparecen destacados en el buscador con tu marca como agente." },
  { icon: <ShieldCheck className="w-6 h-6" />, titulo: "Licencia FIFA verificada", desc: "Mostrá tu credencial y generá confianza con clubes e instituciones." },
];

const pasos = [
  { num: "01", titulo: "Creá tu perfil de agente", desc: "Registrate con tu nombre, licencia FIFA (si la tenés), país y datos de contacto." },
  { num: "02", titulo: "Agregá tus jugadores", desc: "Cargá los perfiles de los jugadores que representás con toda su info y videos." },
  { num: "03", titulo: "Conectate con clubes", desc: "Los clubes que buscan el perfil de tus jugadores te contactan directamente." },
  { num: "04", titulo: "Cerrá oportunidades", desc: "Negociá y concretá transferencias, pruebas o contratos con eficiencia." },
];

export default function LandingAgente() {
  const { data: content } = useListSiteContent();
  const { data: stats } = useGetStats();
  const showStats = getContentBoolean(content, "home_stats_show", true);
  const c = (key: string, fallback: string) => getContentValue(content, key, fallback);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <SEO
        title="Para Agentes — Gestioná tu cartera de jugadores"
        description="Registrate como agente FIFA en Linkedgol, gestioná tu cartera de jugadores y conectá con clubes verificados de toda Latinoamérica."
        path="/agente"
      />

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-cyan-700 via-cyan-600 to-blue-500">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url('${c("agente_hero_image", "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80")}')`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block bg-white/20 border border-white/30 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              {c("agente_hero_badge", t("agente.badge"))}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-tight mb-6 whitespace-pre-line">
              {c("agente_hero_title", t("agente.title"))}
            </h1>
            <p className="text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed whitespace-pre-line">
              {c("agente_hero_subtitle", t("agente.subtitle"))}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={c("agente_cta_link", "/registro/agente")}>
                <Button size="lg" className="bg-white text-cyan-700 hover:bg-cyan-50 font-bold shadow-xl shadow-cyan-900/20">
                  {c("agente_cta_text", t("agente.cta"))} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/oportunidades">
                <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                  Ver oportunidades activas
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {showStats && (
        <section className="bg-cyan-700 py-10 border-t border-cyan-600">
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
            {[
              { num: stats?.agents ?? "–", label: "Agentes registrados" },
              { num: stats?.players ?? "–", label: "Jugadores en la red" },
              { num: stats?.clubs ?? "–", label: "Clubes buscando ahora" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black text-white">{s.num}</div>
                <div className="text-sm text-white/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Beneficios */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-black text-foreground mb-4">
              La herramienta que tu agencia necesita
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Dejá de buscar oportunidades manualmente. En Linkedgol los clubes te encuentran a vos.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {beneficios.map((b, i) => (
              <motion.div
                key={b.titulo}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-cyan-50 border border-cyan-100 rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {b.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">{b.titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20 bg-slate-50 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-display font-black text-foreground mb-4">Cómo funciona para agentes</h2>
          </div>
          <div className="space-y-6">
            {pasos.map((paso, i) => (
              <motion.div
                key={paso.num}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6 bg-white border border-border rounded-2xl p-6"
              >
                <div className="text-4xl font-black text-cyan-200 shrink-0 w-12 text-center">{paso.num}</div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{paso.titulo}</h3>
                  <p className="text-muted-foreground">{paso.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-black text-foreground mb-4">Tu perfil de agente incluye</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Perfil profesional con foto y bio",
              "Licencia FIFA o habilitación (opcional)",
              "Cartera de jugadores representados",
              "País y zona de operación",
              "Historial de transferencias realizadas",
              "Botón de contacto directo",
              "Verificación de identidad por Linkedgol",
              "Acceso al buscador de oportunidades activas",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-cyan-50 border border-cyan-100 rounded-xl px-4 py-3">
                <CheckCircle className="w-5 h-5 text-cyan-500 shrink-0" />
                <span className="text-sm font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-cyan-700 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-4 whitespace-pre-line">
            {c("agente_final_title", t("agente.finalTitle"))}
          </h2>
          <p className="text-white/80 text-lg mb-8 whitespace-pre-line">
            {c("agente_final_subtitle", t("agente.finalSubtitle"))}
          </p>
          <Link href={c("agente_cta_link", "/registro/agente")}>
            <Button size="lg" className="bg-white text-cyan-700 hover:bg-cyan-50 font-bold shadow-xl">
              {c("agente_cta_text", t("agente.cta"))} <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
