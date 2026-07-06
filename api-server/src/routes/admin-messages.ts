import { Router, type IRouter } from "express";
import { db, messagesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "./admin";
import { sendAdminEmail } from "../lib/email";

const router: IRouter = Router();

// GET /admin/messages — every inbound message the site has relayed,
// newest first.
router.get("/admin/messages", requireAdmin, async (_req, res) => {
  try {
    const messages = await db.select().from(messagesTable).orderBy(desc(messagesTable.createdAt));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
});

// PATCH /admin/messages/:id/read — toggle read/unread.
router.patch("/admin/messages/:id/read", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { read } = req.body || {};
    const [message] = await db
      .update(messagesTable)
      .set({ read: Boolean(read) })
      .where(eq(messagesTable.id, id))
      .returning();
    if (!message) return res.status(404).json({ error: "Mensaje no encontrado" });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el mensaje" });
  }
});

// POST /admin/messages/:id/reply — sends a reply email to the original
// sender and records it against the message.
router.post("/admin/messages/:id/reply", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { body } = req.body || {};
    if (!body || typeof body !== "string" || !body.trim()) {
      return res.status(400).json({ error: "El mensaje de respuesta no puede estar vacío" });
    }

    const [original] = await db.select().from(messagesTable).where(eq(messagesTable.id, id));
    if (!original) return res.status(404).json({ error: "Mensaje no encontrado" });

    await sendAdminEmail({
      to: original.fromEmail,
      subject: `Re: ${original.subject}`,
      body,
    });

    const [updated] = await db
      .update(messagesTable)
      .set({ replyBody: body, repliedAt: new Date(), read: true })
      .where(eq(messagesTable.id, id))
      .returning();

    res.json(updated);
  } catch (err) {
    console.error("Reply to message error:", err);
    res.status(500).json({ error: "Error al enviar la respuesta" });
  }
});

// DELETE /admin/messages/:id
router.delete("/admin/messages/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(messagesTable).where(eq(messagesTable.id, id));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el mensaje" });
  }
});

// POST /admin/messages/send — compose and send a brand-new outbound email,
// not tied to any existing inbound message.
router.post("/admin/messages/send", requireAdmin, async (req, res) => {
  try {
    const { to, subject, body } = req.body || {};
    if (!to || !subject || !body) {
      return res.status(400).json({ error: "Faltan campos obligatorios: destinatario, asunto y mensaje" });
    }
    await sendAdminEmail({ to, subject, body });
    res.json({ sent: true });
  } catch (err) {
    console.error("Admin compose email error:", err);
    res.status(500).json({ error: "Error al enviar el email" });
  }
});

export default router;
