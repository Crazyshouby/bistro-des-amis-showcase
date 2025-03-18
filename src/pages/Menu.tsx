
import { useState, useEffect } from "react";
import { useIntersectionObserver } from "@/lib/hooks";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { MenuItem } from "@/types";
import { MenuItemCard } from "@/components/admin/menu/MenuItemCard";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Leaf, Flame, NutOff, WheatOff } from "lucide-react";
import { MenuFilter, FilterOptions } from "@/components/menu/MenuFilter";

// Définition de l'ordre fixe des catégories
const CATEGORY_ORDER = ["Apéritifs", "Entrées", "Plats", "Desserts", "Boissons"];

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    isVegan: false,
    isGlutenFree: false,
    isPeanutFree: false,
    isSpicy: false
  });
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-100px 0px",
  });

  // Fetch menu items from Supabase
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('categorie');
        
        if (error) throw error;
        
        setMenuItems(data as MenuItem[]);
        
        // Extract unique categories from the data
        const uniqueCategoriesSet = new Set(data.map((item: MenuItem) => item.categorie));
        
        // Filter the ordered categories to only include ones that exist in our data
        const orderedCategories = CATEGORY_ORDER.filter(category => 
          uniqueCategoriesSet.has(category)
        );
        
        setCategories(orderedCategories);
        
        // Set first category as active by default
        if (orderedCategories.length > 0 && !activeCategory) {
          setActiveCategory(orderedCategories[0]);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le menu. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);

  const filterItems = (items: MenuItem[]) => {
    // First filter by category if one is selected
    let filtered = activeCategory
      ? items.filter((item) => item.categorie === activeCategory)
      : items;
    
    // Then apply dietary filters if any are active
    const hasActiveFilters = Object.values(filters).some(Boolean);
    
    if (hasActiveFilters) {
      filtered = filtered.filter(item => {
        if (filters.isVegan && !item.is_vegan) return false;
        if (filters.isGlutenFree && !item.is_gluten_free) return false;
        if (filters.isPeanutFree && !item.is_peanut_free) return false;
        if (filters.isSpicy && !item.is_spicy) return false;
        return true;
      });
    }
    
    return filtered;
  };

  const filteredItems = filterItems(menuItems);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <div className="bg-texture">
      {/* Banner */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: "url('/lovable-uploads/19408610-7939-4299-999c-208a2355a264.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white">Notre Menu</h1>
        </div>
      </div>
      
      {/* Menu Section */}
      <section className="py-16 md:py-24">
        <div className="content-container">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-secondary mb-4">
                Saveurs Authentiques
              </h2>
              <p className="text-foreground/80 max-w-2xl mx-auto">
                Une sélection de plats et boissons préparés avec passion, mettant en valeur les produits locaux et les traditions culinaires.
              </p>
            </div>
          </AnimatedSection>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <p className="text-foreground">Chargement du menu...</p>
            </div>
          ) : (
            <>
              {/* Filters and Category Selector */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                  {/* Category Filter Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          activeCategory === category
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  
                  {/* Filter Button */}
                  <MenuFilter 
                    onFilterChange={handleFilterChange}
                    activeFilters={filters}
                  />
                </div>
                
                {/* Active filters summary */}
                {Object.values(filters).some(Boolean) && (
                  <div className="mb-4 flex flex-wrap gap-2 text-sm">
                    <span className="text-muted-foreground">Filtres actifs:</span>
                    {filters.isVegan && (
                      <span className="bg-muted px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Leaf size={12} className="text-green-600" />
                        Végétarien
                      </span>
                    )}
                    {filters.isGlutenFree && (
                      <span className="bg-muted px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <WheatOff size={12} className="text-yellow-600" />
                        Sans Gluten
                      </span>
                    )}
                    {filters.isPeanutFree && (
                      <span className="bg-muted px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <NutOff size={12} className="text-amber-600" />
                        Sans Arachides
                      </span>
                    )}
                    {filters.isSpicy && (
                      <span className="bg-muted px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Flame size={12} className="text-red-600" />
                        Épicé
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Menu Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={ref}>
                {filteredItems.length === 0 ? (
                  <p className="text-center text-muted-foreground col-span-2 py-8">
                    Aucun élément trouvé correspondant aux critères de filtrage.
                  </p>
                ) : (
                  filteredItems.map((item) => (
                    <AnimatedSection key={item.id} delay={0.1} className="h-full">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
                        <div className="relative">
                          <MenuItemCard 
                            item={item}
                            onEdit={() => handleItemClick(item)} 
                          />
                        </div>
                      </div>
                    </AnimatedSection>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Menu Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-playfair font-bold text-secondary">
                  {selectedItem.nom}
                </DialogTitle>
              </DialogHeader>
              
              <div className="mt-4">
                {/* Image */}
                {selectedItem.image_url && (
                  <div className="mb-4 rounded-md overflow-hidden h-56">
                    <img 
                      src={selectedItem.image_url} 
                      alt={selectedItem.nom}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Price */}
                <div className="text-xl font-bold text-primary mb-3">
                  {selectedItem.prix} CAD
                </div>
                
                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-foreground mb-2">Description</h3>
                  <p className="text-foreground/80">{selectedItem.description}</p>
                </div>
                
                {/* Dietary Options */}
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Options alimentaires</h3>
                  <div className="space-y-2">
                    {selectedItem.is_vegan && (
                      <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-600" />
                        <span>Végétarien</span>
                      </div>
                    )}
                    
                    {selectedItem.is_spicy && (
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-red-600" />
                        <span>Épicé</span>
                      </div>
                    )}
                    
                    {selectedItem.is_peanut_free && (
                      <div className="flex items-center gap-2">
                        <NutOff className="w-5 h-5 text-amber-600" />
                        <span>Sans Cacahuètes</span>
                      </div>
                    )}
                    
                    {selectedItem.is_gluten_free && (
                      <div className="flex items-center gap-2">
                        <WheatOff className="w-5 h-5 text-yellow-600" />
                        <span>Sans Gluten</span>
                      </div>
                    )}
                    
                    {!selectedItem.is_vegan && !selectedItem.is_spicy && 
                     !selectedItem.is_peanut_free && !selectedItem.is_gluten_free && (
                      <p className="text-gray-500">Aucune option spéciale</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menu;
