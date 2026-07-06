// NOTA PARA EL EQUIPO DE LINKEDGOL: el texto por defecto de esta página es
// una plantilla genérica, no un documento legal verificado. Se puede editar
// completo desde el admin (Contenido del Sitio > Política de Privacidad),
// pero conviene confirmar qué normativa de protección de datos aplica en
// cada país donde operen y hacerlo revisar por un abogado.

import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { MarkdownLite } from "@/components/MarkdownLite";
import { useListSiteContent } from "@workspace/api-client-react";
import { getContentValue, CONTENT_PAGES } from "@/lib/site-content";

const DEFAULT_CONTENT = CONTENT_PAGES.find(p => p.id === "privacidad")!.sections[0].fields[0].default;

export default function Privacidad() {
  const { data: content } = useListSiteContent();
  const body = getContentValue(content, "privacidad_content", DEFAULT_CONTENT);

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <SEO title="Política de Privacidad" description="Política de privacidad y protección de datos de la plataforma Linkedgol." path="/privacidad" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold text-primary hover:underline">← Volver al inicio</Link>

        <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mt-4 mb-2">Política de Privacidad</h1>

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary whitespace-pre-line">
          <MarkdownLite content={body} />
        </div>
      </div>
    </div>
  );
}
