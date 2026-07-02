import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const playersTable = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  age: integer("age").notNull(),
  nationality: text("nationality").notNull(),
  status: text("status").notNull().default("Libre"),
  location: text("location"),
  email: text("email"),
  phone: text("phone"),
  bio: text("bio"),
  videoUrl: text("video_url"),
  imageUrl: text("image_url"),
  goals: integer("goals").default(0),
  assists: integer("assists").default(0),
  matches: integer("matches").default(0),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlayerSchema = createInsertSchema(playersTable).omit({ id: true, createdAt: true });
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof playersTable.$inferSelect;
