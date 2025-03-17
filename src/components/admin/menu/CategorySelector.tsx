
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategorySelectorProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isMobile: boolean;
}

export const CategorySelector = ({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  isMobile 
}: CategorySelectorProps) => {
  if (isMobile) {
    return (
      <div className="mb-4">
        <Select 
          value={activeCategory} 
          onValueChange={onCategoryChange}
        >
          <SelectTrigger className="w-full bg-[#843c08]/80 text-white border-none">
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200">
            {categories.map(category => (
              <SelectItem 
                key={category} 
                value={category}
                className="cursor-pointer"
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <TabsList className="mb-4 w-full bg-transparent p-0 flex overflow-x-auto space-x-2 justify-start">
      {categories.map(category => (
        <TabsTrigger 
          key={category} 
          value={category} 
          className="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
            data-[state=active]:bg-bistro-olive data-[state=active]:text-white
            data-[state=inactive]:bg-[#843c08]/80 data-[state=inactive]:text-white
            hover:bg-bistro-olive/90 hover:text-white
            flex-shrink-0"
        >
          {category}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
