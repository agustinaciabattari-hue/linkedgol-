import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldHalf, Loader2 } from "lucide-react";
import { Button, Card, Input, Label, Textarea } from "@/components/ui/shared";
import { useAuthRegister } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const formSchema = z.object({
  name: z.string().min(2, "El nombre del club es obligatorio"),
  country: z.string().min(2, "El país es obligatorio"),
  category: z.string().optional(),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Mínimo 6 caracteres"),
  phone: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  agreeToTerms: z.literal(true, { errorMap: () => ({ message: "Tenés que aceptar los términos para continuar" }) }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

type FormData = z.infer<typeof formSchema>;

export default function RegistroClub() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [errorMsg, setErrorMsg] = useState("");
  const { mutate, isPending } = useAuthRegister();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    setErrorMsg("");
    const { confirmPassword, agreeToTerms, ...restData } = data;
    
    mutate({ 
      data: { role: "club", ...restData } 
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 text-green-700 mb-4 shadow-sm">
            <ShieldHalf className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-3">{t("registro.clubPageTitle")}</h1>
          <p className="text-lg text-slate-600">{t("registro.clubPageSubtitle")}</p>
        </div>

        <Card className="p-6 sm:p-8 shadow-xl border-green-100/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Cuenta */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mb-6">{t("registro.accountData")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label>{t("registro.institutionalEmail")}</Label>
                  <Input type="email" {...register("email")} placeholder="secretaria@club.com" className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""} />
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

            {/* Información Institucional */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mb-6">{t("registro.institutionalInfo")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{t("registro.institutionName")}</Label>
                  <Input {...register("name")} placeholder={t("registro.institutionNamePlaceholder")} className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t("registro.countryLabel")}</Label>
                  <Input {...register("country")} placeholder={t("registro.countryPlaceholder")} className={errors.country ? "border-red-500 focus-visible:ring-red-500" : ""} />
                  {errors.country && <p className="text-red-500 text-xs">{errors.country.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>{t("registro.categoryLeague")}</Label>
                  <Input {...register("category")} placeholder={t("registro.categoryLeaguePlaceholder")} />
                </div>
              </div>
            </div>

            {/* Contacto Oficial */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 border-b pb-2 mb-6">{t("registro.officialContact")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label>{t("registro.techSecretaryPhone")}</Label>
                  <Input {...register("phone")} placeholder="+..." />
                </div>
                <div className="space-y-2">
                  <Label>{t("registro.clubCrest")}</Label>
                  <Input {...register("imageUrl")} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("registro.institutionDescription")}</Label>
                <Textarea {...register("description")} placeholder={t("registro.institutionDescriptionPlaceholder")} />
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
              <Button type="submit" variant="green" size="lg" className="w-full" disabled={isPending}>
                {isPending ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t("registro.registeringClub")}</>
                ) : t("registro.finishRegistration")}
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
