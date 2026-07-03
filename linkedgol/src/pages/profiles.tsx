import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, UserPlus, CheckCircle2 } from "lucide-react";
import { Button, Card, Badge, Input, Select, Label } from "@/components/ui/shared";
import { useListPlayers } from "@workspace/api-client-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Profiles() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    position: "",
    nationality: "",
    status: "",
  });

  // Fetch players from API using the filters
  const { data: players, isLoading } = useListPlayers({
    position: filters.position || undefined,
    nationality: filters.nationality || undefined,
    status: filters.status || undefined,
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-3">{t("profiles.title")}</h1>
            <p className="text-lg text-muted-foreground">{t("profiles.subtitle")}</p>
          </div>
          <Link href="/registro/jugador">
            <Button className="shrink-0"><UserPlus className="w-4 h-4 mr-2" /> {t("profiles.createProfile")}</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-6 text-foreground font-bold">
                <Filter className="w-5 h-5" />
                <h2>{t("profiles.filters")}</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>{t("profiles.position")}</Label>
                  {/* NOTE: option values stay in Spanish — they match what's
                      stored in the database (registration form position
                      values). Only the visible labels are translated. */}
                  <Select 
                    value={filters.position}
                    onChange={(e) => setFilters({...filters, position: e.target.value})}
                  >
                    <option value="">{t("profiles.allPositions")}</option>
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
                  <Label>{t("profiles.country")}</Label>
                  <Input 
                    placeholder={t("profiles.countryPlaceholder")}
                    value={filters.nationality}
                    onChange={(e) => setFilters({...filters, nationality: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("profiles.status")}</Label>
                  <Select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  >
                    <option value="">{t("profiles.anyStatus")}</option>
                    <option value="Libre">{t("profiles.free")}</option>
                    <option value="Contratado">{t("profiles.signed")}</option>
                  </Select>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setFilters({ position: "", nationality: "", status: "" })}
                >
                  {t("profiles.clearFilters")}
                </Button>
              </div>
            </Card>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : players && players.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {players.map((player, idx) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img 
                          src={player.imageUrl || "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=400&h=300&fit=crop"} 
                          alt={player.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant={player.status === "Libre" ? "success" : "default"} className="shadow-sm backdrop-blur-md bg-white/90">
                            {player.status === "Libre" ? t("profiles.free") : player.status === "Contratado" ? t("profiles.signed") : player.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-foreground truncate flex items-center">
                          {player.name}
                          {player.verified && (
                            <div title={t("profiles.verified")} className="flex items-center ml-2 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {t("profiles.verified")}
                            </div>
                          )}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1 mb-4 truncate">
                          <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
                          <span className="truncate">{player.nationality} • {player.age} {t("profiles.yearsOld")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">{player.position}</span>
                          <Link href={`/perfil/${player.id}`}>
                            <Button size="sm" variant="outline" className="text-xs h-8">{t("profiles.viewProfile")}</Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-border p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <Search className="w-16 h-16 text-slate-300 mb-6" />
                <h3 className="text-2xl font-bold text-foreground mb-2">{t("profiles.noProfilesYet")}</h3>
                <p className="text-muted-foreground max-w-md mb-8">
                  {filters.position || filters.nationality || filters.status 
                    ? t("profiles.noMatchFilters")
                    : t("profiles.emptyDbMessage")}
                </p>
                <Link href="/registro/jugador">
                  <Button size="lg" variant="orange">{t("profiles.registerFree")}</Button>
                </Link>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
