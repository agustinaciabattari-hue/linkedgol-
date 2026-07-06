import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Loader2, CheckCircle2, X, Send, Globe2, DollarSign, ArrowRightLeft, Target } from "lucide-react";
import { Button, Card, Badge, Textarea } from "@/components/ui/shared";
import { useListCuratedOffers, useApplyToCuratedOffer } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

export default function OfertasLinkedgol() {
  const { data: offers, isLoading } = useListCuratedOffers();
  const { isLoggedIn, token } = useAuth();
  const { toast } = useToast();

  const [applyingTo, setApplyingTo] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [appliedIds, setAppliedIds] = useState<number[]>([]);

  const applyMutation = useApplyToCuratedOffer({
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
          toast({ title: "¡Postulación enviada!", description: "El equipo de Linkedgol recibió tu mensaje." });
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
        title="Ofertas Linkedgol — Oportunidades Exclusivas"
        description="Oportunidades gestionadas directamente por el equipo de Linkedgol: clubes internacionales buscando talento específico."
        path="/ofertas-linkedgol"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden relative">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="relative z-10 text-white">
            <Badge className="bg-white/15 text-indigo-100 hover:bg-white/20 border-none mb-4">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Gestionadas por Linkedgol
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Ofertas Linkedgol</h1>
            <p className="text-indigo-100 max-w-xl text-lg">
              Oportunidades que conseguimos y gestionamos directamente con clubes de todo el mundo. No son publicaciones de terceros — las validamos nosotros.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : offers && offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, idx) => {
              const isApplying = applyingTo === offer.id;
              const hasApplied = appliedIds.includes(offer.id);
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Card className="p-6 hover:border-indigo-300 hover:shadow-xl transition-all h-full flex flex-col group border-indigo-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0">
                        <Globe2 className="w-5 h-5 text-indigo-700" />
                      </div>
                      <p className="text-sm font-semibold text-indigo-700 truncate">{offer.league}</p>
                    </div>

                    <h3 className="font-bold text-xl text-foreground mb-3 leading-tight">{offer.title}</h3>

                    <div className="space-y-2 mb-4 flex-grow">
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <Target className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                        <span><strong className="text-slate-800">{offer.position}</strong></span>
                      </div>
                      {offer.characteristics && (
                        <p className="text-sm text-slate-500 leading-relaxed">{offer.characteristics}</p>
                      )}
                      {(offer.salaryApprox || offer.transferValueApprox) && (
                        <div className="pt-2 mt-2 border-t border-slate-100 space-y-1.5">
                          {offer.salaryApprox && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <DollarSign className="w-3.5 h-3.5 shrink-0" />
                              <span>Sueldo aprox.: <strong className="text-slate-700">{offer.salaryApprox}</strong></span>
                            </div>
                          )}
                          {offer.transferValueApprox && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <ArrowRightLeft className="w-3.5 h-3.5 shrink-0" />
                              <span>Transferencia: <strong className="text-slate-700">{offer.transferValueApprox}</strong></span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {isApplying ? (
                      <div className="pt-4 border-t border-slate-100 mt-auto space-y-3">
                        <Textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Contanos por qué te interesa esta oferta (opcional)..."
                          rows={3}
                          autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => { setApplyingTo(null); setMessage(""); }}>
                            <X className="w-4 h-4" />
                          </Button>
                          <Button size="sm" onClick={() => handleApply(offer.id)} disabled={applyMutation.isPending}>
                            {applyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-1.5" /> Enviar</>}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-4 border-t border-slate-100 flex justify-end mt-auto">
                        {hasApplied ? (
                          <span className="inline-flex items-center text-sm font-semibold text-green-700">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Postulado
                          </span>
                        ) : isLoggedIn ? (
                          <Button size="sm" className="shadow-md bg-indigo-700 hover:bg-indigo-800" onClick={() => setApplyingTo(offer.id)}>Postular</Button>
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
              <Sparkles className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No hay ofertas exclusivas por ahora</h3>
            <p className="text-muted-foreground max-w-md mb-2 text-lg">
              Estamos gestionando nuevas oportunidades con clubes internacionales. Volvé pronto.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
