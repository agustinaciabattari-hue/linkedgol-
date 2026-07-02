import { useState } from "react";
import { Link } from "wouter";
import { Mail, Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import { Button, Card, Input, Label, Textarea } from "@/components/ui/shared";
import { useSendContactMessage } from "@workspace/api-client-react";

export default function Contacto() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const mutation = useSendContactMessage({
    mutation: {
      onSuccess: () => setSent(true),
      onError: () => setError("No se pudo enviar el mensaje. Intentá de nuevo en unos minutos."),
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !message.trim()) return;
    mutation.mutate({ data: { name, email, message } });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-3">Contactanos</h1>
          <p className="text-lg text-slate-600">
            ¿Tenés una consulta, sugerencia o problema con tu cuenta? Escribinos.
          </p>
        </div>

        <Card className="p-6 sm:p-8 shadow-xl">
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">¡Mensaje enviado!</h2>
              <p className="text-slate-500 mb-6">Te vamos a responder a la brevedad al email que nos dejaste.</p>
              <Link href="/">
                <Button variant="outline">Volver al inicio</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nombre *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-slate-400" />
                    </div>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mensaje *</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Contanos en qué te podemos ayudar..."
                  rows={6}
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-center text-sm border border-red-100">
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar mensaje"}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
