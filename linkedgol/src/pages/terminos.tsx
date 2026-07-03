// NOTA PARA EL EQUIPO DE LINKEDGOL: este es un texto plantilla genérico,
// no un documento legal verificado. Completar los campos entre [corchetes]
// y hacer revisar el contenido por un abogado antes de operar con usuarios
// reales, especialmente en lo referido a protección de datos personales.

import { Link } from "wouter";
import { SEO } from "@/components/SEO";

export default function Terminos() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <SEO title="Términos y Condiciones" description="Términos y condiciones de uso de la plataforma Linkedgol." path="/terminos" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold text-primary hover:underline">← Volver al inicio</Link>

        <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mt-4 mb-2">Términos y Condiciones</h1>
        <p className="text-slate-500 mb-10">Última actualización: [FECHA]</p>

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary">
          <p>
            Estos Términos y Condiciones ("Términos") regulan el uso de la plataforma Linkedgol
            (el "Servicio"), operada por [RAZÓN SOCIAL / NOMBRE DE LA EMPRESA], con domicilio en
            [PAÍS / DIRECCIÓN] ("Linkedgol", "nosotros"). Al crear una cuenta o usar el Servicio,
            aceptás estos Términos en su totalidad.
          </p>

          <h2>1. Descripción del Servicio</h2>
          <p>
            Linkedgol es una plataforma que conecta jugadores de fútbol, agentes y clubes,
            permitiendo la creación de perfiles profesionales, la publicación de oportunidades
            deportivas y el contacto entre las partes. Linkedgol no es parte de ninguna
            negociación, contrato o acuerdo que surja entre usuarios de la plataforma.
          </p>

          <h2>2. Registro y cuentas</h2>
          <ul>
            <li>Debés proporcionar información veraz, actual y completa al registrarte.</li>
            <li>Sos responsable de mantener la confidencialidad de tu contraseña y de toda actividad realizada desde tu cuenta.</li>
            <li>Debés tener al menos [EDAD MÍNIMA] años para crear una cuenta. Si registrás a un jugador menor de edad, declarás contar con la autorización correspondiente de su tutor legal.</li>
            <li>Nos reservamos el derecho de suspender o eliminar cuentas que infrinjan estos Términos.</li>
          </ul>

          <h2>3. Contenido publicado por los usuarios</h2>
          <p>
            Sos el único responsable de la información, imágenes, videos y datos que publiques en
            tu perfil o en oportunidades. Al publicar contenido, nos otorgás una licencia no
            exclusiva para mostrarlo dentro de la plataforma con el fin de operar el Servicio.
            No publiques contenido falso, difamatorio, discriminatorio o que infrinja derechos de
            terceros.
          </p>

          <h2>4. Verificación de perfiles</h2>
          <p>
            El sello "Verificado por Linkedgol" indica que el equipo de Linkedgol revisó
            determinada información del perfil, pero no constituye una garantía absoluta de
            veracidad ni un respaldo profesional o contractual. Los usuarios deben ejercer su
            propio criterio antes de cerrar cualquier acuerdo.
          </p>

          <h2>5. Comunicación entre usuarios</h2>
          <p>
            Linkedgol facilita el contacto entre jugadores, agentes y clubes a través de mensajes
            relayados por email. No monitoreamos el contenido de estas comunicaciones de forma
            proactiva, pero podemos actuar ante denuncias de uso abusivo del sistema de contacto.
          </p>

          <h2>6. Uso prohibido</h2>
          <p>No está permitido usar el Servicio para:</p>
          <ul>
            <li>Publicar información falsa sobre tu identidad o trayectoria.</li>
            <li>Enviar spam, contenido malicioso o mensajes no solicitados en masa.</li>
            <li>Extraer datos de la plataforma de forma automatizada (scraping) sin autorización.</li>
            <li>Suplantar la identidad de otra persona o entidad.</li>
          </ul>

          <h2>7. Limitación de responsabilidad</h2>
          <p>
            El Servicio se ofrece "tal cual". En la medida permitida por la ley aplicable,
            Linkedgol no será responsable por acuerdos, contratos, transferencias o disputas que
            surjan entre usuarios, ni por decisiones tomadas en base a la información publicada en
            la plataforma.
          </p>

          <h2>8. Modificaciones</h2>
          <p>
            Podemos actualizar estos Términos periódicamente. Te notificaremos los cambios
            relevantes a través del Servicio o por email. El uso continuado de la plataforma
            después de una actualización implica la aceptación de los nuevos Términos.
          </p>

          <h2>9. Ley aplicable</h2>
          <p>
            Estos Términos se rigen por las leyes de [PAÍS / JURISDICCIÓN]. Cualquier disputa se
            someterá a los tribunales competentes de [JURISDICCIÓN].
          </p>

          <h2>10. Contacto</h2>
          <p>
            Para consultas sobre estos Términos, escribinos a{" "}
            <a href="mailto:[EMAIL DE CONTACTO]">[EMAIL DE CONTACTO]</a> o visitá nuestra{" "}
            <Link href="/contacto">página de contacto</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
