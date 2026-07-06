import nodemailer from "nodemailer";

// Reads standard SMTP env vars. If they aren't set, we fall back to logging
// the email to the console — handy for local development, but you MUST
// configure a real provider (SMTP relay, SendGrid, Resend, etc.) before
// shipping this to production, or nobody will actually get these emails.
//
// Required env vars for real delivery:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
// Optional:
//   APP_URL (used to build links back to the frontend, e.g. https://linkedgol.com)

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || "Linkedgol <no-reply@linkedgol.com>";
const APP_URL = process.env.APP_URL || "http://localhost:5173";

const isConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

async function sendEmail(to: string, subject: string, html: string, textFallback: string, replyTo?: string) {
  if (!transporter) {
    // Dev fallback: print the email so you can copy the link manually.
    console.log("\n========== EMAIL (SMTP not configured, dev fallback) ==========");
    console.log(`To: ${to}`);
    if (replyTo) console.log(`Reply-To: ${replyTo}`);
    console.log(`Subject: ${subject}`);
    console.log(textFallback);
    console.log("=================================================================\n");
    return;
  }

  await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    replyTo,
    subject,
    html,
    text: textFallback,
  });
}

export async function sendVerificationEmail(to: string, token: string) {
  const link = `${APP_URL}/verificar-email?token=${token}`;
  await sendEmail(
    to,
    "Confirmá tu cuenta de Linkedgol",
    `<p>¡Gracias por registrarte en Linkedgol!</p><p>Confirmá tu cuenta haciendo clic en el siguiente enlace (válido por 24 horas):</p><p><a href="${link}">${link}</a></p>`,
    `Confirmá tu cuenta de Linkedgol visitando: ${link} (válido por 24 horas)`,
  );
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const link = `${APP_URL}/restablecer-password?token=${token}`;
  await sendEmail(
    to,
    "Restablecé tu contraseña de Linkedgol",
    `<p>Recibimos una solicitud para restablecer tu contraseña.</p><p>Hacé clic en el siguiente enlace (válido por 1 hora). Si no fuiste vos, ignorá este email.</p><p><a href="${link}">${link}</a></p>`,
    `Restablecé tu contraseña visitando: ${link} (válido por 1 hora). Si no fuiste vos, ignorá este email.`,
  );
}

// Generic relay used for "Contactar" (agent/club -> player) and "Postular"
// (player -> club) flows. Neither party's email address is ever sent to the
// browser — the backend relays the message and sets Reply-To so they can
// keep the conversation going over normal email from there.
export async function sendContactRelayEmail(params: {
  to: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  message: string;
}) {
  const { to, fromName, fromEmail, subject, message } = params;
  const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  await sendEmail(
    to,
    subject,
    `<p><strong>${fromName}</strong> (${fromEmail}) te escribió a través de Linkedgol:</p><blockquote>${safeMessage.replace(/\n/g, "<br/>")}</blockquote><p>Podés responder directamente a este email para contactarlo.</p>`,
    `${fromName} (${fromEmail}) te escribió a través de Linkedgol:\n\n${message}\n\nPodés responder directamente a este email para contactarlo.`,
    fromEmail,
  );
}

// Public "Contact us" form on the site footer. Goes to a configurable inbox
// (falls back to EMAIL_FROM's address if CONTACT_EMAIL isn't set).
const CONTACT_INBOX = process.env.CONTACT_EMAIL || EMAIL_FROM;

export async function sendContactFormEmail(params: { name: string; email: string; message: string }) {
  const { name, email, message } = params;
  const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  await sendEmail(
    CONTACT_INBOX,
    `Nuevo mensaje de contacto de ${name}`,
    `<p><strong>${name}</strong> (${email}) envió un mensaje desde el formulario de contacto:</p><blockquote>${safeMessage.replace(/\n/g, "<br/>")}</blockquote>`,
    `${name} (${email}) envió un mensaje desde el formulario de contacto:\n\n${message}`,
    email,
  );
}

// Application to a Linkedgol-curated offer (not tied to any club account —
// these listings are posted by the Linkedgol team itself), relayed to the
// same inbox as the general contact form.
export async function sendCuratedOfferApplicationEmail(params: {
  offerTitle: string;
  applicantEmail: string;
  message: string;
}) {
  const { offerTitle, applicantEmail, message } = params;
  const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  await sendEmail(
    CONTACT_INBOX,
    `Nueva postulación a "${offerTitle}" (Ofertas Linkedgol)`,
    `<p><strong>${applicantEmail}</strong> se postuló a la oferta "<strong>${offerTitle}</strong>":</p><blockquote>${safeMessage.replace(/\n/g, "<br/>")}</blockquote>`,
    `${applicantEmail} se postuló a la oferta "${offerTitle}":\n\n${message}`,
    applicantEmail,
  );
}
