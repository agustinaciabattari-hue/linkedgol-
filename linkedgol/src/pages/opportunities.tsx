import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Briefcase, Building, PlusCircle, Send, Loader2, CheckCircle2, X } from "lucide-react";
import { Button, Card, Badge, Textarea } from "@/components/ui/shared";
import { useListOpportunities, useApplyToOpportunity } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { TranslateToggle } from "@/components/TranslateToggle";
import { SEO } from "@/components/SEO";

export default function Opportunities() {
  const { data: opportunities, isLoading } = useListOpportunities();
  const { isLoggedIn, token } = useAuth();
  const { toast } = useToast();

  const [applyingTo, setApplyingTo] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [appliedIds, setAppliedIds] = useState<number[]>([]);

  const applyMutation = useApplyToOpportunity({
    request: { headers: { Authorization: `Bearer ${token}` } },
  });

  const handleApply = (id: number) => {
    applyMutation.mutate(
      { id, data: { message } },
      {
        onSuccess: () => {
          setAppliedIds((prev) => [...prev, id]);
          setApplyingTo(null);
          setMessage("");
          toast({ title: "¡Postulación enviada!", description: "El club recibió tu mensaje por email." });
        },
        onError: () => {
          toast({ title: "Error", description: "No se pudo enviar la postulación.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <SEO
        title="Oportunidades Activas — Mercado de Pases"
        description="Descubrí qué posiciones están buscando los clubes en este momento y postulá directamente desde Linkedgol."
        path="/oportunidades"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-blue-900 rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden relative">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="relative z-10 text-white">
            <Badge className="bg-blue-500/30 text-blue-100 hover:bg-blue-500/40 border-none mb-4">Mercado de Pases</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Oportunidades Activas</h1>
            <p className="text-blue-100 max-w-xl text-lg">
              Descubrí qué posiciones están buscando los clubes y postulá directamente si tu perfil coincide.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link href="/registro/club">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 border-none shadow-lg">
                <PlusCircle className="w-5 h-5 mr-2" /> Publicar Necesidad
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : opportunities && opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp, idx) => {
              const isApplying = applyingTo === opp.id;
              const hasApplied = appliedIds.includes(opp.id);
              return (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-6 hover:border-primary/40 hover:shadow-xl transition-all h-full flex flex-col group">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border border-blue-200 group-hover:scale-110 transition-transform">
                          <Building className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">{opp.country}</p>
                          <p className="text-sm font-semibold text-slate-800">{opp.clubName}</p>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-xl text-foreground mb-3 leading-tight">{opp.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-grow leading-relaxed">{opp.description}</p>
                    {opp.description && <TranslateToggle text={opp.description} />}

                    {isApplying ? (
                      <div className="pt-4 border-t border-slate-100 mt-auto space-y-3">
                        <Textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Contale al club por qué te interesa (opcional)..."
                          rows={3}
                          autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => { setApplyingTo(null); setMessage(""); }}>
                            <X className="w-4 h-4" />
                          </Button>
                          <Button size="sm" onClick={() => handleApply(opp.id)} disabled={applyMutation.isPending}>
                            {applyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-1.5" /> Enviar</>}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                        <Badge variant="default" className="bg-blue-50/50 text-blue-700 border-blue-200 px-3 py-1">{opp.role}</Badge>
                        {hasApplied ? (
                          <span className="inline-flex items-center text-sm font-semibold text-green-700">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Postulado
                          </span>
                        ) : isLoggedIn ? (
                          <Button size="sm" className="shadow-md" onClick={() => setApplyingTo(opp.id)}>Postular</Button>
                        ) : (
                          <Link href="/ingresar">
                            <Button size="sm" variant="outline" className="shadow-sm">Iniciá sesión para postular</Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border p-12 text-center flex flex-col items-center justify-center min-h-[300px] shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Briefcase className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No hay búsquedas activas</h3>
            <p className="text-muted-foreground max-w-md mb-8 text-lg">
              Pronto aparecerán nuevas oportunidades de clubes aquí. ¡Mantené tu perfil actualizado!
            </p>
            <Link href="/registro/club">
              <Button size="lg" variant="green">Soy Club y busco jugadores</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
