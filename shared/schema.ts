import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const thumbnails = pgTable("thumbnails", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  style: text("style").notNull().default("realistic"),
  mainText: text("main_text"),
  subText: text("sub_text"),
  imageUrl: text("image_url"),
  textSettings: jsonb("text_settings"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertThumbnailSchema = createInsertSchema(thumbnails).omit({
  id: true,
  createdAt: true,
});

export const generateThumbnailSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(["gaming", "education", "entertainment", "technology", "lifestyle", "music", "crime", "documentary"]),
  style: z.enum(["realistic", "cartoon"]).default("realistic"),
  mainText: z.string().optional(),
  subText: z.string().optional(),
});

export type InsertThumbnail = z.infer<typeof insertThumbnailSchema>;
export type Thumbnail = typeof thumbnails.$inferSelect;
export type GenerateThumbnailRequest = z.infer<typeof generateThumbnailSchema>;
