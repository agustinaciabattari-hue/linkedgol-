import { useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, MapPin, Calendar, Activity, Mail, CheckCircle2, Loader2, Send } from "lucide-react";
import { Button, Card, Badge, Textarea } from "@/components/ui/shared";
import { useGetPlayer, useContactPlayer } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function PlayerProfile() {
  const params = useParams();
  const id = Number(params.id);
  const { isLoggedIn, token } = useAuth();
  const { toast } = useToast();

  const { data: player, isLoading } = useGetPlayer(id, { query: { enabled: !!id } });

  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const contactMutation = useContactPlayer({
    request: { headers: { Authorization: `Bearer ${token}` } },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    contactMutation.mutate(
      { id, data: { message } },
      {
        onSuccess: () => {
          setSent(true);
          setMessage("");
          toast({ title: "Mensaje enviado", description: "Le avisamos al jugador por email." });
        },
        onError: () => {
          toast({ title: "Error", description: "No se pudo enviar el mensaje.", variant: "destructive" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 flex justify-center">
        <div className="animate-pulse bg-white w-full max-w-4xl h-96 rounded-3xl border border-slate-200"></div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-20 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800">Jugador no encontrado</h2>
        <Link href="/perfiles" className="mt-4 text-primary hover:underline">Volver a perfiles</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/perfiles" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver al buscador
        </Link>

        {/* Profile Header Card */}
        <Card className="overflow-hidden border-none shadow-xl mb-8">
          <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-600 to-indigo-800"></div>
          <div className="px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20 mb-6">
              <img 
                src={player.imageUrl || "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&h=400&fit=crop"} 
                alt={player.name}
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full border-4 border-white shadow-lg bg-white"
              />
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  {player.name}
                  {player.verified && (
                    <span title="Perfil Verificado por Linkedgol" className="inline-flex items-center text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-semibold align-middle shadow-sm">
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Verificado
                    </span>
                  )}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-slate-600 font-medium">
                  <Badge className="text-sm px-3 py-1 bg-slate-100 text-slate-800 border-none">{player.position}</Badge>
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {player.nationality}</span>
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {player.age} años</span>
                </div>
              </div>
              <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
                <Badge variant={player.status === "Libre" ? "success" : "default"} className="px-4 py-1.5 text-sm">
                  Estado: {player.status}
                </Badge>
                {isLoggedIn ? (
                  <Button className="w-full sm:w-auto" onClick={() => setShowContactForm((v) => !v)}>
                    <Mail className="w-4 h-4 mr-2" /> Contactar
                  </Button>
                ) : (
                  <Link href="/ingresar" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto"><Mail className="w-4 h-4 mr-2" /> Iniciá sesión para contactar</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Contact form */}
        {showContactForm && isLoggedIn && (
          <Card className="p-6 mb-8 border-primary/20">
            {sent ? (
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="font-medium">¡Mensaje enviado! El jugador recibió tu contacto por email.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Enviar mensaje a {player.name}</h3>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Contale por qué te interesa su perfil..."
                  className="mb-4"
                  rows={4}
                />
                <div className="flex justify-end">
                  <Button onClick={handleSendMessage} disabled={contactMutation.isPending || !message.trim()}>
                    {contactMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...</>
                    ) : (
                      <><Send className="w-4 h-4 mr-2" /> Enviar mensaje</>
                    )}
                  </Button>
                </div>
              </>
            )}
          </Card>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            {/* Bio */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center text-slate-900">
                <Activity className="w-5 h-5 mr-2 text-primary" /> Perfil Deportivo
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {player.bio || "No hay biografía disponible para este jugador."}
              </p>
            </Card>

            {/* Video (if available) */}
            {player.videoUrl && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-slate-900">Video Highlights</h3>
                <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center text-slate-400">
                  <a href={player.videoUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">
                    Ver video en YouTube
                  </a>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-8">
            {/* Stats Card */}
            <Card className="p-6 bg-slate-900 text-white border-none shadow-xl shadow-slate-900/10">
              <h3 className="text-lg font-bold mb-6 text-slate-200">Estadísticas Principales</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Partidos Jugados</p>
                  <p className="text-3xl font-bold text-white">{player.matches || 0}</p>
                </div>
                <div className="h-px bg-slate-800"></div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Goles</p>
                  <p className="text-3xl font-bold text-white">{player.goals || 0}</p>
                </div>
                <div className="h-px bg-slate-800"></div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Asistencias</p>
                  <p className="text-3xl font-bold text-white">{player.assists || 0}</p>
                </div>
              </div>
            </Card>

            {/* Basic Info */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 text-slate-900">Datos Físicos</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Ubicación Actual</span>
                  <span className="font-medium text-slate-900">{player.location || "-"}</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Nacionalidad</span>
                  <span className="font-medium text-slate-900">{player.nationality}</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Edad</span>
                  <span className="font-medium text-slate-900">{player.age} años</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">Posición</span>
                  <span className="font-medium text-slate-900">{player.position}</span>
                </li>
              </ul>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
