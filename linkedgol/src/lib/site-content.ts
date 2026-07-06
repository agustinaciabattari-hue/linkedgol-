export type ContentFieldType = "text" | "textarea" | "url" | "image" | "toggle" | "richtext" | "module_order";
export type ContentField = { key: string; label: string; type: ContentFieldType; default: string };
export type ContentSection = { title: string; fields: ContentField[] };
export type ContentPage = { id: string; name: string; route: string; sections: ContentSection[] };

const TERMINOS_DEFAULT = `Estos Términos y Condiciones ("Términos") regulan el uso de la plataforma Linkedgol (el "Servicio"), operada por [RAZÓN SOCIAL / NOMBRE DE LA EMPRESA], con domicilio en [PAÍS / DIRECCIÓN] ("Linkedgol", "nosotros"). Al crear una cuenta o usar el Servicio, aceptás estos Términos en su totalidad.

## 1. Descripción del Servicio
Linkedgol es una plataforma que conecta jugadores de fútbol, agentes y clubes, permitiendo la creación de perfiles profesionales, la publicación de oportunidades deportivas y el contacto entre las partes. Linkedgol no es parte de ninguna negociación, contrato o acuerdo que surja entre usuarios de la plataforma.

## 2. Registro y cuentas
- Debés proporcionar información veraz, actual y completa al registrarte.
- Sos responsable de mantener la confidencialidad de tu contraseña y de toda actividad realizada desde tu cuenta.
- Debés tener al menos [EDAD MÍNIMA] años para crear una cuenta. Si registrás a un jugador menor de edad, declarás contar con la autorización correspondiente de su tutor legal.
- Nos reservamos el derecho de suspender o eliminar cuentas que infrinjan estos Términos.

## 3. Contenido publicado por los usuarios
Sos el único responsable de la información, imágenes, videos y datos que publiques en tu perfil o en oportunidades. Al publicar contenido, nos otorgás una licencia no exclusiva para mostrarlo dentro de la plataforma con el fin de operar el Servicio. No publiques contenido falso, difamatorio, discriminatorio o que infrinja derechos de terceros.

## 4. Verificación de perfiles
El sello "Verificado por Linkedgol" indica que el equipo de Linkedgol revisó determinada información del perfil, pero no constituye una garantía absoluta de veracidad ni un respaldo profesional o contractual. Los usuarios deben ejercer su propio criterio antes de cerrar cualquier acuerdo.

## 5. Comunicación entre usuarios
Linkedgol facilita el contacto entre jugadores, agentes y clubes a través de mensajes relayados por email. No monitoreamos el contenido de estas comunicaciones de forma proactiva, pero podemos actuar ante denuncias de uso abusivo del sistema de contacto.

## 6. Uso prohibido
No está permitido usar el Servicio para:
- Publicar información falsa sobre tu identidad o trayectoria.
- Enviar spam, contenido malicioso o mensajes no solicitados en masa.
- Extraer datos de la plataforma de forma automatizada (scraping) sin autorización.
- Suplantar la identidad de otra persona o entidad.

## 7. Limitación de responsabilidad
El Servicio se ofrece "tal cual". En la medida permitida por la ley aplicable, Linkedgol no será responsable por acuerdos, contratos, transferencias o disputas que surjan entre usuarios, ni por decisiones tomadas en base a la información publicada en la plataforma.

## 8. Modificaciones
Podemos actualizar estos Términos periódicamente. Te notificaremos los cambios relevantes a través del Servicio o por email. El uso continuado de la plataforma después de una actualización implica la aceptación de los nuevos Términos.

## 9. Ley aplicable
Estos Términos se rigen por las leyes de [PAÍS / JURISDICCIÓN]. Cualquier disputa se someterá a los tribunales competentes de [JURISDICCIÓN].

## 10. Contacto
Para consultas sobre estos Términos, escribinos a [EMAIL DE CONTACTO] o visitá nuestra página de contacto (/contacto).`;

