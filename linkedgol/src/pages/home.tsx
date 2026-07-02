import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Users, Briefcase, ShieldCheck, MapPin, CheckCircle2 } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui/shared";
import { useListPlayers, useListOpportunities, useListSiteContent } from "@workspace/api-client-react";
import { MOCK_PLAYERS } from "@/lib/mock";
import { getContentValue } from "@/lib/site-content";

export default function Home() {
  const { data: dbPlayers, isLoading: loadingPlayers } = useListPlayers();
  const { data: opportunities, isLoading: loadingOpps } = useListOpportunities();
  const { data: content } = useListSiteContent();

  const c = (key: string, fallback: string) => getContentValue(content, key, fallback);

  // Use DB players if available, otherwise fallback to mock data
  const players = dbPlayers && dbPlayers.length > 0 ? dbPlayers : MOCK_PLAYERS;
  const featuredPlayers = players.slice(0, 4);
  const activeOpps = opportunities?.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={c("home_hero_image", "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&h=1080&fit=crop")} 
            alt="Stadium" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="default" className="bg-white/10 text-white border-white/20 mb-6 backdrop-blur-sm px-4 py-1.5 text-sm">
              {c("home_hero_badge", "La mayor red de fútbol profesional")}
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white max-w-4xl mx-auto leading-tight mb-6">
              {c("home_hero_title", "Conectando el talento con oportunidades en el fútbol")}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 whitespace-pre-line">
              {c("home_hero_subtitle", "Linkedgol es la plataforma definitiva donde jugadores, agentes y clubes descubren, negocian y construyen el futuro del deporte.")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/jugador" className="w-full sm:w-auto">
                <Button variant="orange" size="lg" className="w-full">SOY JUGADOR</Button>
              </Link>
              <Link href="/agente" className="w-full sm:w-auto">
                <Button variant="blue" size="lg" className="w-full">SOY AGENTE</Button>
              </Link>
              <Link href="/club" className="w-full sm:w-auto">
                <Button variant="green" size="lg" className="w-full">SOY CLUB</Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-white">{c("home_stats_players", "1,200+")}</div>
                <div className="text-sm text-slate-400 font-medium">Jugadores</div>
              </div>
              <div className="text-center border-y sm:border-y-0 sm:border-x border-white/10 py-4 sm:py-0">
                <div className="text-3xl font-display font-bold text-white">{c("home_stats_agents", "150+")}</div>
                <div className="text-sm text-slate-400 font-medium">Agentes FIFA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-white">{c("home_stats_clubs", "80+")}</div>
                <div className="text-sm text-slate-400 font-medium">Clubes Activos</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Profiles Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Perfiles Destacados</h2>
              <p className="text-muted-foreground">Descubre el talento que está rompiendo esquemas.</p>
            </div>
            <Link href="/perfiles" className="inline-flex items-center text-primary font-semibold hover:underline bg-primary/5 px-4 py-2 rounded-lg">
              Ver todos <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          {loadingPlayers ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPlayers.map((player, idx) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer border-transparent hover:border-primary/20 overflow-hidden">
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img 
                        src={player.imageUrl || "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&h=300&fit=crop"} 
                        alt={player.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant={player.status === "Libre" ? "success" : "default"} className="shadow-sm backdrop-blur-md bg-white/90">
                          {player.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-foreground truncate flex items-center gap-1.5">
                        {player.name}
                        {player.verified && (
                          <div title="Verificado por Linkedgol" className="text-blue-600 shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1 mb-4 truncate">
                        <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
                        <span className="truncate">{player.nationality} • {player.age} años</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">{player.position}</span>
                        <Link href={`/perfil/${player.id}`}>
                          <Button size="sm" variant="outline" className="text-xs h-8">Ver Perfil</Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Active Opportunities Section */}
      <section className="py-20 bg-slate-50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Oportunidades Activas</h2>
              <p className="text-muted-foreground">Clubes buscando talento en este momento.</p>
            </div>
            <Link href="/oportunidades" className="inline-flex items-center text-primary font-semibold hover:underline bg-primary/5 px-4 py-2 rounded-lg">
              Ver todas <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {loadingOpps ? (
              [1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-200 animate-pulse rounded-2xl"></div>)
            ) : activeOpps.length > 0 ? (
              activeOpps.map((opp, idx) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-6 hover:border-primary/30 hover:shadow-lg transition-all h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                          {opp.country.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-primary uppercase tracking-wider">{opp.country}</p>
                          <p className="text-sm font-medium text-slate-700">{opp.clubName}</p>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{opp.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-6 flex-grow">{opp.description}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-100">{opp.role}</Badge>
                      <Link href="/oportunidades">
                        <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5">Postular</Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-muted-foreground mb-4">Aún no hay oportunidades publicadas.</p>
                <Link href="/registro/club">
                  <Button variant="outline">Ser el primero en publicar</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it works simple banner */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-16">{c("home_how_title", "¿Cómo funciona Linkedgol?")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 shadow-xl shadow-black/10">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{c("home_step1_title", "1. Crea tu Perfil")}</h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-xs whitespace-pre-line">{c("home_step1_desc", "Regístrate como jugador, agente o club. Sube tus datos, videos y trayectoria para destacar en la red.")}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 shadow-xl shadow-black/10">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{c("home_step2_title", "2. Explora el Mercado")}</h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-xs whitespace-pre-line">{c("home_step2_desc", "Busca talento específico utilizando filtros avanzados o encuentra oportunidades de clubes de todo el mundo.")}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 shadow-xl shadow-black/10">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{c("home_step3_title", "3. Conecta y Cierra")}</h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-xs whitespace-pre-line">{c("home_step3_desc", "Inicia conversaciones directas, negocia términos y avanza profesionalmente en tu carrera deportiva.")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
