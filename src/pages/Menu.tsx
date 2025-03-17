
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

// Définition de l'ordre fixe des catégories
const CATEGORY_ORDER = ["Apéritifs", "Entrées", "Plats", "Desserts", "Boissons"];

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
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

  const filteredItems = activeCategory
    ? menuItems.filter((item) => item.categorie === activeCategory)
    : menuItems;

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
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
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-bistro-wood mb-4">
                Saveurs Authentiques
              </h2>
              <p className="text-bistro-wood/80 max-w-2xl mx-auto">
                Une sélection de plats et boissons préparés avec passion, mettant en valeur les produits locaux et les traditions culinaires.
              </p>
            </div>
          </AnimatedSection>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <p className="text-bistro-wood">Chargement du menu...</p>
            </div>
          ) : (
            <>
              {/* Category Filter */}
              <div className="mb-8 flex justify-center">
                <div className="flex flex-wrap gap-2 justify-center">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        activeCategory === category
                          ? "bg-bistro-olive text-white"
                          : "bg-bistro-sand-light text-bistro-wood hover:bg-bistro-sand"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Menu Grid - Using MenuItemCard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={ref}>
                {filteredItems.length === 0 ? (
                  <p className="text-center text-bistro-wood/70 col-span-2 py-8">
                    Aucun élément trouvé dans cette catégorie.
                  </p>
                ) : (
                  filteredItems.map((item) => (
                    <AnimatedSection key={item.id} delay={0.1} className="h-full">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
                        <MenuItemCard 
                          item={item}
                          onEdit={() => handleItemClick(item)} 
                        />
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
                <DialogTitle className="text-2xl font-playfair font-bold text-bistro-wood">
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
                <div className="text-xl font-bold text-bistro-olive mb-3">
                  {selectedItem.prix} CAD
                </div>
                
                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-bistro-wood mb-2">Description</h3>
                  <p className="text-bistro-wood/80">{selectedItem.description}</p>
                </div>
                
                {/* Dietary Options */}
                <div>
                  <h3 className="text-lg font-medium text-bistro-wood mb-2">Options alimentaires</h3>
                  <div className="space-y-2">
                    {selectedItem.is_vegan && (
                      <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-600" />
                        <span>Végétalien</span>
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
