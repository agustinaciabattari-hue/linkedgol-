import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trophy, Loader2 } from "lucide-react";
import { Button, Card, Input, Label, Select, Textarea } from "@/components/ui/shared";
import { useAuthRegister } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

const formSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  position: z.string().min(1, "Selecciona una posición"),
  age: z.coerce.number().min(15).max(45),
  nationality: z.string().min(2, "La nacionalidad es obligatoria"),
  otherCitizenships: z.string().optional(),
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
  const { t } = useLanguage();
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
          setErrorMsg(t("registro.duplicateEmail"));
        } else {
          setErrorMsg(t("registro.genericError"));
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <SEO
        title="Registrate como Jugador"
        description="Creá gratis tu perfil de jugador en Linkedgol y aparecé en las búsquedas de clubes y agentes de toda Latinoamérica."
        path="/registro/jugador"
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mb-4 shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-3">{t("registro.playerTitle")}</h1>
          <p className="text-lg text-slate-600">{t("registro.playerSubtitle")}</p>
        </div>

        <Card className="p-6 sm:p-8 shadow-xl border-orange-100/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Cuenta */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mb-6">{t("registro.accountData")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label>{t("registro.emailLabel")}</Label>
                  <Input type="email" {...register("email")} placeholder="tu@email.com" className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t("registro.password")}</Label>
                  <Input type="password" {...register("password")} placeholder={t("registro.passwordPlaceholder")} className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t("registro.confirmPassword")}</Label>
                  <Input type="password" {...register("confirmPassword")} placeholder={t("registro.confirmPasswordPlaceholder")} className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            {/* Información Personal */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mb-6">{t("registro.personalInfo")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{t("registro.fullName")}</Label>
                  <Input {...register("name")} placeholder={t("registro.namePlaceholder")} className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t("registro.nationality")}</Label>
                  <Input {...register("nationality")} placeholder={t("registro.nationalityPlaceholder")} className={errors.nationality ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.nationality && <p className="text-red-500 text-xs">{errors.nationality.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>{t("registro.otherCitizenships")}</Label>
                  <Input {...register("otherCitizenships")} placeholder={t("registro.otherCitizenshipsPlaceholder")} />
                  <p className="text-xs text-slate-400">{t("registro.otherCitizenshipsHelp")}</p>
                </div>
                <div className="space-y-2">
                  <Label>{t("registro.age")}</Label>
                  <Input type="number" {...register("age")} placeholder={t("registro.agePlaceholder")} className={errors.age ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.age && <p className="text-red-500 text-xs">{errors.age.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t("registro.currentLocation")}</Label>
                  <Input {...register("location")} placeholder={t("registro.locationPlaceholder")} />
                </div>
              </div>
            </div>

            {/* Perfil Deportivo */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mb-6">{t("registro.sportsProfile")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{t("registro.mainPosition")}</Label>
                  <Select {...register("position")} className={errors.position ? "border-red-500 focus-visible:ring-red-500" : ""}>
                    <option value="">{t("registro.selectPosition")}</option>
                    <option value="Arquero">{t("profiles.goalkeeper")}</option>
                    <option value="Defensor">{t("profiles.centerBack")}</option>
                    <option value="Lateral">{t("profiles.fullback")}</option>
                    <option value="Mediocampista">{t("profiles.midfielder")}</option>
                    <option value="Volante">{t("profiles.attackingMid")}</option>
                    <option value="Extremo">{t("profiles.winger")}</option>
                    <option value="Delantero">{t("profiles.striker")}</option>
                  </Select>
                  {errors.position && <p className="text-red-500 text-xs">{errors.position.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t("registro.contractStatus")}</Label>
                  <Select {...register("status")}>
                    <option value="Libre">{t("registro.freeAgentOption")}</option>
                    <option value="Contratado">{t("registro.underContract")}</option>
                  </Select>
                </div>
                
                {/* Stats */}
                <div className="col-span-full grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-2">
                    <Label>{t("registro.matches")}</Label>
                    <Input type="number" {...register("matches")} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("registro.goals")}</Label>
                    <Input type="number" {...register("goals")} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("registro.assists")}</Label>
                    <Input type="number" {...register("assists")} />
                  </div>
                </div>
              </div>
            </div>

            {/* Multimedia y Contacto */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mb-6">{t("registro.mediaContact")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label>{t("registro.phone")}</Label>
                  <Input {...register("phone")} placeholder="+54 9 11..." />
                </div>
                <div className="space-y-2">
                  <Label>{t("registro.videoLink")}</Label>
                  <Input {...register("videoUrl")} placeholder="https://youtube.com/watch?v=..." />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>{t("registro.photoLink")}</Label>
                  <Input {...register("imageUrl")} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("registro.bio")}</Label>
                <Textarea {...register("bio")} placeholder={t("registro.bioPlaceholder")} />
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
                  {t("registro.agreeTermsPrefix")} <Link href="/terminos" className="text-primary font-medium hover:underline" target="_blank">{t("registro.termsLink")}</Link> {t("registro.agreeTermsAnd")}{" "}
                  <Link href="/privacidad" className="text-primary font-medium hover:underline" target="_blank">{t("registro.privacyLink")}</Link> {t("registro.ofLinkedgol")}
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms.message}</p>}
            </div>

            <div className="pt-6 border-t flex flex-col items-center gap-4">
              <Button type="submit" variant="orange" size="lg" className="w-full" disabled={isPending}>
                {isPending ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t("registro.creatingAccount")}</>
                ) : t("registro.createAccount")}
              </Button>
              <p className="text-sm text-slate-500">
                {t("registro.alreadyHaveAccount")} <Link href="/ingresar" className="text-primary font-semibold hover:underline">{t("registro.loginLink")}</Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
