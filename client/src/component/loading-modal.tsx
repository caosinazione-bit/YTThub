import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface LoadingModalProps {
  isOpen: boolean;
}

export default function LoadingModal({ isOpen }: LoadingModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Generating Thumbnail</DialogTitle>
        <DialogDescription className="sr-only">Creating your ultra-realistic thumbnail with AI</DialogDescription>
        <div className="text-center py-6">
          <div className="animate-spin w-12 h-12 border-4 border-creator-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Generazione Miniatura</h3>
          <p className="text-gray-600 mb-4">Creazione della tua miniatura ultra-realistica con AI...</p>
          <Progress value={65} className="w-full mb-2" />
          <p className="text-sm text-gray-500">Potrebbero volerci 15-30 secondi</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
