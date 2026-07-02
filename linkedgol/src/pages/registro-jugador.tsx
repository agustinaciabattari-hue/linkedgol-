import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trophy, Loader2 } from "lucide-react";
import { Button, Card, Input, Label, Select, Textarea } from "@/components/ui/shared";
import { useAuthRegister } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  position: z.string().min(1, "Selecciona una posición"),
  age: z.coerce.number().min(15).max(45),
  nationality: z.string().min(2, "La nacionalidad es obligatoria"),
  status: z.enum(["Libre", "Contratado"]),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Mínimo 6 caracteres"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  goals: z.coerce.number().optional(),
  assists: z.coerce.number().optional(),
  matches: z.coerce.number().optional(),
  agreeToTerms: z.literal(true, { errorMap: () => ({ message: "Tenés que aceptar los términos para continuar" }) }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

type FormData = z.infer<typeof formSchema>;

export default function RegistroJugador() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");
  const { mutate, isPending } = useAuthRegister();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { status: "Libre", goals: 0, assists: 0, matches: 0 }
  });

  const onSubmit = (data: FormData) => {
    setErrorMsg("");
    const { confirmPassword, agreeToTerms, ...restData } = data;
    
    mutate({ 
      data: { role: "player", ...restData } 
    }, {
      onSuccess: (res) => {
        login(res.token, res.user as any, res.profile);
        setLocation("/mi-perfil");
      },
      onError: (err: any) => {
        if (err?.response?.status === 409 || err?.status === 409 || err?.message?.includes("409")) {
          setErrorMsg("Ya existe una cuenta con ese email.");
        } else {
          setErrorMsg("Ocurrió un error al crear la cuenta.");
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mb-4 shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-3">Creá tu perfil de Jugador</h1>
          <p className="text-lg text-slate-600">Completá tus datos para que los clubes puedan encontrarte y contactarte.</p>
        </div>

        <Card className="p-6 sm:p-8 shadow-xl border-orange-100/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Cuenta */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mb-6">Datos de Cuenta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label>Email * (Será tu usuario de acceso)</Label>
                  <Input type="email" {...register("email")} placeholder="tu@email.com" className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Contraseña *</Label>
                  <Input type="password" {...register("password")} placeholder="Mínimo 6 caracteres" className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Confirmar contraseña *</Label>
                  <Input type="password" {...register("confirmPassword")} placeholder="Repetir contraseña" className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            {/* Información Personal */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mb-6">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nombre completo *</Label>
                  <Input {...register("name")} placeholder="Ej. Lionel Messi" className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Nacionalidad *</Label>
                  <Input {...register("nationality")} placeholder="Ej. Argentina" className={errors.nationality ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.nationality && <p className="text-red-500 text-xs">{errors.nationality.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Edad *</Label>
                  <Input type="number" {...register("age")} placeholder="Ej. 24" className={errors.age ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.age && <p className="text-red-500 text-xs">{errors.age.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Ubicación actual</Label>
                  <Input {...register("location")} placeholder="Ej. Buenos Aires" />
                </div>
              </div>
            </div>

            {/* Perfil Deportivo */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mb-6">Perfil Deportivo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Posición principal *</Label>
                  <Select {...register("position")} className={errors.position ? "border-red-500 focus-visible:ring-red-500" : ""}>
                    <option value="">Seleccionar posición</option>
                    <option value="Arquero">Arquero</option>
                    <option value="Defensor">Defensor Central</option>
                    <option value="Lateral">Lateral</option>
                    <option value="Mediocampista">Mediocampista</option>
                    <option value="Volante">Volante Ofensivo</option>
                    <option value="Extremo">Extremo</option>
                    <option value="Delantero">Delantero Centro</option>
                  </Select>
                  {errors.position && <p className="text-red-500 text-xs">{errors.position.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Estado contractual *</Label>
                  <Select {...register("status")}>
                    <option value="Libre">Jugador Libre</option>
                    <option value="Contratado">Con contrato vigente</option>
                  </Select>
                </div>
                
                {/* Stats */}
                <div className="col-span-full grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-2">
                    <Label>Partidos</Label>
                    <Input type="number" {...register("matches")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Goles</Label>
                    <Input type="number" {...register("goals")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Asistencias</Label>
                    <Input type="number" {...register("assists")} />
                  </div>
                </div>
              </div>
            </div>

            {/* Multimedia y Contacto */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mb-6">Multimedia y Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label>Teléfono / WhatsApp</Label>
                  <Input {...register("phone")} placeholder="+54 9 11..." />
                </div>
                <div className="space-y-2">
                  <Label>Link de Video (Highlights)</Label>
                  <Input {...register("videoUrl")} placeholder="https://youtube.com/watch?v=..." />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Link de Foto de Perfil</Label>
                  <Input {...register("imageUrl")} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Biografía / Descripción</Label>
                <Textarea {...register("bio")} placeholder="Contale a los clubes sobre tu estilo de juego, tu pierna hábil, características..." />
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center font-medium border border-red-100">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <label className="flex items-start gap-3 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" {...register("agreeToTerms")} className="mt-1 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                <span>
                  Acepto los <Link href="/terminos" className="text-primary font-medium hover:underline" target="_blank">Términos y Condiciones</Link> y la{" "}
                  <Link href="/privacidad" className="text-primary font-medium hover:underline" target="_blank">Política de Privacidad</Link> de Linkedgol.
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms.message}</p>}
            </div>

            <div className="pt-6 border-t flex flex-col items-center gap-4">
              <Button type="submit" variant="orange" size="lg" className="w-full" disabled={isPending}>
                {isPending ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creando cuenta...</>
                ) : "Crear mi cuenta"}
              </Button>
              <p className="text-sm text-slate-500">
                ¿Ya tenés cuenta? <Link href="/ingresar" className="text-primary font-semibold hover:underline">Iniciá sesión</Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
