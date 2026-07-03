import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LogOut, User, Building2, Briefcase, Loader2, Save, MailWarning, Plus, Trash2, X } from "lucide-react";
import { Button, Card, Input, Label, Select, Textarea, Badge } from "@/components/ui/shared";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import {
  useAuthUpdateProfile, useAuthResendVerification,
  useListMyOpportunities, useCreateOpportunity, useDeleteOpportunity,
  getListMyOpportunitiesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const newOpportunitySchema = z.object({
  title: z.string().min(3, "Obligatorio"),
  role: z.string().min(1, "Obligatorio"),
  description: z.string().optional(),
});
type NewOpportunityData = z.infer<typeof newOpportunitySchema>;

// Forms Schemas
const playerSchema = z.object({
  name: z.string().min(2, "Obligatorio"),
  position: z.string().min(1, "Obligatorio"),
  age: z.coerce.number().min(15).max(50),
  nationality: z.string().min(2, "Obligatorio"),
  status: z.enum(["Libre", "Contratado"]),
  location: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  videoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  imageUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  goals: z.coerce.number().optional(),
  assists: z.coerce.number().optional(),
  matches: z.coerce.number().optional(),
});

const agentSchema = z.object({
  name: z.string().min(2, "Obligatorio"),
  license: z.string().optional(),
  country: z.string().min(2, "Obligatorio"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  imageUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

const clubSchema = z.object({
  name: z.string().min(2, "Obligatorio"),
  country: z.string().min(2, "Obligatorio"),
  category: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

export default function MiPerfil() {
  const [, setLocation] = useLocation();
  const { user, profile, token, isLoading, isLoggedIn, logout, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const updateMutation = useAuthUpdateProfile({
    request: { headers: { Authorization: `Bearer ${token}` } }
  });

  const resendMutation = useAuthResendVerification();
  const [verificationResent, setVerificationResent] = useState(false);

  const handleResendVerification = () => {
    if (!user?.email) return;
    resendMutation.mutate({ data: { email: user.email } }, { onSuccess: () => setVerificationResent(true) });
  };

  // --- Club: opportunities management ---
  const queryClient = useQueryClient();
  const isClub = user?.role === "club";

  const { data: myOpportunities = [], isLoading: loadingMyOpps } = useListMyOpportunities({
    request: { headers: { Authorization: `Bearer ${token}` } },
    query: { enabled: isClub },
  });

  const createOpportunity = useCreateOpportunity({ request: { headers: { Authorization: `Bearer ${token}` } } });
  const deleteOpportunity = useDeleteOpportunity({ request: { headers: { Authorization: `Bearer ${token}` } } });

  const [showNewOpportunity, setShowNewOpportunity] = useState(false);
  const oppForm = useForm<NewOpportunityData>({ resolver: zodResolver(newOpportunitySchema) });

  const handleCreateOpportunity = (data: NewOpportunityData) => {
    createOpportunity.mutate(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMyOpportunitiesQueryKey() });
          oppForm.reset();
          setShowNewOpportunity(false);
          toast({ title: t("miPerfil.opportunityPublished"), description: t("miPerfil.opportunityPublishedDesc") });
        },
        onError: () => {
          toast({ title: "Error", description: t("miPerfil.publishError"), variant: "destructive" });
        },
      }
    );
  };

  const handleDeleteOpportunity = (id: number) => {
    deleteOpportunity.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMyOpportunitiesQueryKey() });
          toast({ title: t("miPerfil.opportunityDeleted") });
        },
        onError: () => {
          toast({ title: "Error", description: t("miPerfil.deleteError"), variant: "destructive" });
        },
      }
    );
  };

  // Decide schema based on role
  const getResolver = () => {
    if (user?.role === "player") return zodResolver(playerSchema);
    if (user?.role === "agent") return zodResolver(agentSchema);
    return zodResolver(clubSchema);
  };

  const form = useForm({
    resolver: getResolver(),
    defaultValues: profile || {}
  });

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      setLocation("/ingresar");
    }
  }, [isLoading, isLoggedIn, setLocation]);

  useEffect(() => {
    if (profile) {
      form.reset(profile);
    }
  }, [profile, form]);

  const onSubmit = async (data: any) => {
    try {
      await updateMutation.mutateAsync({ data });
      await refreshProfile();
      toast({
        title: t("miPerfil.profileUpdated"),
        description: t("miPerfil.profileUpdatedDesc"),
      });
    } catch (err) {
      toast({
        title: "Error",
        description: t("miPerfil.updateError"),
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  if (isLoading || !isLoggedIn || !user) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const roleLabels = {
    player: { icon: User, label: t("miPerfil.roleePlayer"), color: "bg-orange-100 text-orange-700" },
    agent: { icon: Briefcase, label: t("miPerfil.roleAgent"), color: "bg-cyan-100 text-cyan-700" },
    club: { icon: Building2, label: t("miPerfil.roleClub"), color: "bg-green-100 text-green-700" }
  };
  
  const RoleIcon = roleLabels[user.role].icon;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <SEO title="Mi Perfil" description="Editá tu perfil de Linkedgol." path="/mi-perfil" noindex />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Email verification banner */}
        {!user.emailVerified && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <MailWarning className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{t("miPerfil.emailNotVerified")}</p>
            </div>
            {verificationResent ? (
              <span className="text-sm font-medium text-amber-700">{t("miPerfil.linkResent")}</span>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="border-amber-300 text-amber-800 hover:bg-amber-100 shrink-0"
                onClick={handleResendVerification}
                disabled={resendMutation.isPending}
              >
                {resendMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t("miPerfil.resendEmail")}
              </Button>
            )}
          </div>
        )}

        {/* Header Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${roleLabels[user.role].color}`}>
              <RoleIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">{profile?.name || user.email}</h1>
                <Badge variant="default" className={roleLabels[user.role].color + " border-none"}>
                  {roleLabels[user.role].label}
                </Badge>
              </div>
              <p className="text-slate-500 font-medium">{user.email}</p>
            </div>
          </div>
          
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> {t("miPerfil.logout")}
          </Button>
        </div>

        {/* Form Card */}
        <Card className="p-6 md:p-8 shadow-sm">
          <div className="mb-8 border-b pb-4">
            <h2 className="text-xl font-bold text-slate-900">{t("miPerfil.editPublicInfo")}</h2>
            <p className="text-slate-500 mt-1">{t("miPerfil.editPublicInfoSubtitle")}</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* PLAYER FIELDS */}
            {user.role === "player" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{t("miPerfil.fullName")}</Label>
                    <Input {...form.register("name")} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("miPerfil.nationality")}</Label>
                    <Input {...form.register("nationality")} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("miPerfil.age")}</Label>
                    <Input type="number" {...form.register("age")} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("miPerfil.currentLocation")}</Label>
                    <Input {...form.register("location")} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("miPerfil.mainPosition")}</Label>
                    <Select {...form.register("position")}>
                      <option value="Arquero">{t("profiles.goalkeeper")}</option>
                      <option value="Defensor">{t("profiles.centerBack")}</option>
                      <option value="Lateral">{t("profiles.fullback")}</option>
                      <option value="Mediocampista">{t("profiles.midfielder")}</option>
                      <option value="Volante">{t("profiles.attackingMid")}</option>
                      <option value="Extremo">{t("profiles.winger")}</option>
                      <option value="Delantero">{t("profiles.striker")}</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("miPerfil.contractStatus")}</Label>
                    <Select {...form.register("status")}>
                      <option value="Libre">{t("miPerfil.freeAgentOption")}</option>
                      <option value="Contratado">{t("miPerfil.underContract")}</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("miPerfil.phone")}</Label>
                    <Input {...form.register("phone")} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("miPerfil.videoLink")}</Label>
                    <Input {...form.register("videoUrl")} placeholder="https://youtube.com/..." />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="space-y-2">
                    <Label>{t("miPerfil.matches")}</Label>
                    <Input type="number" {...form.register("matches")} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("miPerfil.goals")}</Label>
                    <Input type="number" {...form.register("goals")} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("miPerfil.assists")}</Label>
                    <Input type="number" {...form.register("assists")} />
                  </div>
                </div>
              </>
            )}

            {/* AGENT FIELDS */}
            {user.role === "agent" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{t("miPerfil.nameOrAgency")}</Label>
                  <Input {...form.register("name")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("miPerfil.baseCountry")}</Label>
                  <Input {...form.register("country")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("miPerfil.fifaLicense")}</Label>
                  <Input {...form.register("license")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("miPerfil.phone")}</Label>
                  <Input {...form.register("phone")} />
                </div>
              </div>
            )}

            {/* CLUB FIELDS */}
            {user.role === "club" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{t("miPerfil.institutionName")}</Label>
                  <Input {...form.register("name")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("miPerfil.country")}</Label>
                  <Input {...form.register("country")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("miPerfil.categoryLeague")}</Label>
                  <Input {...form.register("category")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("miPerfil.contactPhone")}</Label>
                  <Input {...form.register("phone")} />
                </div>
              </div>
            )}

            {/* SHARED FIELDS */}
            <div className="space-y-4 border-t pt-6">
              <div className="space-y-2">
                <Label>{t("miPerfil.photoLogoLink")}</Label>
                <div className="flex gap-4 items-start">
                  <Input {...form.register("imageUrl")} placeholder="https://..." className="flex-grow" />
                  {form.watch("imageUrl") && (
                    <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border bg-slate-100">
                      <img 
                        src={form.watch("imageUrl")} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{user.role === "player" ? t("miPerfil.bioDescription") : t("miPerfil.description")}</Label>
                <Textarea 
                  {...form.register(user.role === "club" ? "description" : "bio")} 
                  className="min-h-[120px]"
                />
              </div>
            </div>

            <div className="pt-6">
              <Button type="submit" size="lg" className="w-full md:w-auto px-10" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t("miPerfil.saving")}</>
                ) : (
                  <><Save className="w-5 h-5 mr-2" /> {t("miPerfil.saveChanges")}</>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* CLUB: Opportunities management */}
        {isClub && (
          <Card className="p-6 md:p-8 shadow-sm mt-8">
            <div className="mb-6 border-b pb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{t("miPerfil.myOpportunities")}</h2>
                <p className="text-slate-500 mt-1">{t("miPerfil.myOpportunitiesSubtitle")}</p>
              </div>
              {!showNewOpportunity && (
                <Button onClick={() => setShowNewOpportunity(true)}>
                  <Plus className="w-4 h-4 mr-2" /> {t("miPerfil.publishNew")}
                </Button>
              )}
            </div>

            {showNewOpportunity && (
              <form
                onSubmit={oppForm.handleSubmit(handleCreateOpportunity)}
                className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("miPerfil.searchTitle")}</Label>
                    <Input {...oppForm.register("title")} placeholder={t("miPerfil.searchTitlePlaceholder")} />
                    {oppForm.formState.errors.title && (
                      <p className="text-red-500 text-xs">{oppForm.formState.errors.title.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>{t("miPerfil.positionSought")}</Label>
                    <Select {...oppForm.register("role")}>
                      <option value="">{t("miPerfil.selectPosition")}</option>
                      <option value="Arquero">{t("profiles.goalkeeper")}</option>
                      <option value="Defensor">{t("profiles.centerBack")}</option>
                      <option value="Lateral">{t("profiles.fullback")}</option>
                      <option value="Mediocampista">{t("profiles.midfielder")}</option>
                      <option value="Volante">{t("profiles.attackingMid")}</option>
                      <option value="Extremo">{t("profiles.winger")}</option>
                      <option value="Delantero">{t("profiles.striker")}</option>
                    </Select>
                    {oppForm.formState.errors.role && (
                      <p className="text-red-500 text-xs">{oppForm.formState.errors.role.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("miPerfil.description")}</Label>
                  <Textarea {...oppForm.register("description")} placeholder={t("miPerfil.oppDescriptionPlaceholder")} rows={3} />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="ghost" onClick={() => { setShowNewOpportunity(false); oppForm.reset(); }}>
                    <X className="w-4 h-4 mr-1.5" /> {t("miPerfil.cancel")}
                  </Button>
                  <Button type="submit" disabled={createOpportunity.isPending}>
                    {createOpportunity.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t("miPerfil.publish")}
                  </Button>
                </div>
              </form>
            )}

            {loadingMyOpps ? (
              <div className="space-y-3">
                {[1, 2].map(i => <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-xl" />)}
              </div>
            ) : myOpportunities.length > 0 ? (
              <div className="space-y-3">
                {myOpportunities.map((opp) => (
                  <div key={opp.id} className="flex items-center justify-between gap-4 p-4 border border-slate-200 rounded-xl">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{opp.title}</p>
                      <p className="text-sm text-slate-500">{opp.role}{opp.description ? ` · ${opp.description}` : ""}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 shrink-0"
                      onClick={() => handleDeleteOpportunity(opp.id)}
                      disabled={deleteOpportunity.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              !showNewOpportunity && (
                <p className="text-slate-500 text-center py-8">{t("miPerfil.noOpportunitiesPosted")}</p>
              )
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
