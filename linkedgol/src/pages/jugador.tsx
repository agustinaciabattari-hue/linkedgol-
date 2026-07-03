import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Video, Star, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/shared";
import { useListSiteContent } from "@workspace/api-client-react";
import { getContentValue } from "@/lib/site-content";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

const beneficios = [
  { icon: <Globe className="w-6 h-6" />, titulo: "Visibilidad internacional", desc: "Tu perfil llega a clubes y agentes de toda Latinoamérica y el mundo." },
  { icon: <Video className="w-6 h-6" />, titulo: "Mostrá tus videos", desc: "Subí tus highlights y dejá que tu fútbol hable por vos." },
  { icon: <Star className="w-6 h-6" />, titulo: "Perfil Destacado", desc: "Aparecé en los primeros resultados cuando los clubes buscan tu posición." },
  { icon: <Shield className="w-6 h-6" />, titulo: "Perfil Verificado", desc: "Obtenés el sello de verificación que les da confianza a los clubes." },
];

const pasos = [
  { num: "01", titulo: "Creá tu perfil", desc: "Completá tus datos: posición, edad, nacionalidad, estado contractual y trayectoria." },
  { num: "02", titulo: "Subí tu video", desc: "Agregá tu video destacado para que los clubes puedan verte en acción." },
  { num: "03", titulo: "Aparecé en el buscador", desc: "Los clubes y agentes te encuentran filtrando por posición, edad y país." },
  { num: "04", titulo: "Recibí contactos", desc: "Te llegan consultas directas de clubes interesados en tu perfil." },
];

export default function LandingJugador() {
  const { data: content } = useListSiteContent();
  const c = (key: string, fallback: string) => getContentValue(content, key, fallback);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <SEO
        title="Para Jugadores — Creá tu perfil y conectate con clubes"
        description="Registrate gratis en Linkedgol como jugador, creá tu perfil profesional y aparecé en las búsquedas de clubes y agentes de toda Latinoamérica."
        path="/jugador"
      />

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url('${c("jugador_hero_image", "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80")}')`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block bg-white/20 border border-white/30 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              {c("jugador_hero_badge", t("jugador.badge"))}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-tight mb-6 whitespace-pre-line">
              {c("jugador_hero_title", t("jugador.title"))}
            </h1>
            <p className="text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed whitespace-pre-line">
              {c("jugador_hero_subtitle", t("jugador.subtitle"))}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={c("jugador_cta_link", "/registro/jugador")}>
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-bold shadow-xl shadow-orange-900/20">
                  {c("jugador_cta_text", t("jugador.cta"))} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/perfiles">
                <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                  Ver perfiles destacados
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-orange-600 py-10 border-t border-orange-500">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {[
            { num: "1,200+", label: "Jugadores registrados" },
            { num: "80+", label: "Clubes activos" },
            { num: "15+", label: "Países conectados" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-white">{s.num}</div>
              <div className="text-sm text-white/70 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-black text-foreground mb-4">
              ¿Por qué registrarte como jugador?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Linkedgol es la red donde los clubes buscan primero cuando necesitan incorporar.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {beneficios.map((b, i) => (
              <motion.div
                key={b.titulo}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
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
            <h2 className="text-3xl font-display font-black text-foreground mb-4">Cómo funciona para vos</h2>
          </div>
          <div className="space-y-6">
            {pasos.map((paso, i) => (
              <motion.div
                key={paso.num}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6 bg-white border border-border rounded-2xl p-6"
              >
                <div className="text-4xl font-black text-orange-200 shrink-0 w-12 text-center">{paso.num}</div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{paso.titulo}</h3>
                  <p className="text-muted-foreground">{paso.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Qué incluye el perfil */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-black text-foreground mb-4">Tu perfil incluye</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Nombre, edad, posición y nacionalidad",
              "Estado contractual (Libre / Contratado)",
              "Video destacado de tus mejores jugadas",
              "Trayectoria completa por clubes",
              "Estadísticas: partidos, goles, asistencias",
              "Botón de contacto directo",
              "Sello de Verificado por Linkedgol",
              "Aparición en el buscador de clubes",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-orange-600 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-4 whitespace-pre-line">
            {c("jugador_final_title", t("jugador.finalTitle"))}
          </h2>
          <p className="text-white/80 text-lg mb-8 whitespace-pre-line">
            {c("jugador_final_subtitle", t("jugador.finalSubtitle"))}
          </p>
          <Link href={c("jugador_cta_link", "/registro/jugador")}>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-bold shadow-xl">
              {c("jugador_cta_text", t("jugador.cta"))} <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
