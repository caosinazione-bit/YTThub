import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { generateThumbnailSchema, type GenerateThumbnailRequest, type Thumbnail } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ContentFormProps {
  onGenerate: (thumbnail: Thumbnail) => void;
  onGeneratingChange: (isGenerating: boolean) => void;
}

export default function ContentForm({ onGenerate, onGeneratingChange }: ContentFormProps) {
  const [selectedStyle, setSelectedStyle] = useState<"realistic" | "cartoon">("realistic");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<GenerateThumbnailRequest>({
    resolver: zodResolver(generateThumbnailSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "gaming",
      style: "realistic",
      mainText: "",
      subText: "",
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateThumbnailRequest) => {
      const response = await apiRequest("POST", "/api/thumbnails/generate", data);
      return response.json();
    },
    onMutate: () => {
      onGeneratingChange(true);
    },
    onSuccess: (thumbnail: Thumbnail) => {
      onGenerate(thumbnail);
      queryClient.invalidateQueries({ queryKey: ["/api/thumbnails"] });
      toast({
        title: "Successo!",
        description: "Miniatura generata con successo!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nella generazione della miniatura",
        variant: "destructive",
      });
    },
    onSettled: () => {
      onGeneratingChange(false);
    },
  });

  const onSubmit = (data: GenerateThumbnailRequest) => {
    generateMutation.mutate(data);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Dettagli Contenuto</h3>
      </div>
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titolo del Video</FormLabel>
                  <FormControl>
                    <Input placeholder="Inserisci il titolo del video..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={4} 
                      placeholder="Descrivi dettagliatamente il contenuto: persone, oggetti, location, emozioni, colori, azioni specifiche che vuoi vedere nell'immagine. Più dettagli fornisci, più precisa sarà l'immagine generata."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona una categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="education">Educazione</SelectItem>
                      <SelectItem value="entertainment">Intrattenimento</SelectItem>
                      <SelectItem value="technology">Tecnologia</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="music">Musica</SelectItem>
                      <SelectItem value="crime">Crime/Suspense</SelectItem>
                      <SelectItem value="documentary">Documentario</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stile</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={field.value === "realistic" ? "default" : "outline"}
                        className={field.value === "realistic" ? "bg-creator-blue hover:bg-blue-600" : ""}
                        onClick={() => {
                          field.onChange("realistic");
                          setSelectedStyle("realistic");
                        }}
                      >
                        Realistico
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "cartoon" ? "default" : "outline"}
                        className={field.value === "cartoon" ? "bg-creator-blue hover:bg-blue-600" : ""}
                        onClick={() => {
                          field.onChange("cartoon");
                          setSelectedStyle("cartoon");
                        }}
                      >
                        Cartoon
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mainText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testo Principale (Opzionale)</FormLabel>
                  <FormControl>
                    <Input placeholder="Inserisci il testo principale..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sottotitolo (Opzionale)</FormLabel>
                  <FormControl>
                    <Input placeholder="Inserisci il sottotitolo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={generateMutation.isPending}
              className="w-full bg-youtube-red hover:bg-red-600 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {generateMutation.isPending ? "Generando..." : "Genera Miniatura"}
            </Button>
            
          </form>
        </Form>
      </div>
    </div>
  );
}
