// NOTA PARA EL EQUIPO DE LINKEDGOL: el texto por defecto de esta página es
// una plantilla genérica, no un documento legal verificado. Se puede editar
// completo desde el admin (Contenido del Sitio > Términos y Condiciones),
// pero conviene hacer revisar el contenido final por un abogado antes de
// operar con usuarios reales.

import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { MarkdownLite } from "@/components/MarkdownLite";
import { useListSiteContent } from "@workspace/api-client-react";
import { getContentValue, CONTENT_PAGES } from "@/lib/site-content";

const DEFAULT_CONTENT = CONTENT_PAGES.find(p => p.id === "terminos")!.sections[0].fields[0].default;

export default function Terminos() {
  const { data: content } = useListSiteContent();
  const body = getContentValue(content, "terminos_content", DEFAULT_CONTENT);

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <SEO title="Términos y Condiciones" description="Términos y condiciones de uso de la plataforma Linkedgol." path="/terminos" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold text-primary hover:underline">← Volver al inicio</Link>

        <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mt-4 mb-2">Términos y Condiciones</h1>

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary whitespace-pre-line">
          <MarkdownLite content={body} />
        </div>
      </div>
    </div>
  );
}
