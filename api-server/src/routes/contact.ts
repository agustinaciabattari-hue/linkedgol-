import { Router, type IRouter } from "express";
import { db, messagesTable } from "@workspace/db";
import { sendContactFormEmail } from "../lib/email";
import { forgotPasswordLimiter } from "../middlewares/rateLimit";

const router: IRouter = Router();

// POST /contact — public "Contact us" form. Rate-limited since it's
// unauthenticated and sends an email on every request.
router.post("/contact", forgotPasswordLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Faltan campos obligatorios: nombre, email y mensaje" });
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }

    // Store first — this is the durable record the admin inbox reads from,
    // independent of whether the email itself actually gets delivered.
    await db.insert(messagesTable).values({
      type: "contact_form",
      fromEmail: email,
      fromName: name,
      subject: `Mensaje de contacto de ${name}`,
      body: message,
    });

    await sendContactFormEmail({ name, email, message });
    res.json({ sent: true });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ error: "Error al enviar el mensaje" });
  }
});

export default router;
