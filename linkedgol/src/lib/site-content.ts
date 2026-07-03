export type ContentFieldType = "text" | "textarea" | "url" | "image" | "toggle";
export type ContentField = { key: string; label: string; type: ContentFieldType; default: string };
export type ContentSection = { title: string; fields: ContentField[] };
export type ContentPage = { id: string; name: string; route: string; sections: ContentSection[] };

export const CONTENT_PAGES: ContentPage[] = [
  {
    id: "home", name: "Inicio", route: "/",
    sections: [
      { title: "Hero principal", fields: [
        { key: "home_hero_badge", label: "Badge superior", type: "text", default: "La mayor red de fútbol profesional" },
        { key: "home_hero_title", label: "Título principal", type: "textarea", default: "Conectando el talento con oportunidades en el fútbol" },
        { key: "home_hero_subtitle", label: "Subtítulo", type: "textarea", default: "Linkedgol es la plataforma definitiva donde jugadores, agentes y clubes descubren, negocian y construyen el futuro del deporte." },
        { key: "home_hero_image", label: "Imagen de fondo (URL)", type: "image", default: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&h=1080&fit=crop" },
      ]},
      { title: "Estadísticas", fields: [
        { key: "home_stats_show", label: "Mostrar contadores de estadísticas", type: "toggle", default: "true" },
      ]},
      { title: "Cómo funciona", fields: [
        { key: "home_how_title", label: "Título de la sección", type: "text", default: "¿Cómo funciona Linkedgol?" },
        { key: "home_step1_title", label: "Paso 1 - Título", type: "text", default: "1. Crea tu Perfil" },
        { key: "home_step1_desc", label: "Paso 1 - Descripción", type: "textarea", default: "Regístrate como jugador, agente o club. Sube tus datos, videos y trayectoria para destacar en la red." },
        { key: "home_step2_title", label: "Paso 2 - Título", type: "text", default: "2. Explora el Mercado" },
        { key: "home_step2_desc", label: "Paso 2 - Descripción", type: "textarea", default: "Busca talento específico utilizando filtros avanzados o encuentra oportunidades de clubes de todo el mundo." },
        { key: "home_step3_title", label: "Paso 3 - Título", type: "text", default: "3. Conecta y Cierra" },
        { key: "home_step3_desc", label: "Paso 3 - Descripción", type: "textarea", default: "Inicia conversaciones directas, negocia términos y avanza profesionalmente en tu carrera deportiva." },
      ]},
    ],
  },
  {
    id: "jugador", name: "Landing Jugador", route: "/jugador",
    sections: [
      { title: "Hero", fields: [
        { key: "jugador_hero_badge", label: "Badge", type: "text", default: "👤 Para Jugadores" },
        { key: "jugador_hero_title", label: "Título", type: "textarea", default: "Tu próximo club te está buscando" },
        { key: "jugador_hero_subtitle", label: "Subtítulo", type: "textarea", default: "Creá tu perfil profesional en Linkedgol y conectate con clubes y agentes de toda Latinoamérica. Gratis, simple y efectivo." },
        { key: "jugador_hero_image", label: "Imagen de fondo (URL)", type: "image", default: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80" },
        { key: "jugador_cta_text", label: "Texto del botón principal", type: "text", default: "Crear mi perfil gratis" },
        { key: "jugador_cta_link", label: "Link del botón principal", type: "url", default: "/registro/jugador" },
      ]},
      { title: "CTA Final", fields: [
        { key: "jugador_final_title", label: "Título", type: "text", default: "Empezá hoy. Es gratis." },
        { key: "jugador_final_subtitle", label: "Subtítulo", type: "textarea", default: "Registrate, completá tu perfil y empezá a aparecer en los resultados de búsqueda de clubes." },
      ]},
    ],
  },
  {
    id: "agente", name: "Landing Agente", route: "/agente",
    sections: [
      { title: "Hero", fields: [
        { key: "agente_hero_badge", label: "Badge", type: "text", default: "💼 Para Agentes" },
        { key: "agente_hero_title", label: "Título", type: "textarea", default: "Gestioná tu cartera de jugadores en una sola plataforma" },
        { key: "agente_hero_subtitle", label: "Subtítulo", type: "textarea", default: "Linkedgol te da las herramientas para representar, conectar y cerrar acuerdos con clubes de toda Latinoamérica." },
        { key: "agente_hero_image", label: "Imagen de fondo (URL)", type: "image", default: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80" },
        { key: "agente_cta_text", label: "Texto del botón principal", type: "text", default: "Registrate como agente" },
        { key: "agente_cta_link", label: "Link del botón principal", type: "url", default: "/registro/agente" },
      ]},
      { title: "CTA Final", fields: [
        { key: "agente_final_title", label: "Título", type: "text", default: "Sumate a la red de agentes FIFA." },
        { key: "agente_final_subtitle", label: "Subtítulo", type: "textarea", default: "Conectá con clubes verificados y representá jugadores con la confianza que solo Linkedgol te da." },
      ]},
    ],
  },
  {
    id: "club", name: "Landing Club", route: "/club",
    sections: [
      { title: "Hero", fields: [
        { key: "club_hero_badge", label: "Badge", type: "text", default: "🏆 Para Clubes" },
        { key: "club_hero_title", label: "Título", type: "textarea", default: "Encontrá el jugador que tu club necesita" },
        { key: "club_hero_subtitle", label: "Subtítulo", type: "textarea", default: "Publicá oportunidades, buscá talento por posición y país, y conectate directo con jugadores y agentes." },
        { key: "club_hero_image", label: "Imagen de fondo (URL)", type: "image", default: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1600&q=80" },
        { key: "club_cta_text", label: "Texto del botón principal", type: "text", default: "Registrar mi club" },
        { key: "club_cta_link", label: "Link del botón principal", type: "url", default: "/registro/club" },
      ]},
      { title: "CTA Final", fields: [
        { key: "club_final_title", label: "Título", type: "text", default: "Reforzá tu plantel hoy." },
        { key: "club_final_subtitle", label: "Subtítulo", type: "textarea", default: "Registrá tu club, publicá oportunidades y descubrí jugadores libres en toda Latinoamérica." },
      ]},
    ],
  },
];

export function getContentValue(items: { key: string; value: string }[] | undefined, key: string, fallback: string): string {
  const found = items?.find(i => i.key === key);
  if (!found || !found.value) return fallback;
  return found.value;
}

export function getContentBoolean(items: { key: string; value: string }[] | undefined, key: string, fallback: boolean): boolean {
  const found = items?.find(i => i.key === key);
  if (!found || found.value === "") return fallback;
  return found.value === "true";
}
