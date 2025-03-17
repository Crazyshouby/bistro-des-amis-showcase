
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils, Coffee, Wine, IceCream } from "lucide-react";
import MenuItemCard from "@/components/shared/MenuItemCard";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { MenuItem } from "@/types";

// Données initiales pour démonstration
const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    categorie: "Apéritifs",
    nom: "Planche charcuterie/fromage",
    description: "Jambon sec, saucisson, cheddar vieilli, pain grillé artisanal.",
    prix: 18
  },
  {
    id: "2",
    categorie: "Apéritifs",
    nom: "Croquettes de camembert",
    description: "Servies avec une sauce aux canneberges maison.",
    prix: 12
  },
  {
    id: "3",
    categorie: "Plats",
    nom: "Burger du Bistro",
    description: "Pain artisanal, steak Angus, cheddar, frites maison.",
    prix: 22
  },
  {
    id: "4",
    categorie: "Plats",
    nom: "Tartine printanière",
    description: "Avocat frais, œuf poché, graines de tournesol.",
    prix: 19
  },
  {
    id: "5",
    categorie: "Desserts",
    nom: "Fondant au chocolat",
    description: "Cœur coulant, crème fouettée légère.",
    prix: 9
  },
  {
    id: "6",
    categorie: "Desserts",
    nom: "Tarte citron meringuée",
    description: "Zeste bio, meringue dorée.",
    prix: 8
  },
  {
    id: "7",
    categorie: "Boissons",
    nom: "L'Ami Spritz",
    description: "Prosecco, Aperol, tranche d'orange sanguine.",
    prix: 14
  },
  {
    id: "8",
    categorie: "Boissons",
    nom: "Bière La Locale",
    description: "Blonde légère, brassée à Verdun.",
    prix: 9
  },
  {
    id: "9",
    categorie: "Boissons",
    nom: "Vin Côte du Bistro",
    description: "Rouge fruité, notes de cerise.",
    prix: 8
  }
];

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [activeCategory, setActiveCategory] = useState("Apéritifs");
  
  // Fonction pour récupérer les items de menu par catégorie
  const getItemsByCategory = (category: string) => {
    return menuItems.filter(item => item.categorie === category);
  };

  return (
    <div className="bg-texture">
      {/* Banner */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: "url('/lovable-uploads/19408610-7939-4299-999c-208a2355a264.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white">Notre Menu</h1>
        </div>
      </div>
      
      {/* Menu Content */}
      <section className="py-16 md:py-24">
        <div className="content-container">
          <AnimatedSection>
            <p className="text-center max-w-3xl mx-auto mb-12 text-lg">
              Découvrez notre sélection de plats savoureux préparés avec passion par notre chef. Des ingrédients frais et de saison pour une expérience culinaire authentique.
            </p>
          </AnimatedSection>
          
          <Tabs defaultValue="Apéritifs" className="w-full" onValueChange={setActiveCategory}>
            <AnimatedSection className="flex justify-center mb-12">
              <TabsList className="bg-bistro-sand grid grid-cols-2 md:grid-cols-4 gap-4">
                <TabsTrigger 
                  value="Apéritifs"
                  className="data-[state=active]:bg-bistro-brick data-[state=active]:text-white"
                >
                  <Utensils className="mr-2 h-4 w-4" />
                  Apéritifs
                </TabsTrigger>
                <TabsTrigger 
                  value="Plats"
                  className="data-[state=active]:bg-bistro-brick data-[state=active]:text-white"
                >
                  <Utensils className="mr-2 h-4 w-4" />
                  Plats
                </TabsTrigger>
                <TabsTrigger 
                  value="Desserts"
                  className="data-[state=active]:bg-bistro-brick data-[state=active]:text-white"
                >
                  <IceCream className="mr-2 h-4 w-4" />
                  Desserts
                </TabsTrigger>
                <TabsTrigger 
                  value="Boissons"
                  className="data-[state=active]:bg-bistro-brick data-[state=active]:text-white"
                >
                  <Wine className="mr-2 h-4 w-4" />
                  Boissons
                </TabsTrigger>
              </TabsList>
            </AnimatedSection>
            
            <TabsContent value="Apéritifs" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getItemsByCategory("Apéritifs").map((item) => (
                  <AnimatedSection key={item.id} className="fade-in-up">
                    <MenuItemCard item={item} />
                  </AnimatedSection>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="Plats" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getItemsByCategory("Plats").map((item) => (
                  <AnimatedSection key={item.id} className="fade-in-up">
                    <MenuItemCard item={item} />
                  </AnimatedSection>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="Desserts" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getItemsByCategory("Desserts").map((item) => (
                  <AnimatedSection key={item.id} className="fade-in-up">
                    <MenuItemCard item={item} />
                  </AnimatedSection>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="Boissons" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getItemsByCategory("Boissons").map((item) => (
                  <AnimatedSection key={item.id} className="fade-in-up">
                    <MenuItemCard item={item} />
                  </AnimatedSection>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Menu;
