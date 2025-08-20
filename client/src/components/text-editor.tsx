import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Thumbnail } from "@shared/schema";

interface TextEditorProps {
  thumbnail: Thumbnail | null;
  onTextChange: (thumbnail: Thumbnail) => void;
}

const colorOptions = [
  { name: "White", value: "#FFFFFF", bg: "bg-white border-2 border-creator-blue" },
  { name: "Black", value: "#000000", bg: "bg-black" },
  { name: "YouTube Red", value: "#FF0000", bg: "bg-youtube-red" },
  { name: "Yellow", value: "#FBBF24", bg: "bg-yellow-400" },
  { name: "Green", value: "#10B981", bg: "bg-green-500" },
];

export default function TextEditor({ thumbnail, onTextChange }: TextEditorProps) {
  if (!thumbnail) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Opzioni Testo</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Genera prima una miniatura per modificare il testo</p>
          </div>
        </div>
      </div>
    );
  }

  const handleMainTextChange = (value: string) => {
    onTextChange({
      ...thumbnail,
      mainText: value,
    });
  };

  const handleSubTextChange = (value: string) => {
    onTextChange({
      ...thumbnail,
      subText: value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Text Options</h3>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <Label htmlFor="mainText" className="text-sm font-medium text-gray-700 mb-2">
            Main Text
          </Label>
          <Input
            id="mainText"
            type="text"
            placeholder="Enter main text..."
            value={thumbnail.mainText || ""}
            onChange={(e) => handleMainTextChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="subText" className="text-sm font-medium text-gray-700 mb-2">
            Sub Text
          </Label>
          <Input
            id="subText"
            type="text"
            placeholder="Enter sub text..."
            value={thumbnail.subText || ""}
            onChange={(e) => handleSubTextChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Font Size</Label>
            <Select defaultValue="medium">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="extra-large">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Position</Label>
            <Select defaultValue="center">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Text Color</Label>
          <div className="flex space-x-2">
            {colorOptions.map((color) => (
              <div
                key={color.value}
                className={`w-8 h-8 ${color.bg} border border-gray-300 rounded-full cursor-pointer hover:scale-110 transition-transform`}
                title={color.name}
                onClick={() => {
                  // Color change logic would be implemented here
                  console.log('Color selected:', color.value);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
