import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// Every inbound message the site relays by email is ALSO stored here, so
// the admin has a durable record independent of whether the email actually
// arrived (SMTP misconfigured, spam filter, etc.) — this is the "ticket
// inbox" the admin panel reads from.
export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'contact_form' | 'curated_offer_application' | 'player_contact' | 'opportunity_application'
  fromEmail: text("from_email").notNull(),
  fromName: text("from_name"), // only set for the general contact form, which asks for a name
  context: text("context"), // e.g. offer title / player name / opportunity title, for display
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  read: boolean("read").default(false).notNull(),
  repliedAt: timestamp("replied_at"),
  replyBody: text("reply_body"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messagesTable).omit({ id: true, createdAt: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messagesTable.$inferSelect;
