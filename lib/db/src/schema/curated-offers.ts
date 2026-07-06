import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const curatedOffersTable = pgTable("curated_offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // e.g. "Delantero para club de la Superliga Turca"
  league: text("league").notNull(), // e.g. "Süper Lig (Turquía)"
  position: text("position").notNull(), // posición buscada
  characteristics: text("characteristics"), // características del jugador buscado
  salaryApprox: text("salary_approx"), // sueldo aproximado, texto libre (ej. "€3.000-5.000/mes")
  transferValueApprox: text("transfer_value_approx"), // posible monto de transferencia, texto libre
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCuratedOfferSchema = createInsertSchema(curatedOffersTable).omit({ id: true, createdAt: true });
export type InsertCuratedOffer = z.infer<typeof insertCuratedOfferSchema>;
export type CuratedOffer = typeof curatedOffersTable.$inferSelect;
