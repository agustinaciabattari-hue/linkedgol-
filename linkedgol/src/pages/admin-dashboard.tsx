import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Shield, LogOut, CheckCircle2, Trash2, Users, Building2, Briefcase, Edit, X, Plus, FileText, ExternalLink, Sparkles, Mail, Send, Inbox
} from "lucide-react";
import { Button, Input, Select, Textarea, Label, Card } from "@/components/ui/shared";
import { cn } from "@/lib/utils";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  useAdminListPlayers, useAdminListAgents, useAdminListClubs,
  useSetPlayerVerified, useDeletePlayer, useUpdatePlayer,
  useSetAgentVerified, useDeleteAgent, useUpdateAgent,
  useSetClubVerified, useDeleteClub, useUpdateClub,
  useAdminCreatePlayer, useAdminCreateAgent, useAdminCreateClub,
  useListSiteContent, useUpsertSiteContent,
  useAdminListCuratedOffers, useAdminCreateCuratedOffer, useAdminUpdateCuratedOffer, useAdminDeleteCuratedOffer,
  useAdminListMessages, useAdminMarkMessageRead, useAdminReplyToMessage, useAdminDeleteMessage, useAdminSendEmail,
  getAdminListPlayersQueryKey, getAdminListAgentsQueryKey, getAdminListClubsQueryKey, getListSiteContentQueryKey,
  getAdminListCuratedOffersQueryKey, getAdminListMessagesQueryKey,
  type AdminPlayer, type Agent, type Club, type CuratedOffer, type AdminMessage
} from "@workspace/api-client-react";
import { CONTENT_PAGES, getContentValue, HOME_MODULE_LABELS, type ModuleConfigItem } from "@/lib/site-content";

type TabType = "jugadores" | "agentes" | "clubes" | "ofertas" | "mensajes" | "contenido";
type EditingEntity = 
  | { type: "jugador"; data: AdminPlayer }
  | { type: "agente"; data: Agent }
  | { type: "club"; data: Club };

type CreatingType = "jugador" | "agente" | "club" | null;

// --- Schemas ---
const playerSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  position: z.string().min(1, "La posición es requerida"),
  age: z.coerce.number().min(1, "La edad es requerida"),
  nationality: z.string().min(1, "La nacionalidad es requerida"),
  otherCitizenships: z.string().optional().or(z.literal("")),
  status: z.string().min(1, "El estado es requerido"),
  location: z.string().optional().or(z.literal("")),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  videoUrl: z.string().optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")),
  goals: z.coerce.number().optional().default(0),
  assists: z.coerce.number().optional().default(0),
  matches: z.coerce.number().optional().default(0),
});

const agentSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  license: z.string().optional().or(z.literal("")),
  country: z.string().min(1, "El país es requerido"),
  email: z.string().email("Email inválido").min(1, "El email es requerido"),
  phone: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")),
});

const clubSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  country: z.string().min(1, "El país es requerido"),
  category: z.string().optional().or(z.literal("")),
  email: z.string().email("Email inválido").min(1, "El email es requerido"),
  phone: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")),
});

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("jugadores");
  const [activeContentPage, setActiveContentPage] = useState<string>("home");
  
  const [editingEntity, setEditingEntity] = useState<EditingEntity | null>(null);
  const [creatingType, setCreatingType] = useState<CreatingType>(null);
  
  const [contentValues, setContentValues] = useState<Record<string, string>>({});

  const token = localStorage.getItem("admin_token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    if (!token) {
      setLocation("/admin");
    }
  }, [token, setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setLocation("/admin");
  };

  const handleApiError = (err: any) => {
    if (err?.message?.includes("401") || err?.status === 401 || err?.response?.status === 401) {
      handleLogout();
    } else {
      toast({
        title: "Error",
        description: err?.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    }
  };

  // Queries
  const { data: players = [], isLoading: loadingPlayers } = useAdminListPlayers({ request: { headers: authHeaders } });
  const { data: agents = [], isLoading: loadingAgents } = useAdminListAgents({ request: { headers: authHeaders } });
  const { data: clubs = [], isLoading: loadingClubs } = useAdminListClubs({ request: { headers: authHeaders } });
  const { data: curatedOffers = [], isLoading: loadingCuratedOffers } = useAdminListCuratedOffers({ request: { headers: authHeaders } });
  const { data: messages = [], isLoading: loadingMessages } = useAdminListMessages({ request: { headers: authHeaders } });
  const { data: siteContent = [] } = useListSiteContent();

  // Mutations
  const setPlayerVerified = useSetPlayerVerified({ request: { headers: authHeaders } });
  const deletePlayer = useDeletePlayer({ request: { headers: authHeaders } });
  const updatePlayer = useUpdatePlayer({ request: { headers: authHeaders } });
  const createPlayer = useAdminCreatePlayer({ request: { headers: authHeaders } });
  
  const setAgentVerified = useSetAgentVerified({ request: { headers: authHeaders } });
  const deleteAgent = useDeleteAgent({ request: { headers: authHeaders } });
  const updateAgent = useUpdateAgent({ request: { headers: authHeaders } });
  const createAgent = useAdminCreateAgent({ request: { headers: authHeaders } });
  
  const setClubVerified = useSetClubVerified({ request: { headers: authHeaders } });
  const deleteClub = useDeleteClub({ request: { headers: authHeaders } });
  const updateClub = useUpdateClub({ request: { headers: authHeaders } });
  const createClub = useAdminCreateClub({ request: { headers: authHeaders } });

  const upsertSiteContent = useUpsertSiteContent({ request: { headers: authHeaders } });

  const createCuratedOffer = useAdminCreateCuratedOffer({ request: { headers: authHeaders } });
  const updateCuratedOffer = useAdminUpdateCuratedOffer({ request: { headers: authHeaders } });
  const deleteCuratedOffer = useAdminDeleteCuratedOffer({ request: { headers: authHeaders } });

  // --- Curated offers (Ofertas Linkedgol) form state ---
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<number | null>(null);
  const offerForm = useForm({
    defaultValues: {
      title: "", league: "", position: "", characteristics: "", salaryApprox: "", transferValueApprox: "",
    },
  });

  const openNewOfferForm = () => {
    setEditingOfferId(null);
    offerForm.reset({ title: "", league: "", position: "", characteristics: "", salaryApprox: "", transferValueApprox: "" });
    setShowOfferForm(true);
  };

  const openEditOfferForm = (offer: CuratedOffer) => {
    setEditingOfferId(offer.id);
    offerForm.reset({
      title: offer.title, league: offer.league, position: offer.position,
      characteristics: offer.characteristics || "", salaryApprox: offer.salaryApprox || "",
      transferValueApprox: offer.transferValueApprox || "",
    });
    setShowOfferForm(true);
  };

  const handleSaveOffer = (data: any) => {
    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: getAdminListCuratedOffersQueryKey() });
      setShowOfferForm(false);
      setEditingOfferId(null);
      toast({ title: editingOfferId ? "Oferta actualizada" : "Oferta publicada" });
    };
    const onError = () => toast({ title: "Error", description: "No se pudo guardar la oferta.", variant: "destructive" });

    if (editingOfferId) {
      updateCuratedOffer.mutate({ id: editingOfferId, data }, { onSuccess, onError });
    } else {
      createCuratedOffer.mutate({ data }, { onSuccess, onError });
    }
  };

  const handleToggleOfferActive = (offer: CuratedOffer) => {
    updateCuratedOffer.mutate(
      { id: offer.id, data: { active: !offer.active } },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getAdminListCuratedOffersQueryKey() }),
        onError: () => toast({ title: "Error", description: "No se pudo actualizar.", variant: "destructive" }),
      }
    );
  };

  const handleDeleteOffer = (id: number) => {
    deleteCuratedOffer.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListCuratedOffersQueryKey() });
          toast({ title: "Oferta eliminada" });
        },
        onError: () => toast({ title: "Error", description: "No se pudo eliminar.", variant: "destructive" }),
      }
    );
  };

  // --- Mensajes (bandeja del admin) ---
  const markMessageRead = useAdminMarkMessageRead({ request: { headers: authHeaders } });
  const replyToMessage = useAdminReplyToMessage({ request: { headers: authHeaders } });
  const deleteMessage = useAdminDeleteMessage({ request: { headers: authHeaders } });
  const sendAdminEmail = useAdminSendEmail({ request: { headers: authHeaders } });

  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeForm, setComposeForm] = useState({ to: "", subject: "", body: "" });

  const messageTypeLabels: Record<string, string> = {
    contact_form: "Formulario de Contacto",
    curated_offer_application: "Postulación · Oferta Linkedgol",
    player_contact: "Contacto a Jugador",
    opportunity_application: "Postulación · Oportunidad",
  };

  const selectedMessage = messages.find(m => m.id === selectedMessageId) || null;
  const unreadCount = messages.filter(m => !m.read).length;

  const openMessage = (msg: AdminMessage) => {
    setSelectedMessageId(msg.id);
    setReplyText("");
    if (!msg.read) {
      markMessageRead.mutate(
        { id: msg.id, data: { read: true } },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: getAdminListMessagesQueryKey() }) }
      );
    }
  };

  const handleSendReply = () => {
    if (!selectedMessageId || !replyText.trim()) return;
    replyToMessage.mutate(
      { id: selectedMessageId, data: { body: replyText } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListMessagesQueryKey() });
          setReplyText("");
          toast({ title: "Respuesta enviada" });
        },
        onError: () => toast({ title: "Error", description: "No se pudo enviar la respuesta.", variant: "destructive" }),
      }
    );
  };

  const handleDeleteMessage = (id: number) => {
    deleteMessage.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListMessagesQueryKey() });
          if (selectedMessageId === id) setSelectedMessageId(null);
          toast({ title: "Mensaje eliminado" });
        },
        onError: () => toast({ title: "Error", description: "No se pudo eliminar.", variant: "destructive" }),
      }
    );
  };

  const handleSendCompose = () => {
    if (!composeForm.to.trim() || !composeForm.subject.trim() || !composeForm.body.trim()) return;
    sendAdminEmail.mutate(
      { data: composeForm },
      {
        onSuccess: () => {
          setShowCompose(false);
          setComposeForm({ to: "", subject: "", body: "" });
          toast({ title: "Email enviado" });
        },
        onError: () => toast({ title: "Error", description: "No se pudo enviar el email.", variant: "destructive" }),
      }
    );
  };

  // Actions
  const togglePlayerVerify = async (id: number, currentStatus: boolean) => {
    setPlayerVerified.mutate(
      { id, data: { verified: !currentStatus } },
      { 
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getAdminListPlayersQueryKey() }),
        onError: handleApiError
      }
    );
  };

  const handleDeletePlayer = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este jugador?")) return;
    deletePlayer.mutate(
      { id },
      { 
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getAdminListPlayersQueryKey() }),
        onError: handleApiError
      }
    );
  };

  const toggleAgentVerify = async (id: number, currentStatus: boolean) => {
    setAgentVerified.mutate(
      { id, data: { verified: !currentStatus } },
      { 
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getAdminListAgentsQueryKey() }),
        onError: handleApiError
      }
    );
  };

  const handleDeleteAgent = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este agente?")) return;
    deleteAgent.mutate(
      { id },
      { 
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getAdminListAgentsQueryKey() }),
        onError: handleApiError
      }
    );
  };

  const toggleClubVerify = async (id: number, currentStatus: boolean) => {
    setClubVerified.mutate(
      { id, data: { verified: !currentStatus } },
      { 
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getAdminListClubsQueryKey() }),
        onError: handleApiError
      }
    );
  };

  const handleDeleteClub = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este club?")) return;
    deleteClub.mutate(
      { id },
      { 
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getAdminListClubsQueryKey() }),
        onError: handleApiError
      }
    );
  };

  // Forms
  const playerForm = useForm({ resolver: zodResolver(playerSchema) });
  const agentForm = useForm({ resolver: zodResolver(agentSchema) });
  const clubForm = useForm({ resolver: zodResolver(clubSchema) });

  // Edit/Create Modal Setup
  const openCreateModal = (type: CreatingType) => {
    setEditingEntity(null);
    setCreatingType(type);
    
    if (type === "jugador") {
      playerForm.reset({
        name: "", position: "Delantero", age: 18, nationality: "", otherCitizenships: "", status: "Libre", location: "",
        email: "", phone: "", bio: "", videoUrl: "", imageUrl: "", goals: 0, assists: 0, matches: 0,
      });
    } else if (type === "agente") {
      agentForm.reset({
        name: "", license: "", country: "", email: "", phone: "", bio: "", imageUrl: "",
      });
    } else if (type === "club") {
      clubForm.reset({
        name: "", country: "", category: "", email: "", phone: "", description: "", imageUrl: "",
      });
    }
  };

  useEffect(() => {
    if (editingEntity?.type === "jugador") {
      const p = editingEntity.data as AdminPlayer;
      playerForm.reset({
        name: p.name || "", position: p.position || "", age: p.age || 18, nationality: p.nationality || "",
        otherCitizenships: p.otherCitizenships || "",
        status: p.status || "Libre", location: p.location || "", email: p.email || "", phone: p.phone || "",
        bio: p.bio || "", videoUrl: p.videoUrl || "", imageUrl: p.imageUrl || "", goals: p.goals || 0,
        assists: p.assists || 0, matches: p.matches || 0,
      });
    } else if (editingEntity?.type === "agente") {
      const a = editingEntity.data as Agent;
      agentForm.reset({
        name: a.name || "", license: a.license || "", country: a.country || "", email: a.email || "",
        phone: a.phone || "", bio: a.bio || "", imageUrl: a.imageUrl || "",
      });
    } else if (editingEntity?.type === "club") {
      const c = editingEntity.data as Club;
      clubForm.reset({
        name: c.name || "", country: c.country || "", category: c.category || "", email: c.email || "",
        phone: c.phone || "", description: c.description || "", imageUrl: c.imageUrl || "",
      });
    }
  }, [editingEntity, playerForm, agentForm, clubForm]);

  const onFormSubmit = async (data: any) => {
    try {
      if (creatingType) {
        if (creatingType === "jugador") {
          await createPlayer.mutateAsync({ data });
          queryClient.invalidateQueries({ queryKey: getAdminListPlayersQueryKey() });
        } else if (creatingType === "agente") {
          await createAgent.mutateAsync({ data });
          queryClient.invalidateQueries({ queryKey: getAdminListAgentsQueryKey() });
        } else if (creatingType === "club") {
          await createClub.mutateAsync({ data });
          queryClient.invalidateQueries({ queryKey: getAdminListClubsQueryKey() });
        }
        toast({
          title: "Perfil creado",
          description: "El perfil ha sido creado y marcado como verificado correctamente.",
          variant: "default",
        });
        setCreatingType(null);
      } else if (editingEntity) {
        if (editingEntity.type === "jugador") {
          await updatePlayer.mutateAsync({ id: editingEntity.data.id, data });
          queryClient.invalidateQueries({ queryKey: getAdminListPlayersQueryKey() });
        } else if (editingEntity.type === "agente") {
          await updateAgent.mutateAsync({ id: editingEntity.data.id, data });
          queryClient.invalidateQueries({ queryKey: getAdminListAgentsQueryKey() });
        } else if (editingEntity.type === "club") {
          await updateClub.mutateAsync({ id: editingEntity.data.id, data });
          queryClient.invalidateQueries({ queryKey: getAdminListClubsQueryKey() });
        }
        toast({
          title: "Cambios guardados",
          description: "El perfil ha sido actualizado correctamente.",
          variant: "default",
        });
        setEditingEntity(null);
      }
    } catch (err: any) {
      handleApiError(err);
    }
  };

  const handleSaveContent = async () => {
    try {
      const promises = [];
      for (const page of CONTENT_PAGES) {
        for (const section of page.sections) {
          for (const field of section.fields) {
            const currentVal = contentValues[field.key];
            const originalVal = getContentValue(siteContent, field.key, field.default);
            if (currentVal !== undefined && currentVal !== originalVal) {
              promises.push(upsertSiteContent.mutateAsync({ data: { key: field.key, value: currentVal } }));
            }
          }
        }
      }
      if (promises.length > 0) {
        await Promise.all(promises);
        queryClient.invalidateQueries({ queryKey: getListSiteContentQueryKey() });
        toast({ title: "Contenido guardado", description: "Los cambios se aplicaron correctamente." });
      } else {
        toast({ title: "Sin cambios", description: "No hay modificaciones para guardar." });
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const activePageObj = CONTENT_PAGES.find(p => p.id === activeContentPage);

  if (!token) return null;

  return (
    <div className="flex flex-col h-screen bg-slate-50 relative">
      <SEO title="Panel de Administración" description="Panel de administración de Linkedgol." path="/admin/dashboard" noindex />
      {/* Top Navbar */}
      <header className="bg-primary text-white py-4 px-6 shadow-md flex justify-between items-center shrink-0 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display leading-tight">Linkedgol Admin</h1>
            <p className="text-xs text-blue-200 font-medium tracking-wide">Panel de Administración</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="text-white border-white/20 hover:bg-white/10 hover:text-white" 
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
        </Button>
      </header>

      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            {/* Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveTab("jugadores")}
                className={cn(
                  "flex items-center px-6 py-2.5 text-sm font-semibold rounded-lg capitalize transition-colors whitespace-nowrap", 
                  activeTab === "jugadores" ? "bg-primary text-white shadow" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Users className="w-4 h-4 mr-2" /> Jugadores ({players.length})
              </button>
              <button
                onClick={() => setActiveTab("agentes")}
                className={cn(
                  "flex items-center px-6 py-2.5 text-sm font-semibold rounded-lg capitalize transition-colors whitespace-nowrap", 
                  activeTab === "agentes" ? "bg-primary text-white shadow" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Briefcase className="w-4 h-4 mr-2" /> Agentes ({agents.length})
              </button>
              <button
                onClick={() => setActiveTab("clubes")}
                className={cn(
                  "flex items-center px-6 py-2.5 text-sm font-semibold rounded-lg capitalize transition-colors whitespace-nowrap", 
                  activeTab === "clubes" ? "bg-primary text-white shadow" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Building2 className="w-4 h-4 mr-2" /> Clubes ({clubs.length})
              </button>
              <button
                onClick={() => setActiveTab("ofertas")}
                className={cn(
                  "flex items-center px-6 py-2.5 text-sm font-semibold rounded-lg capitalize transition-colors whitespace-nowrap", 
                  activeTab === "ofertas" ? "bg-primary text-white shadow" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Sparkles className="w-4 h-4 mr-2" /> Ofertas Linkedgol ({curatedOffers.length})
              </button>
              <button
                onClick={() => setActiveTab("mensajes")}
                className={cn(
                  "flex items-center px-6 py-2.5 text-sm font-semibold rounded-lg capitalize transition-colors whitespace-nowrap relative", 
                  activeTab === "mensajes" ? "bg-primary text-white shadow" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Inbox className="w-4 h-4 mr-2" /> Mensajes ({messages.length})
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("contenido")}
                className={cn(
                  "flex items-center px-6 py-2.5 text-sm font-semibold rounded-lg capitalize transition-colors whitespace-nowrap", 
                  activeTab === "contenido" ? "bg-primary text-white shadow" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <FileText className="w-4 h-4 mr-2" /> Contenido del sitio
              </button>
            </div>

            {/* Create Action */}
            {activeTab === "jugadores" && (
              <Button onClick={() => openCreateModal("jugador")}><Plus className="w-4 h-4 mr-2"/> Crear nuevo</Button>
            )}
            {activeTab === "agentes" && (
              <Button onClick={() => openCreateModal("agente")}><Plus className="w-4 h-4 mr-2"/> Crear nuevo</Button>
            )}
            {activeTab === "clubes" && (
              <Button onClick={() => openCreateModal("club")}><Plus className="w-4 h-4 mr-2"/> Crear nuevo</Button>
            )}
            {activeTab === "ofertas" && !showOfferForm && (
              <Button onClick={openNewOfferForm}><Plus className="w-4 h-4 mr-2"/> Publicar oferta</Button>
            )}
            {activeTab === "mensajes" && !showCompose && (
              <Button onClick={() => setShowCompose(true)}><Send className="w-4 h-4 mr-2"/> Redactar nuevo</Button>
            )}
          </div>

          {/* Ofertas Linkedgol Section */}
          {activeTab === "ofertas" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              {showOfferForm && (
                <form
                  onSubmit={offerForm.handleSubmit(handleSaveOffer)}
                  className="mb-6 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4"
                >
                  <h3 className="font-bold text-slate-900">{editingOfferId ? "Editar oferta" : "Nueva oferta Linkedgol"}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Título *</Label>
                      <Input {...offerForm.register("title", { required: true })} placeholder="Ej. Delantero para club de la Süper Lig" />
                    </div>
                    <div className="space-y-2">
                      <Label>Liga *</Label>
                      <Input {...offerForm.register("league", { required: true })} placeholder="Ej. Süper Lig (Turquía)" />
                    </div>
                    <div className="space-y-2">
                      <Label>Posición buscada *</Label>
                      <Input {...offerForm.register("position", { required: true })} placeholder="Ej. Delantero centro" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Características del jugador buscado</Label>
                      <Textarea {...offerForm.register("characteristics")} placeholder="Ej. Zurdo, buen juego aéreo, entre 22-28 años..." rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Sueldo aproximado</Label>
                      <Input {...offerForm.register("salaryApprox")} placeholder="Ej. €3.000–5.000/mes" />
                    </div>
                    <div className="space-y-2">
                      <Label>Posible monto de transferencia</Label>
                      <Input {...offerForm.register("transferValueApprox")} placeholder="Ej. €150.000 aprox." />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="ghost" onClick={() => { setShowOfferForm(false); setEditingOfferId(null); }}>
                      <X className="w-4 h-4 mr-1.5" /> Cancelar
                    </Button>
                    <Button type="submit" disabled={createCuratedOffer.isPending || updateCuratedOffer.isPending}>
                      {(createCuratedOffer.isPending || updateCuratedOffer.isPending) ? "Guardando..." : editingOfferId ? "Guardar cambios" : "Publicar"}
                    </Button>
                  </div>
                </form>
              )}

              {loadingCuratedOffers ? (
                <div className="space-y-3">
                  {[1, 2].map(i => <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-xl" />)}
                </div>
              ) : curatedOffers.length > 0 ? (
                <div className="space-y-3">
                  {curatedOffers.map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between gap-4 p-4 border border-slate-200 rounded-xl">
                      <div className="min-w-0 flex items-center gap-3">
                        <span className={cn("w-2 h-2 rounded-full shrink-0", offer.active ? "bg-green-500" : "bg-slate-300")} />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{offer.title}</p>
                          <p className="text-sm text-slate-500 truncate">{offer.league} · {offer.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button size="sm" variant="outline" onClick={() => handleToggleOfferActive(offer)}>
                          {offer.active ? "Ocultar" : "Mostrar"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEditOfferForm(offer)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeleteOffer(offer.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !showOfferForm && <p className="text-slate-500 text-center py-8">Todavía no publicaste ninguna oferta Linkedgol.</p>
              )}
            </div>
          )}

          {/* Mensajes Section */}
          {activeTab === "mensajes" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              {showCompose && (
                <div className="mb-6 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                  <h3 className="font-bold text-slate-900">Redactar nuevo email</h3>
                  <div className="space-y-2">
                    <Label>Para *</Label>
                    <Input
                      value={composeForm.to}
                      onChange={(e) => setComposeForm(prev => ({ ...prev, to: e.target.value }))}
                      placeholder="destinatario@email.com"
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Asunto *</Label>
                    <Input
                      value={composeForm.subject}
                      onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mensaje *</Label>
                    <Textarea
                      value={composeForm.body}
                      onChange={(e) => setComposeForm(prev => ({ ...prev, body: e.target.value }))}
                      rows={5}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="ghost" onClick={() => { setShowCompose(false); setComposeForm({ to: "", subject: "", body: "" }); }}>
                      <X className="w-4 h-4 mr-1.5" /> Cancelar
                    </Button>
                    <Button onClick={handleSendCompose} disabled={sendAdminEmail.isPending}>
                      {sendAdminEmail.isPending ? "Enviando..." : <><Send className="w-4 h-4 mr-1.5" /> Enviar</>}
                    </Button>
                  </div>
                </div>
              )}

              {loadingMessages ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-xl" />)}
                </div>
              ) : messages.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* List */}
                  <div className="lg:col-span-2 space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {messages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => openMessage(msg)}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border transition-colors",
                          selectedMessageId === msg.id ? "border-primary bg-primary/5" : "border-slate-200 hover:bg-slate-50",
                          !msg.read && "bg-blue-50/40"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={cn("text-xs font-bold uppercase tracking-wide", !msg.read ? "text-blue-700" : "text-slate-400")}>
                            {messageTypeLabels[msg.type] || msg.type}
                          </span>
                          {!msg.read && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                        </div>
                        <p className="font-semibold text-slate-900 truncate text-sm">{msg.fromName ? `${msg.fromName} · ` : ""}{msg.fromEmail}</p>
                        {msg.context && <p className="text-xs text-slate-500 truncate">{msg.context}</p>}
                        <p className="text-xs text-slate-400 truncate mt-1">{msg.body}</p>
                        {msg.repliedAt && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 mt-2">
                            <CheckCircle2 className="w-3 h-3" /> Respondido
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Detail */}
                  <div className="lg:col-span-3 border border-slate-200 rounded-xl p-5">
                    {selectedMessage ? (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4 border-b pb-4">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                              {messageTypeLabels[selectedMessage.type] || selectedMessage.type}
                            </span>
                            <h3 className="font-bold text-lg text-slate-900">{selectedMessage.subject}</h3>
                            <p className="text-sm text-slate-500">
                              De: <strong>{selectedMessage.fromName ? `${selectedMessage.fromName} · ` : ""}{selectedMessage.fromEmail}</strong>
                            </p>
                            {selectedMessage.context && <p className="text-sm text-slate-500">Contexto: {selectedMessage.context}</p>}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 shrink-0"
                            onClick={() => handleDeleteMessage(selectedMessage.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">{selectedMessage.body}</p>

                        {selectedMessage.replyBody && (
                          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                            <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1">Tu respuesta</p>
                            <p className="text-sm text-slate-700 whitespace-pre-line">{selectedMessage.replyBody}</p>
                          </div>
                        )}

                        <div className="space-y-2 pt-2 border-t">
                          <Label>Responder a {selectedMessage.fromEmail}</Label>
                          <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Escribí tu respuesta..."
                            rows={4}
                          />
                          <div className="flex justify-end">
                            <Button onClick={handleSendReply} disabled={replyToMessage.isPending || !replyText.trim()}>
                              {replyToMessage.isPending ? "Enviando..." : <><Send className="w-4 h-4 mr-1.5" /> Enviar respuesta</>}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center py-16 text-slate-400">
                        <Mail className="w-10 h-10 mb-3" />
                        <p>Elegí un mensaje de la lista para verlo</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                !showCompose && <p className="text-slate-500 text-center py-8">Todavía no recibiste ningún mensaje.</p>
              )}
            </div>
          )}

          {/* Tables Section */}
          {activeTab !== "contenido" && activeTab !== "ofertas" && activeTab !== "mensajes" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-xs tracking-wider border-b border-slate-200">
                    {activeTab === "jugadores" && (
                      <tr>
                        <th className="px-6 py-4">Foto</th>
                        <th className="px-6 py-4">Nombre</th>
                        <th className="px-6 py-4">Posición</th>
                        <th className="px-6 py-4">Edad</th>
                        <th className="px-6 py-4">País</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4">Verificado</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    )}
                    {activeTab === "agentes" && (
                      <tr>
                        <th className="px-6 py-4">Foto</th>
                        <th className="px-6 py-4">Nombre</th>
                        <th className="px-6 py-4">País</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Verificado</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    )}
                    {activeTab === "clubes" && (
                      <tr>
                        <th className="px-6 py-4">Logo</th>
                        <th className="px-6 py-4">Nombre</th>
                        <th className="px-6 py-4">País</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Verificado</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    
                    {activeTab === "jugadores" && !loadingPlayers && players.length === 0 && (
                      <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-500">No hay jugadores registrados.</td></tr>
                    )}
                    {activeTab === "jugadores" && players.map(player => (
                      <tr key={player.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <img src={player.imageUrl || "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=100&h=100&fit=crop"} alt={player.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">{player.name}</td>
                        <td className="px-6 py-4"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-semibold">{player.position}</span></td>
                        <td className="px-6 py-4 text-slate-600">{player.age}</td>
                        <td className="px-6 py-4 text-slate-600">{player.nationality}</td>
                        <td className="px-6 py-4">
                          <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", player.status === "Libre" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700")}>
                            {player.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {player.verified ? (
                            <span className="inline-flex items-center text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Sí
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-bold">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button 
                            size="sm" 
                            variant={player.verified ? "outline" : "blue"}
                            className={cn("h-8 text-xs", player.verified && "text-slate-600")}
                            onClick={() => togglePlayerVerify(player.id, player.verified || false)}
                            disabled={setPlayerVerified.isPending}
                          >
                            {player.verified ? "Quitar verificación" : "Verificar"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                            onClick={() => { setCreatingType(null); setEditingEntity({ type: "jugador", data: player }); }}
                          >
                            <Edit className="w-4 h-4 mr-1.5" /> Editar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDeletePlayer(player.id)}
                            disabled={deletePlayer.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === "agentes" && !loadingAgents && agents.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No hay agentes registrados.</td></tr>
                    )}
                    {activeTab === "agentes" && agents.map(agent => (
                      <tr key={agent.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                            {agent.name.charAt(0)}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">{agent.name}</td>
                        <td className="px-6 py-4 text-slate-600">{agent.country}</td>
                        <td className="px-6 py-4 text-slate-600">{agent.email}</td>
                        <td className="px-6 py-4">
                          {agent.verified ? (
                            <span className="inline-flex items-center text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Sí
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-bold">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button 
                            size="sm" 
                            variant={agent.verified ? "outline" : "blue"}
                            className={cn("h-8 text-xs", agent.verified && "text-slate-600")}
                            onClick={() => toggleAgentVerify(agent.id, agent.verified || false)}
                            disabled={setAgentVerified.isPending}
                          >
                            {agent.verified ? "Quitar verificación" : "Verificar"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                            onClick={() => { setCreatingType(null); setEditingEntity({ type: "agente", data: agent }); }}
                          >
                            <Edit className="w-4 h-4 mr-1.5" /> Editar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDeleteAgent(agent.id)}
                            disabled={deleteAgent.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {activeTab === "clubes" && !loadingClubs && clubs.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No hay clubes registrados.</td></tr>
                    )}
                    {activeTab === "clubes" && clubs.map(club => (
                      <tr key={club.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
                            {club.name.charAt(0)}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">{club.name}</td>
                        <td className="px-6 py-4 text-slate-600">{club.country}</td>
                        <td className="px-6 py-4 text-slate-600">{club.email}</td>
                        <td className="px-6 py-4">
                          {club.verified ? (
                            <span className="inline-flex items-center text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Sí
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-bold">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button 
                            size="sm" 
                            variant={club.verified ? "outline" : "blue"}
                            className={cn("h-8 text-xs", club.verified && "text-slate-600")}
                            onClick={() => toggleClubVerify(club.id, club.verified || false)}
                            disabled={setClubVerified.isPending}
                          >
                            {club.verified ? "Quitar verificación" : "Verificar"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                            onClick={() => { setCreatingType(null); setEditingEntity({ type: "club", data: club }); }}
                          >
                            <Edit className="w-4 h-4 mr-1.5" /> Editar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDeleteClub(club.id)}
                            disabled={deleteClub.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Content Editor Section */}
          {activeTab === "contenido" && (
            <div className="space-y-6">
              {/* Content Sub-tabs */}
              <div className="flex flex-wrap gap-2">
                {CONTENT_PAGES.map(page => (
                  <button
                    key={page.id}
                    onClick={() => setActiveContentPage(page.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                      activeContentPage === page.id 
                        ? "bg-slate-800 text-white" 
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    {page.name}
                  </button>
                ))}
              </div>

              {/* Editor Area */}
              {activePageObj && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold font-display">{activePageObj.name}</h2>
                    <a 
                      href={activePageObj.route} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mr-1.5" /> Ver página
                    </a>
                  </div>

                  {activePageObj.sections.map(section => (
                    <Card key={section.title} className="p-6">
                      <h3 className="text-lg font-bold mb-6 text-slate-800 pb-2 border-b">{section.title}</h3>
                      <div className="space-y-5">
                        {section.fields.map(field => {
                          const currentVal = contentValues[field.key] ?? getContentValue(siteContent, field.key, field.default);
                          return (
                            <div key={field.key} className="space-y-1.5">
                              <Label className="text-slate-600">{field.label}</Label>
                              
                              {field.type === "text" || field.type === "url" ? (
                                <Input 
                                  value={currentVal} 
                                  onChange={(e) => setContentValues(prev => ({...prev, [field.key]: e.target.value}))}
                                  className="max-w-2xl"
                                />
                              ) : field.type === "textarea" ? (
                                <Textarea 
                                  value={currentVal} 
                                  onChange={(e) => setContentValues(prev => ({...prev, [field.key]: e.target.value}))}
                                  className="max-w-2xl h-24"
                                />
                              ) : field.type === "toggle" ? (
                                <label className="flex items-center gap-3 cursor-pointer w-fit">
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={currentVal === "true"}
                                    onClick={() => setContentValues(prev => ({...prev, [field.key]: currentVal === "true" ? "false" : "true"}))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${currentVal === "true" ? "bg-primary" : "bg-slate-300"}`}
                                  >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currentVal === "true" ? "translate-x-6" : "translate-x-1"}`} />
                                  </button>
                                  <span className="text-sm text-slate-600">{currentVal === "true" ? "Visible en el sitio" : "Oculto en el sitio"}</span>
                                </label>
                              ) : field.type === "richtext" ? (
                                <Textarea 
                                  value={currentVal} 
                                  onChange={(e) => setContentValues(prev => ({...prev, [field.key]: e.target.value}))}
                                  className="max-w-3xl h-96 font-mono text-sm"
                                />
                              ) : field.type === "module_order" ? (
                                (() => {
                                  let moduleList: ModuleConfigItem[] = [];
                                  try {
                                    moduleList = JSON.parse(currentVal);
                                    if (!Array.isArray(moduleList)) moduleList = [];
                                  } catch {
                                    moduleList = [];
                                  }

                                  const updateModules = (next: ModuleConfigItem[]) => {
                                    setContentValues(prev => ({ ...prev, [field.key]: JSON.stringify(next) }));
                                  };

                                  const moveModule = (index: number, direction: -1 | 1) => {
                                    const next = [...moduleList];
                                    const targetIndex = index + direction;
                                    if (targetIndex < 0 || targetIndex >= next.length) return;
                                    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
                                    updateModules(next);
                                  };

                                  const toggleModule = (index: number) => {
                                    const next = [...moduleList];
                                    next[index] = { ...next[index], visible: !next[index].visible };
                                    updateModules(next);
                                  };

                                  return (
                                    <div className="max-w-xl space-y-2">
                                      {moduleList.map((mod, index) => (
                                        <div
                                          key={mod.id}
                                          className={cn(
                                            "flex items-center justify-between gap-3 p-3 rounded-xl border",
                                            mod.visible ? "bg-white border-slate-200" : "bg-slate-50 border-slate-200 opacity-60"
                                          )}
                                        >
                                          <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono text-slate-400 w-5">{index + 1}</span>
                                            <span className="font-medium text-slate-800 text-sm">
                                              {HOME_MODULE_LABELS[mod.id] || mod.id}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                            <button
                                              type="button"
                                              onClick={() => moveModule(index, -1)}
                                              disabled={index === 0}
                                              className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                              title="Subir"
                                            >
                                              ↑
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => moveModule(index, 1)}
                                              disabled={index === moduleList.length - 1}
                                              className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                              title="Bajar"
                                            >
                                              ↓
                                            </button>
                                            <button
                                              type="button"
                                              role="switch"
                                              aria-checked={mod.visible}
                                              onClick={() => toggleModule(index)}
                                              className={cn(
                                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ml-2",
                                                mod.visible ? "bg-primary" : "bg-slate-300"
                                              )}
                                            >
                                              <span className={cn(
                                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                                mod.visible ? "translate-x-6" : "translate-x-1"
                                              )} />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                      <p className="text-xs text-slate-400 pt-1">
                                        Usá las flechas para reordenar y el interruptor para mostrar/ocultar cada sección en la Home.
                                      </p>
                                    </div>
                                  );
                                })()
                              ) : field.type === "image" ? (
                                <div className="flex items-start gap-4">
                                  <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                    {currentVal ? (
                                      <img 
                                        src={currentVal} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover" 
                                        onError={(e) => e.currentTarget.style.display = 'none'} 
                                      />
                                    ) : (
                                      <span className="text-xs text-slate-400">Vacio</span>
                                    )}
                                  </div>
                                  <Input 
                                    value={currentVal} 
                                    onChange={(e) => setContentValues(prev => ({...prev, [field.key]: e.target.value}))}
                                    className="max-w-xl"
                                    placeholder="https://..."
                                  />
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  ))}

                  <div className="sticky bottom-6 flex justify-end mt-8">
                    <Button 
                      size="lg" 
                      onClick={handleSaveContent}
                      disabled={upsertSiteContent.isPending}
                      className="shadow-xl shadow-primary/20"
                    >
                      {upsertSiteContent.isPending ? "Guardando..." : "Guardar todos los cambios"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit / Create Modal */}
      {(editingEntity || creatingType) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold font-display text-slate-800">
                {creatingType 
                  ? `Crear nuevo ${creatingType}` 
                  : `Editar ${editingEntity?.type}: `}
                {!creatingType && <span className="text-primary">{editingEntity?.data.name}</span>}
              </h2>
              <button 
                onClick={() => { setEditingEntity(null); setCreatingType(null); }}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* JUGADOR FORM */}
              {(editingEntity?.type === "jugador" || creatingType === "jugador") && (
                <form id="edit-form" onSubmit={playerForm.handleSubmit(onFormSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label>Nombre completo <span className="text-red-500">*</span></Label>
                      <Input {...playerForm.register("name")} placeholder="Ej. Lionel Messi" />
                      {playerForm.formState.errors.name && <p className="text-xs text-red-500">{playerForm.formState.errors.name.message as string}</p>}
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label>Posición <span className="text-red-500">*</span></Label>
                      <Select {...playerForm.register("position")}>
                        <option value="">Seleccionar posición...</option>
                        <option value="Delantero">Delantero</option>
                        <option value="Mediocampista">Mediocampista</option>
                        <option value="Defensor">Defensor</option>
                        <option value="Portero">Portero</option>
                        <option value="Arquero">Arquero</option>
                      </Select>
                      {playerForm.formState.errors.position && <p className="text-xs text-red-500">{playerForm.formState.errors.position.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label>Edad <span className="text-red-500">*</span></Label>
                      <Input type="number" {...playerForm.register("age")} placeholder="Ej. 25" />
                      {playerForm.formState.errors.age && <p className="text-xs text-red-500">{playerForm.formState.errors.age.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label>Nacionalidad <span className="text-red-500">*</span></Label>
                      <Input {...playerForm.register("nationality")} placeholder="Ej. Argentino" />
                      {playerForm.formState.errors.nationality && <p className="text-xs text-red-500">{playerForm.formState.errors.nationality.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label>Otras ciudadanías</Label>
                      <Input {...playerForm.register("otherCitizenships")} placeholder="Ej. Italia, España" />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Estado <span className="text-red-500">*</span></Label>
                      <Select {...playerForm.register("status")}>
                        <option value="Libre">Libre</option>
                        <option value="Contratado">Contratado</option>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Ubicación (Ciudad, País)</Label>
                      <Input {...playerForm.register("location")} placeholder="Ej. Buenos Aires, Argentina" />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Email de contacto</Label>
                      <Input type="email" {...playerForm.register("email")} placeholder="ejemplo@correo.com" />
                      {playerForm.formState.errors.email && <p className="text-xs text-red-500">{playerForm.formState.errors.email.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label>Teléfono / WhatsApp</Label>
                      <Input {...playerForm.register("phone")} placeholder="+54 9 11..." />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Biografía / Trayectoria</Label>
                    <Textarea {...playerForm.register("bio")} placeholder="Contanos tu experiencia..." className="h-24" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label>Link de foto de perfil (URL)</Label>
                      <Input {...playerForm.register("imageUrl")} placeholder="https://..." />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Link de video (YouTube/Vimeo)</Label>
                      <Input {...playerForm.register("videoUrl")} placeholder="https://..." />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <Label>Goles</Label>
                      <Input type="number" {...playerForm.register("goals")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Asistencias</Label>
                      <Input type="number" {...playerForm.register("assists")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Partidos</Label>
                      <Input type="number" {...playerForm.register("matches")} />
                    </div>
                  </div>
                </form>
              )}

              {/* AGENTE FORM */}
              {(editingEntity?.type === "agente" || creatingType === "agente") && (
                <form id="edit-form" onSubmit={agentForm.handleSubmit(onFormSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label>Nombre / Agencia <span className="text-red-500">*</span></Label>
                      <Input {...agentForm.register("name")} placeholder="Nombre completo" />
                      {agentForm.formState.errors.name && <p className="text-xs text-red-500">{agentForm.formState.errors.name.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label>País de operación <span className="text-red-500">*</span></Label>
                      <Input {...agentForm.register("country")} placeholder="Ej. Argentina" />
                      {agentForm.formState.errors.country && <p className="text-xs text-red-500">{agentForm.formState.errors.country.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label>Licencia FIFA / Habilitación</Label>
                      <Input {...agentForm.register("license")} placeholder="Opcional" />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Email <span className="text-red-500">*</span></Label>
                      <Input type="email" {...agentForm.register("email")} placeholder="correo@agencia.com" />
                      {agentForm.formState.errors.email && <p className="text-xs text-red-500">{agentForm.formState.errors.email.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label>Teléfono / WhatsApp</Label>
                      <Input {...agentForm.register("phone")} placeholder="+54 9 11..." />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Link de foto/logo (URL)</Label>
                      <Input {...agentForm.register("imageUrl")} placeholder="https://..." />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Biografía / Sobre la agencia</Label>
                    <Textarea {...agentForm.register("bio")} placeholder="Describí los servicios..." className="h-24" />
                  </div>
                </form>
              )}

              {/* CLUB FORM */}
              {(editingEntity?.type === "club" || creatingType === "club") && (
                <form id="edit-form" onSubmit={clubForm.handleSubmit(onFormSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label>Nombre del Club <span className="text-red-500">*</span></Label>
                      <Input {...clubForm.register("name")} placeholder="Ej. Club Atlético..." />
                      {clubForm.formState.errors.name && <p className="text-xs text-red-500">{clubForm.formState.errors.name.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label>País <span className="text-red-500">*</span></Label>
                      <Input {...clubForm.register("country")} placeholder="Ej. Uruguay" />
                      {clubForm.formState.errors.country && <p className="text-xs text-red-500">{clubForm.formState.errors.country.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label>Categoría / División</Label>
                      <Input {...clubForm.register("category")} placeholder="Ej. Primera División" />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Email <span className="text-red-500">*</span></Label>
                      <Input type="email" {...clubForm.register("email")} placeholder="contacto@club.com" />
                      {clubForm.formState.errors.email && <p className="text-xs text-red-500">{clubForm.formState.errors.email.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label>Teléfono</Label>
                      <Input {...clubForm.register("phone")} placeholder="+54 9..." />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Link de logo (URL)</Label>
                      <Input {...clubForm.register("imageUrl")} placeholder="https://..." />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Descripción / Historia</Label>
                    <Textarea {...clubForm.register("description")} placeholder="Sobre el proyecto deportivo..." className="h-24" />
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 z-10 border-t border-slate-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <Button 
                variant="outline" 
                onClick={() => { setEditingEntity(null); setCreatingType(null); }}
                disabled={updatePlayer.isPending || updateAgent.isPending || updateClub.isPending || createPlayer.isPending || createAgent.isPending || createClub.isPending}
              >
                Cancelar
              </Button>
              <Button 
                form="edit-form" 
                type="submit" 
                disabled={updatePlayer.isPending || updateAgent.isPending || updateClub.isPending || createPlayer.isPending || createAgent.isPending || createClub.isPending}
              >
                {updatePlayer.isPending || updateAgent.isPending || updateClub.isPending || createPlayer.isPending || createAgent.isPending || createClub.isPending ? "Guardando..." : creatingType ? "Crear perfil" : "Guardar cambios"}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
