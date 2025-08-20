import { useState } from "react";
import { Play, Download, History, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CanvasEditor from "@/components/canvas-editor";
import ContentForm from "@/components/content-form";
import TemplateGallery from "@/components/template-gallery";
import TextEditor from "@/components/text-editor";
import LoadingModal from "@/components/loading-modal";
import { useQuery } from "@tanstack/react-query";
import type { Thumbnail } from "@shared/schema";

export default function ThumbnailGenerator() {
  const [currentThumbnail, setCurrentThumbnail] = useState<Thumbnail | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: recentThumbnails } = useQuery<Thumbnail[]>({
    queryKey: ["/api/thumbnails"],
    staleTime: 30000,
  });

  const handleDownload = () => {
    if (currentThumbnail?.imageUrl) {
      const link = document.createElement('a');
      link.href = currentThumbnail.imageUrl;
      link.download = `${currentThumbnail.title.replace(/\s+/g, '_')}_thumbnail.png`;
      link.click();
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-youtube-red rounded-lg flex items-center justify-center">
                  <Play className="text-white w-4 h-4" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">ThumbnailAI</h1>
              </div>
              <Badge className="hidden sm:inline-block bg-creator-blue text-white">Pro</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <History className="w-4 h-4 mr-2" />
                Cronologia
              </Button>
              <Button 
                onClick={handleDownload}
                disabled={!currentThumbnail?.imageUrl}
                className="bg-youtube-red hover:bg-red-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Scarica
              </Button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Canvas */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <CanvasEditor 
              thumbnail={currentThumbnail}
              onThumbnailChange={setCurrentThumbnail}
            />
            <TemplateGallery onTemplateSelect={(template) => {
              // Template selection logic would go here
              console.log('Template selected:', template);
            }} />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="space-y-6">
              
              <ContentForm 
                onGenerate={setCurrentThumbnail}
                onGeneratingChange={setIsGenerating}
              />
              
              <TextEditor 
                thumbnail={currentThumbnail}
                onTextChange={setCurrentThumbnail}
              />
              
              {/* Recent Thumbnails */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Recenti</h3>
                  <Button variant="ghost" size="sm" className="text-creator-blue hover:text-blue-600">
                    Vedi Tutte
                  </Button>
                </div>
                <div className="p-6">
                  {recentThumbnails && recentThumbnails.length > 0 ? (
                    <div className="space-y-3">
                      {recentThumbnails.slice(0, 3).map((thumbnail: Thumbnail) => (
                        <div 
                          key={thumbnail.id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() => setCurrentThumbnail(thumbnail)}
                        >
                          {thumbnail.imageUrl ? (
                            <img 
                              src={thumbnail.imageUrl}
                              alt={thumbnail.title}
                              className="w-16 h-9 rounded object-cover" 
                            />
                          ) : (
                            <div className="w-16 h-9 bg-gray-200 rounded flex items-center justify-center">
                              <Play className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {thumbnail.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {thumbnail.createdAt ? new Date(thumbnail.createdAt).toLocaleDateString('it-IT') : 'Data sconosciuta'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">Nessuna miniatura recente</p>
                      <p className="text-xs text-gray-400 mt-1">Genera la tua prima miniatura per iniziare</p>
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>

      <LoadingModal isOpen={isGenerating} />
    </>
  );
}
