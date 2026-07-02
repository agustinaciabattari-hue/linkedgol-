import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Search, Filter, MessageCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/shared";
import { useListSiteContent } from "@workspace/api-client-react";
import { getContentValue } from "@/lib/site-content";

const beneficios = [
  { icon: <Search className="w-6 h-6" />, titulo: "Buscador avanzado", desc: "Filtrá por posición, edad, nacionalidad y estado contractual en segundos." },
  { icon: <Filter className="w-6 h-6" />, titulo: "Jugadores verificados", desc: "Accedé a perfiles reales, con trayectoria y videos verificados por Linkedgol." },
  { icon: <MessageCircle className="w-6 h-6" />, titulo: "Contacto directo", desc: "Contactá al jugador o su agente directamente desde la plataforma." },
  { icon: <Trophy className="w-6 h-6" />, titulo: "Publicá necesidades", desc: "Publicá lo que estás buscando y que los candidatos lleguen solos a vos." },
];

const pasos = [
  { num: "01", titulo: "Registrá tu club", desc: "Completá el perfil institucional: nombre, país, categoría y necesidades actuales." },
  { num: "02", titulo: "Buscá con filtros", desc: "Usá el buscador para encontrar el perfil exacto que necesitás: posición, edad, país, estado." },
  { num: "03", titulo: "Publicá una oportunidad", desc: "Contanos qué jugador necesitás y los candidatos correctos te llegan solos." },
  { num: "04", titulo: "Contactá y concretá", desc: "Escribile directamente al jugador o a su agente para avanzar en la negociación." },
];

const necesidades = [
  "Club de Paraguay busca Delantero Sub 23",
  "Equipo de Perú necesita Volante Ofensivo",
  "Club de Bolivia busca Lateral Derecho",
  "Equipo de Costa Rica necesita Central",
];

export default function LandingClub() {
  const { data: content } = useListSiteContent();
  const c = (key: string, fallback: string) => getContentValue(content, key, fallback);

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-green-800 via-green-600 to-emerald-500">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url('${c("club_hero_image", "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1600&q=80")}')`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block bg-white/20 border border-white/30 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              {c("club_hero_badge", "🏆 Para Clubes")}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-tight mb-6 whitespace-pre-line">
              {c("club_hero_title", "Encontrá el jugador que tu club necesita")}
            </h1>
            <p className="text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed whitespace-pre-line">
              {c("club_hero_subtitle", "Publicá oportunidades, buscá talento por posición y país, y conectate directo con jugadores y agentes.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/perfiles">
                <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-bold shadow-xl shadow-green-900/20">
                  Buscar jugadores ahora <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href={c("club_cta_link", "/registro/club")}>
                <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                  {c("club_cta_text", "Registrar mi club")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-green-700 py-10 border-t border-green-600">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {[
            { num: "1,200+", label: "Jugadores disponibles" },
            { num: "150+", label: "Agentes activos" },
            { num: "15+", label: "Países representados" },
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
              El buscador de talento más completo
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Dejá de buscar jugadores por recomendaciones informales. En Linkedgol tenés la base más actualizada.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {beneficios.map((b, i) => (
              <motion.div
                key={b.titulo}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
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
            <h2 className="text-3xl font-display font-black text-foreground mb-4">Cómo funciona para clubes</h2>
          </div>
          <div className="space-y-6">
            {pasos.map((paso, i) => (
              <motion.div
                key={paso.num}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6 bg-white border border-border rounded-2xl p-6"
              >
                <div className="text-4xl font-black text-green-200 shrink-0 w-12 text-center">{paso.num}</div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{paso.titulo}</h3>
                  <p className="text-muted-foreground">{paso.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Oportunidades activas ejemplo */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-black text-foreground mb-4">Clubes ya están buscando</h2>
            <p className="text-muted-foreground">Publicá tu necesidad y aparecé en este listado.</p>
          </div>
          <div className="space-y-3">
            {necesidades.map((nec) => (
              <div key={nec} className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-semibold text-foreground">{nec}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-green-500" />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/oportunidades">
              <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-50">
                Ver todas las oportunidades
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="py-20 bg-slate-50 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-black text-foreground mb-4">El perfil de tu club incluye</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Perfil institucional con logo y descripción",
              "País, categoría y nivel competitivo",
              "Publicación de necesidades activas",
              "Acceso al buscador completo de jugadores",
              "Filtros por posición, edad, país y estado",
              "Contacto directo con jugadores y agentes",
              "Historial de incorporaciones",
              "Sello de Club Verificado por Linkedgol",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-white border border-green-100 rounded-xl px-4 py-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-green-700 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-4 whitespace-pre-line">
            {c("club_final_title", "Reforzá tu plantel hoy.")}
          </h2>
          <p className="text-white/80 text-lg mb-8 whitespace-pre-line">
            {c("club_final_subtitle", "Registrá tu club, publicá oportunidades y descubrí jugadores libres en toda Latinoamérica.")}
          </p>
          <Link href={c("club_cta_link", "/registro/club")}>
            <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-bold shadow-xl">
              {c("club_cta_text", "Registrar mi club")} <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
