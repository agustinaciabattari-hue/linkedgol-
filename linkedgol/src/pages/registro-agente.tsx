import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Briefcase, Loader2 } from "lucide-react";
import { Button, Card, Input, Label, Textarea } from "@/components/ui/shared";
import { useAuthRegister } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  country: z.string().min(2, "El país es obligatorio"),
  license: z.string().optional(),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Mínimo 6 caracteres"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  agreeToTerms: z.literal(true, { errorMap: () => ({ message: "Tenés que aceptar los términos para continuar" }) }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

type FormData = z.infer<typeof formSchema>;

export default function RegistroAgente() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");
  const { mutate, isPending } = useAuthRegister();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    setErrorMsg("");
    const { confirmPassword, agreeToTerms, ...restData } = data;
    
    mutate({ 
      data: { role: "agent", ...restData } 
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-700 mb-4 shadow-sm">
            <Briefcase className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-3">Sumá tu agencia</h1>
          <p className="text-lg text-slate-600">Creá tu perfil profesional para gestionar a tus jugadores y conectar con clubes.</p>
        </div>

        <Card className="p-6 sm:p-8 shadow-xl border-cyan-100/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Cuenta */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mb-6">Datos de Cuenta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label>Email corporativo *</Label>
                  <Input type="email" {...register("email")} placeholder="contacto@agencia.com" className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""} />
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

            {/* Información Profesional */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mb-6">Información Profesional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nombre completo o Agencia *</Label>
                  <Input {...register("name")} placeholder="Ej. Global Sports..." className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>País base de operaciones *</Label>
                  <Input {...register("country")} placeholder="Ej. España" className={errors.country ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.country && <p className="text-red-500 text-xs">{errors.country.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Licencia FIFA / Habilitación</Label>
                  <Input {...register("license")} placeholder="Opcional: ID de licencia para tener perfil verificado" />
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mb-6">Contacto y Detalles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label>Teléfono / WhatsApp</Label>
                  <Input {...register("phone")} placeholder="+34 600..." />
                </div>
                <div className="space-y-2">
                  <Label>Logo de la agencia (Link de imagen)</Label>
                  <Input {...register("imageUrl")} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descripción de tu agencia</Label>
                <Textarea {...register("bio")} placeholder="Mercados en los que operás, años de experiencia..." />
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
              <Button type="submit" variant="blue" size="lg" className="w-full" disabled={isPending}>
                {isPending ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creando cuenta...</>
                ) : "Completar Registro"}
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
