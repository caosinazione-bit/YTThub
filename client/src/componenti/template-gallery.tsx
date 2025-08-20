import { Play } from "lucide-react";

interface Template {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
}

interface TemplateGalleryProps {
  onTemplateSelect: (template: Template) => void;
}

const templates: Template[] = [
  {
    id: "gaming",
    name: "Gaming",
    category: "gaming",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=169"
  },
  {
    id: "education",
    name: "Education", 
    category: "education",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=169"
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    category: "lifestyle", 
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=169"
  },
  {
    id: "technology",
    name: "Tech",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=169"
  }
];

export default function TemplateGallery({ onTemplateSelect }: TemplateGalleryProps) {
  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Quick Templates</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <div 
              key={template.id}
              className="relative group cursor-pointer"
              onClick={() => onTemplateSelect(template)}
            >
              <img 
                src={template.imageUrl}
                alt={`${template.name} template`}
                className="w-full aspect-video rounded-lg object-cover" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                <Play className="text-white opacity-0 group-hover:opacity-100 w-6 h-6" />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-700">{template.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
