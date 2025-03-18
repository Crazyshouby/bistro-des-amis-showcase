
import { useState, useEffect } from "react";
import { useIntersectionObserver } from "@/lib/hooks";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { MenuItem } from "@/types";
import MenuBanner from "@/components/menu/MenuBanner";
import MenuControls from "@/components/menu/MenuControls";
import MenuGrid from "@/components/menu/MenuGrid";
import MenuItemDetail from "@/components/menu/MenuItemDetail";
import { FilterOptions } from "@/components/menu/MenuFilter";
import { CATEGORY_ORDER, filterMenuItems } from "@/lib/menu-utils";
import { getPageData, isMenuPage } from "@/lib/content-loader";

const Menu = () => {
  const pageData = getPageData('menu');
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
        let orderedCategories = CATEGORY_ORDER;
        
        // If we have pageData and it's a menu page, use the categories from there
        if (pageData && isMenuPage(pageData)) {
          orderedCategories = pageData.filterCategories;
        }
        
        const filteredCategories = orderedCategories.filter(category => 
          uniqueCategoriesSet.has(category)
        );
        
        setCategories(filteredCategories);
        
        // Set default category as active
        let defaultCategory = filteredCategories.length > 0 ? filteredCategories[0] : "";
        
        // If we have pageData and it's a menu page with a default category, use that
        if (pageData && isMenuPage(pageData) && pageData.defaultCategory) {
          if (filteredCategories.includes(pageData.defaultCategory)) {
            defaultCategory = pageData.defaultCategory;
          }
        }
        
        setActiveCategory(defaultCategory);
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
  }, [pageData]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const filteredItems = filterMenuItems(menuItems, activeCategory, filters);
  
  // Si nous n'avons pas de données de page ou si ce n'est pas une page de menu
  if (!pageData || !isMenuPage(pageData)) {
    return <div>Données de page non disponibles</div>;
  }

  return (
    <div className="bg-texture">
      {/* Banner */}
      <MenuBanner bannerImage={pageData.bannerImage} />
      
      {/* Menu Section */}
      <section className="py-16 md:py-24">
        <div className="content-container">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4" style={{ color: pageData.styling.h2Color }}>
                {pageData.title}
              </h2>
              <p className="text-foreground/80 max-w-2xl mx-auto">
                {pageData.description}
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
              <MenuControls 
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              
              {/* Menu Grid */}
              <div ref={ref}>
                <MenuGrid items={filteredItems} onItemClick={handleItemClick} />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Menu Item Detail Dialog */}
      <MenuItemDetail selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
    </div>
  );
};

export default Menu;
