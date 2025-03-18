
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type FilterOptions = {
  isVegan: boolean;
  isGlutenFree: boolean;
  isPeanutFree: boolean;
  isSpicy: boolean;
}

interface MenuFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

export const MenuFilter = ({ onFilterChange, activeFilters }: MenuFilterProps) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(activeFilters);
  
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      // Reset filters if dialog is closed without applying
      setFilters(activeFilters);
    }
  };
  
  const handleCheckChange = (key: keyof FilterOptions) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const applyFilters = () => {
    onFilterChange(filters);
    setOpen(false);
  };
  
  const clearFilters = () => {
    const emptyFilters = {
      isVegan: false,
      isGlutenFree: false,
      isPeanutFree: false,
      isSpicy: false
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
    setOpen(false);
  };
  
  // Calculate if any filters are active
  const hasActiveFilters = Object.values(activeFilters).some(v => v);
  
  return (
    <div>
      <Button 
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-2 border border-bistro-wood/20 bg-background text-foreground hover:bg-muted"
        variant="outline"
      >
        <SlidersHorizontal className="h-4 w-4 stroke-[1.5px]" />
        <span className="ml-1">Filtrer</span>
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
            {Object.values(activeFilters).filter(Boolean).length}
          </span>
        )}
      </Button>
      
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-secondary">Filtrer les options spéciales</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {[
              { id: "isVegan", label: "Végétarien" },
              { id: "isGlutenFree", label: "Sans gluten" },
              { id: "isPeanutFree", label: "Sans arachides" },
              { id: "isSpicy", label: "Épicé" }
            ].map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={option.id}
                  checked={filters[option.id as keyof FilterOptions]}
                  onCheckedChange={() => handleCheckChange(option.id as keyof FilterOptions)}
                />
                <Label htmlFor={option.id} className="cursor-pointer text-foreground">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Réinitialiser
            </Button>
            <Button onClick={applyFilters} className="bg-primary text-primary-foreground">
              Appliquer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
