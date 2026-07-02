// NOTA PARA EL EQUIPO DE LINKEDGOL: este es un texto plantilla genérico,
// no un documento legal verificado. Completar los campos entre [corchetes]
// y hacer revisar el contenido por un abogado antes de operar con usuarios
// reales — en particular, confirmar qué normativa de protección de datos
// aplica en cada país donde operen (ej. Ley 25.326 en Argentina, LGPD en
// Brasil, GDPR si tienen usuarios en la UE, etc.) y ajustar esta política
// en consecuencia.

import { Link } from "wouter";

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold text-primary hover:underline">← Volver al inicio</Link>

        <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mt-4 mb-2">Política de Privacidad</h1>
        <p className="text-slate-500 mb-10">Última actualización: [FECHA]</p>

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary">
          <p>
            En Linkedgol ("nosotros") nos tomamos en serio la privacidad de nuestros usuarios.
            Esta política explica qué datos recolectamos, cómo los usamos y qué derechos tenés
            sobre tu información.
          </p>

          <h2>1. Datos que recolectamos</h2>
          <ul>
            <li><strong>Datos de cuenta:</strong> email y contraseña (almacenada de forma encriptada, nunca en texto plano).</li>
            <li><strong>Datos de perfil:</strong> nombre, edad, nacionalidad, posición, teléfono, biografía, fotos, videos, y —según el rol— licencia de agente, país o categoría del club.</li>
            <li><strong>Datos de uso:</strong> información técnica básica como dirección IP y tipo de navegador, utilizada para seguridad y prevención de abuso (por ejemplo, límites de intentos de inicio de sesión).</li>
            <li><strong>Comunicaciones:</strong> mensajes enviados a través del sistema de contacto y postulación de la plataforma.</li>
          </ul>

          <h2>2. Cómo usamos tus datos</h2>
          <ul>
            <li>Para crear y mostrar tu perfil público dentro de la plataforma.</li>
            <li>Para permitir que otros usuarios (agentes, clubes, jugadores) se contacten con vos a través de nuestro sistema de relay de emails, sin exponer tu dirección de email directamente en la plataforma.</li>
            <li>Para verificar tu cuenta y enviarte notificaciones relacionadas con el Servicio (confirmación de email, recuperación de contraseña).</li>
            <li>Para prevenir fraude, spam y uso abusivo del sistema.</li>
          </ul>
          <p>No vendemos tus datos personales a terceros.</p>

          <h2>3. Qué información es pública</h2>
          <p>
            Tu nombre, posición, edad, nacionalidad, biografía, estadísticas, foto y video (si los
            cargaste) son visibles públicamente para cualquier visitante de la plataforma. Tu email
            y teléfono <strong>nunca se muestran públicamente</strong>: el contacto entre usuarios
            se realiza mediante un sistema de relay que oculta esas direcciones.
          </p>

          <h2>4. Con quién compartimos datos</h2>
          <p>
            Compartimos datos únicamente con proveedores necesarios para operar el Servicio (por
            ejemplo, el proveedor de hosting y el proveedor de envío de emails), bajo obligaciones
            de confidencialidad. No compartimos tus datos con terceros con fines publicitarios.
          </p>

          <h2>5. Cuánto tiempo conservamos tus datos</h2>
          <p>
            Conservamos tus datos mientras tu cuenta esté activa. Si eliminás tu cuenta o solicitás
            la baja de tus datos, los eliminaremos o anonimizaremos dentro de un plazo razonable,
            salvo que debamos conservar cierta información por obligaciones legales.
          </p>

          <h2>6. Tus derechos</h2>
          <p>Según la legislación aplicable en tu país, podés tener derecho a:</p>
          <ul>
            <li>Acceder a los datos que tenemos sobre vos.</li>
            <li>Corregir datos inexactos (podés hacerlo directamente desde "Mi Perfil").</li>
            <li>Solicitar la eliminación de tu cuenta y tus datos.</li>
            <li>Oponerte a determinados usos de tus datos.</li>
          </ul>
          <p>
            Para ejercer estos derechos, escribinos a{" "}
            <a href="mailto:[EMAIL DE CONTACTO / PRIVACIDAD]">[EMAIL DE CONTACTO / PRIVACIDAD]</a>.
          </p>

          <h2>7. Seguridad</h2>
          <p>
            Aplicamos medidas técnicas razonables para proteger tu información: contraseñas
            encriptadas, comunicación cifrada (HTTPS), y controles de acceso en nuestros sistemas
            internos. Ningún sistema es 100% infalible, y trabajamos de forma continua para
            mejorar nuestras prácticas de seguridad.
          </p>

          <h2>8. Menores de edad</h2>
          <p>
            Linkedgol puede incluir perfiles de jugadores menores de edad, cargados por sus padres,
            tutores o representantes legales autorizados. Si sos padre/madre o tutor y querés
            revisar, corregir o eliminar el perfil de un menor a tu cargo, contactanos.
          </p>

          <h2>9. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos
            cambios relevantes a través del Servicio o por email.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Ante cualquier consulta sobre esta política, escribinos a{" "}
            <a href="mailto:[EMAIL DE CONTACTO]">[EMAIL DE CONTACTO]</a> o visitá nuestra{" "}
            <Link href="/contacto">página de contacto</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
