import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateThumbnailSchema } from "@shared/schema";
import { generateThumbnailImage } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate thumbnail
  app.post("/api/thumbnails/generate", async (req, res) => {
    try {
      const validatedData = generateThumbnailSchema.parse(req.body);
      
      // Generate image using OpenAI
      const imageResult = await generateThumbnailImage({
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        style: validatedData.style,
      });

      // Save thumbnail to storage
      const thumbnail = await storage.createThumbnail({
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        style: validatedData.style,
        mainText: validatedData.mainText,
        subText: validatedData.subText,
        imageUrl: imageResult.url,
        textSettings: null,
      });

      res.json(thumbnail);
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate thumbnail" 
      });
    }
  });

  // Get thumbnail by ID
  app.get("/api/thumbnails/:id", async (req, res) => {
    try {
      const thumbnail = await storage.getThumbnail(req.params.id);
      if (!thumbnail) {
        return res.status(404).json({ message: "Thumbnail not found" });
      }
      res.json(thumbnail);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch thumbnail" });
    }
  });

  // Get recent thumbnails
  app.get("/api/thumbnails", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const thumbnails = await storage.getRecentThumbnails(limit);
      res.json(thumbnails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch thumbnails" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
