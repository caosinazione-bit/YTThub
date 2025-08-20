import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Type, Image as ImageIcon, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Thumbnail } from "@shared/schema";

interface CanvasEditorProps {
  thumbnail: Thumbnail | null;
  onThumbnailChange: (thumbnail: Thumbnail) => void;
}

export default function CanvasEditor({ thumbnail, onThumbnailChange }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(100);
  const [showEditHint, setShowEditHint] = useState(false);

  useEffect(() => {
    if (thumbnail && canvasRef.current) {
      drawThumbnail();
    }
  }, [thumbnail]);

  const drawThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas || !thumbnail) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to YouTube thumbnail dimensions
    canvas.width = 1280;
    canvas.height = 720;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background image if available
    if (thumbnail.imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawTextOverlays(ctx);
      };
      img.src = thumbnail.imageUrl;
    } else {
      drawTextOverlays(ctx);
    }
  };

  const drawTextOverlays = (ctx: CanvasRenderingContext2D) => {
    if (!thumbnail) return;

    // Draw main text
    if (thumbnail.mainText) {
      ctx.font = 'bold 80px Inter, Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const x = 640; // Center X
      const y = 300; // Upper center Y
      
      ctx.strokeText(thumbnail.mainText, x, y);
      ctx.fillText(thumbnail.mainText, x, y);
    }

    // Draw sub text
    if (thumbnail.subText) {
      ctx.font = 'bold 40px Inter, Arial, sans-serif';
      ctx.fillStyle = '#FF0000'; // YouTube red
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const x = 640; // Center X
      const y = 450; // Lower center Y
      
      // Draw background for sub text
      const textMetrics = ctx.measureText(thumbnail.subText);
      const textWidth = textMetrics.width;
      const textHeight = 50;
      
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(x - textWidth/2 - 20, y - textHeight/2, textWidth + 40, textHeight);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(thumbnail.subText, x, y);
    }
  };

  const handleRegenerate = () => {
    // This would trigger a new generation with the same parameters
    console.log('Regenerate thumbnail');
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Canvas Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">Anteprima Miniatura</h2>
          <Badge variant="secondary" className="bg-green-100 text-green-800">1280x720</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-500">{zoom}%</span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Canvas Area */}
      <div className="p-6">
        <div 
          className="relative bg-gray-900 rounded-lg aspect-video overflow-hidden group cursor-pointer"
          style={{ maxHeight: '450px' }}
          onMouseEnter={() => setShowEditHint(true)}
          onMouseLeave={() => setShowEditHint(false)}
        >
          {thumbnail?.imageUrl ? (
            <>
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
              />
              
              {/* Hover Overlay */}
              {showEditHint && (
                <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 rounded-lg p-4 text-center">
                    <Edit className="w-6 h-6 text-gray-700 mx-auto mb-2" />
                    <p className="text-sm text-gray-700 font-medium">Clicca per modificare</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Nessuna miniatura generata</p>
                <p className="text-sm text-gray-400 mt-1">Compila il form e clicca Genera</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Canvas Tools */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleRegenerate}
              disabled={!thumbnail}
              className="bg-creator-blue hover:bg-blue-600 text-white"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Rigenera
            </Button>
            <Button variant="outline" size="sm">
              <Type className="w-4 h-4 mr-2" />
              Aggiungi Testo
            </Button>
            <Button variant="outline" size="sm">
              <ImageIcon className="w-4 h-4 mr-2" />
              Aggiungi Immagine
            </Button>
          </div>
          {thumbnail?.createdAt && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Generata il {new Date(thumbnail.createdAt).toLocaleString('it-IT')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