const PRIVACIDAD_DEFAULT = `En Linkedgol ("nosotros") nos tomamos en serio la privacidad de nuestros usuarios. Esta política explica qué datos recolectamos, cómo los usamos y qué derechos tenés sobre tu información.

## 1. Datos que recolectamos
- Datos de cuenta: email y contraseña (almacenada de forma encriptada, nunca en texto plano).
- Datos de perfil: nombre, edad, nacionalidad, posición, teléfono, biografía, fotos, videos, y —según el rol— licencia de agente, país o categoría del club.
- Datos de uso: información técnica básica como dirección IP y tipo de navegador, utilizada para seguridad y prevención de abuso.
- Comunicaciones: mensajes enviados a través del sistema de contacto y postulación de la plataforma.

## 2. Cómo usamos tus datos
- Para crear y mostrar tu perfil público dentro de la plataforma.
- Para permitir que otros usuarios se contacten con vos a través de nuestro sistema de relay de emails, sin exponer tu dirección de email directamente en la plataforma.
- Para verificar tu cuenta y enviarte notificaciones relacionadas con el Servicio.
- Para prevenir fraude, spam y uso abusivo del sistema.

No vendemos tus datos personales a terceros.

## 3. Qué información es pública
Tu nombre, posición, edad, nacionalidad, biografía, estadísticas, foto y video (si los cargaste) son visibles públicamente para cualquier visitante de la plataforma. Tu email y teléfono nunca se muestran públicamente: el contacto entre usuarios se realiza mediante un sistema de relay que oculta esas direcciones.

## 4. Con quién compartimos datos
Compartimos datos únicamente con proveedores necesarios para operar el Servicio (por ejemplo, el proveedor de hosting y el proveedor de envío de emails), bajo obligaciones de confidencialidad. No compartimos tus datos con terceros con fines publicitarios.

## 5. Cuánto tiempo conservamos tus datos
Conservamos tus datos mientras tu cuenta esté activa. Si eliminás tu cuenta o solicitás la baja de tus datos, los eliminaremos o anonimizaremos dentro de un plazo razonable, salvo que debamos conservar cierta información por obligaciones legales.

## 6. Tus derechos
Según la legislación aplicable en tu país, podés tener derecho a:
- Acceder a los datos que tenemos sobre vos.
- Corregir datos inexactos (podés hacerlo directamente desde "Mi Perfil").
- Solicitar la eliminación de tu cuenta y tus datos.
- Oponerte a determinados usos de tus datos.

Para ejercer estos derechos, escribinos a [EMAIL DE CONTACTO / PRIVACIDAD].

## 7. Seguridad
Aplicamos medidas técnicas razonables para proteger tu información: contraseñas encriptadas, comunicación cifrada (HTTPS), y controles de acceso en nuestros sistemas internos. Ningún sistema es 100% infalible, y trabajamos de forma continua para mejorar nuestras prácticas de seguridad.

## 8. Menores de edad
Linkedgol puede incluir perfiles de jugadores menores de edad, cargados por sus padres, tutores o representantes legales autorizados. Si sos padre/madre o tutor y querés revisar, corregir o eliminar el perfil de un menor a tu cargo, contactanos.

## 9. Cambios en esta política
Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos cambios relevantes a través del Servicio o por email.

## 10. Contacto
Ante cualquier consulta sobre esta política, escribinos a [EMAIL DE CONTACTO] o visitá nuestra página de contacto (/contacto).`;

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
      { title: "Módulos de la página (orden y visibilidad)", fields: [
        { key: "home_modules_config", label: "Secciones debajo del Hero", type: "module_order", default: JSON.stringify([
          { id: "featured_profiles", visible: true },
          { id: "oportunidades", visible: true },
          { id: "ofertas_linkedgol", visible: true },
          { id: "how_it_works", visible: true },
        ]) },
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
  {
    id: "perfiles", name: "Perfiles", route: "/perfiles",
    sections: [
      { title: "Encabezado", fields: [
        { key: "perfiles_hero_title", label: "Título", type: "text", default: "Explorar Perfiles" },
        { key: "perfiles_hero_subtitle", label: "Subtítulo", type: "textarea", default: "Encontrá el talento exacto que tu equipo necesita." },
      ]},
    ],
  },
  {
    id: "oportunidades", name: "Oportunidades", route: "/oportunidades",
    sections: [
      { title: "Encabezado", fields: [
        { key: "oportunidades_hero_badge", label: "Badge", type: "text", default: "Mercado de Pases" },
        { key: "oportunidades_hero_title", label: "Título", type: "text", default: "Oportunidades Activas" },
        { key: "oportunidades_hero_subtitle", label: "Subtítulo", type: "textarea", default: "Descubrí qué posiciones están buscando los clubes y postulá directamente si tu perfil coincide." },
      ]},
    ],
  },
  {
    id: "ofertas-linkedgol", name: "Ofertas Linkedgol", route: "/ofertas-linkedgol",
    sections: [
      { title: "Encabezado", fields: [
        { key: "ofertas_hero_badge", label: "Badge", type: "text", default: "Gestionadas por Linkedgol" },
        { key: "ofertas_hero_title", label: "Título", type: "text", default: "Ofertas Linkedgol" },
        { key: "ofertas_hero_subtitle", label: "Subtítulo", type: "textarea", default: "Oportunidades que conseguimos y gestionamos directamente con clubes de todo el mundo. No son publicaciones de terceros — las validamos nosotros." },
      ]},
    ],
  },
  {
    id: "contacto", name: "Contacto", route: "/contacto",
    sections: [
      { title: "Encabezado", fields: [
        { key: "contacto_hero_title", label: "Título", type: "text", default: "Contactanos" },
        { key: "contacto_hero_subtitle", label: "Subtítulo", type: "textarea", default: "¿Tenés una consulta, sugerencia o problema con tu cuenta? Escribinos." },
      ]},
    ],
  },
  {
    id: "terminos", name: "Términos y Condiciones", route: "/terminos",
    sections: [
      { title: "Contenido legal completo", fields: [
        { key: "terminos_content", label: "Texto completo (edita con cuidado — es contenido legal)", type: "richtext", default: TERMINOS_DEFAULT },
      ]},
    ],
  },
  {
    id: "privacidad", name: "Política de Privacidad", route: "/privacidad",
    sections: [
      { title: "Contenido legal completo", fields: [
        { key: "privacidad_content", label: "Texto completo (edita con cuidado — es contenido legal)", type: "richtext", default: PRIVACIDAD_DEFAULT },
      ]},
    ],
  },
];

export type ModuleConfigItem = { id: string; visible: boolean };

export const HOME_MODULE_LABELS: Record<string, string> = {
  featured_profiles: "Perfiles Destacados",
  oportunidades: "Oportunidades Activas",
  ofertas_linkedgol: "Ofertas Linkedgol",
  how_it_works: "Cómo Funciona",
};

export function getModuleOrder(
  items: { key: string; value: string }[] | undefined,
  key: string,
  fallback: ModuleConfigItem[]
): ModuleConfigItem[] {
  const found = items?.find(i => i.key === key);
  if (!found || !found.value) return fallback;
  try {
    const parsed = JSON.parse(found.value);
    if (Array.isArray(parsed)) return parsed;
    return fallback;
  } catch {
    return fallback;
  }
}

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
