import { type Thumbnail, type InsertThumbnail } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createThumbnail(thumbnail: InsertThumbnail): Promise<Thumbnail>;
  getThumbnail(id: string): Promise<Thumbnail | undefined>;
  getRecentThumbnails(limit?: number): Promise<Thumbnail[]>;
}

export class MemStorage implements IStorage {
  private thumbnails: Map<string, Thumbnail>;

  constructor() {
    this.thumbnails = new Map();
  }

  async createThumbnail(insertThumbnail: InsertThumbnail): Promise<Thumbnail> {
    const id = randomUUID();
    const thumbnail: Thumbnail = { 
      ...insertThumbnail,
      style: insertThumbnail.style || "realistic",
      description: insertThumbnail.description || null,
      mainText: insertThumbnail.mainText || null,
      subText: insertThumbnail.subText || null,
      imageUrl: insertThumbnail.imageUrl || null,
      textSettings: insertThumbnail.textSettings || null,
      id,
      createdAt: new Date()
    };
    this.thumbnails.set(id, thumbnail);
    return thumbnail;
  }

  async getThumbnail(id: string): Promise<Thumbnail | undefined> {
    return this.thumbnails.get(id);
  }

  async getRecentThumbnails(limit: number = 10): Promise<Thumbnail[]> {
    return Array.from(this.thumbnails.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
