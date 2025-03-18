import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { useParallax } from "@/lib/hooks";
import { useTheme } from "@/components/theme/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { InPlaceTextEditor } from "@/components/customization/InPlaceTextEditor";
import { InPlaceImageEditor } from "@/components/customization/InPlaceImageEditor";
import { useInPlaceEditing } from "@/components/customization/InPlaceEditingProvider";

const Index = () => {
  // Hook personnalisé pour l'effet parallax amélioré - plus prononcé et fluide
  const parallaxRef = useParallax(0.25, true); // Augmentation de la vitesse pour un effet plus prononcé
  const { images, textContent, refreshTheme } = useTheme();
  const [galleryImages, setGalleryImages] = useState<Array<{id: string, url: string, alt: string}>>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Default image as fallback if homeImageUrl is not available
  const homeImageUrl = images.homeImageUrl || "/lovable-uploads/3879cbc3-d347-45e2-b93d-53a58b78ba5a.png";
  // Utiliser l'image d'histoire depuis le ThemeProvider
  const historyImageUrl = images.historyImageUrl || "/lovable-uploads/124dcbfa-dac8-4b14-ab31-905afc4085d6.png";
  
  useEffect(() => {
    // Parse gallery images from textContent
    if (textContent?.galleryImages) {
      try {
        const parsedImages = JSON.parse(textContent.galleryImages);
        setGalleryImages(parsedImages);
      } catch (error) {
        console.error("Error parsing gallery images:", error);
      }
    }
    
    const images = [
      '/lovable-uploads/19408610-7939-4299-999c-208a2355a264.png', // barista
      '/lovable-uploads/a801663d-ec08-448a-a543-cfeccd30346d.png', // interior with bar
      '/lovable-uploads/124dcbfa-dac8-4b14-ab31-905afc4085d6.png', // exterior night
      '/lovable-uploads/00ac4d79-14ae-4287-8ca4-c2b40d004275.png', // interior with logo wall
      '/lovable-uploads/1cbe3f9b-808e-4c73-8fab-38ffe1369dde.png', // interior dining area
      '/lovable-uploads/714769f0-6cd7-4831-bece-5bd87d46c6b1.png', // interior with people
      '/lovable-uploads/17ae501f-c21a-4f1e-964e-ffdff257c0cb.png', // man with apron
      '/lovable-uploads/bf89ee9a-96c9-4013-9f71-93f91dbff5d5.png', // new bistro facade
      '/lovable-uploads/3879cbc3-d347-45e2-b93d-53a58b78ba5a.png', // new bistro image
    ];
    
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [textContent]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    // Open file input
    document.getElementById(`gallery-image-upload-${index}`)?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      const file = e.target.files[0];
      
      // Size and type validation
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image doit faire moins de 5Mo",
          variant: "destructive"
        });
        return;
      }
      
      if (!file.type.match('image/(jpeg|jpg|png|gif|webp)')) {
        toast({
          title: "Erreur",
          description: "Seuls les formats JPEG, PNG, GIF et WEBP sont acceptés",
          variant: "destructive"
        });
        return;
      }
      
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `gallery-image-${Date.now()}.${fileExt}`;
      const filePath = `site_images/${fileName}`;
      
      console.log("Uploading gallery image:", filePath);
      
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('site_images')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error("Gallery upload error:", uploadError);
        throw uploadError;
      }
      
      console.log("Gallery image uploaded successfully");
      
      // Get public URL
      const { data } = supabase.storage
        .from('site_images')
        .getPublicUrl(filePath);
        
      if (data) {
        const imageUrl = data.publicUrl;
        console.log("Gallery image URL obtained:", imageUrl);
        
        // Update local state
        const updatedImages = [...galleryImages];
        updatedImages[index] = {
          ...updatedImages[index],
          url: imageUrl
        };
        setGalleryImages(updatedImages);
        
        // Update in database
        await updateGalleryImages(updatedImages);
        
        toast({
          title: "Succès",
          description: "L'image a été mise à jour avec succès."
        });
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const updateGalleryImages = async (images: Array<{id: string, url: string, alt: string}>) => {
    try {
      const imagesJson = JSON.stringify(images);
      
      // Check if gallery_images already exists
      const { data: existingConfig, error: checkError } = await supabase
        .from('site_config')
        .select('key')
        .eq('key', 'gallery_images');
      
      if (checkError) {
        console.error("Error checking existing config:", checkError);
        throw checkError;
      }
      
      if (existingConfig && existingConfig.length > 0) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('site_config')
          .update({ value: imagesJson })
          .eq('key', 'gallery_images');
          
        if (updateError) {
          console.error("Error updating gallery_images:", updateError);
          throw updateError;
        }
        console.log("Updated gallery_images successfully");
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('site_config')
          .insert({ key: 'gallery_images', value: imagesJson });
          
        if (insertError) {
          console.error("Error inserting gallery_images:", insertError);
          throw insertError;
        }
        console.log("Inserted gallery_images successfully");
      }
      
      // Explicitly refresh the theme to get the latest data
      await refreshTheme();
    } catch (error) {
      console.error("Error saving gallery images:", error);
      throw error;
    }
  };

  const handleSaveHeroTitle = async (values: { text: string, color?: string, font?: string }) => {
    try {
      setUploading(true);
      
      await supabase
        .from('site_config')
        .upsert([
          { key: 'hero_title', value: values.text },
          { key: 'hero_title_color', value: values.color || "#F5E9D7" },
          { key: 'hero_title_font', value: values.font || "Playfair Display" }
        ]);
      
      await refreshTheme();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error saving hero title:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le titre",
        variant: "destructive"
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };
  
  const handleSaveHeroSubtitle = async (values: { text: string, color?: string }) => {
    try {
      setUploading(true);
      
      await supabase
        .from('site_config')
        .upsert([
          { key: 'hero_subtitle', value: values.text },
          { key: 'hero_subtitle_color', value: values.color || "#F5E9D7" }
        ]);
      
      await refreshTheme();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error saving hero subtitle:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le sous-titre",
        variant: "destructive"
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };
  
  const handleSaveHomeImage = async (newImageUrl: string) => {
    try {
      setUploading(true);
      
      await supabase
        .from('site_config')
        .upsert([
          { key: 'home_image_url', value: newImageUrl }
        ]);
      
      await refreshTheme();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error saving home image:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'image",
        variant: "destructive"
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const { isEditingEnabled } = useInPlaceEditing();

  return (
    <div className="bg-texture">
      <div className="relative h-screen overflow-hidden">
        {/* Image avec effet parallax amélioré - plus prononcé et fluide */}
        <div 
          ref={parallaxRef}
          className="absolute inset-0 bg-cover bg-center filter blur-[3px]"
          style={{ 
            backgroundImage: `url('${homeImageUrl}')`,
            transformOrigin: "center center",
            top: "-25%",
            height: "150%",  // Augmentation significative de la hauteur pour un effet plus prononcé
            width: "100%"
          }}
        />
        {/* Superposition semi-transparente pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <AnimatedSection 
            className="max-w-3xl mx-auto"
            delay={300}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-bistro-sand mb-6">
              {isEditingEnabled ? (
                <InPlaceTextEditor
                  initialText={textContent?.heroTitle || "Bienvenue au Bistro des Amis"}
                  initialColor={textContent?.heroTitleColor || "#F5E9D7"}
                  initialFont={textContent?.heroTitleFont || "Playfair Display"}
                  initialSize="text-4xl md:text-5xl lg:text-6xl"
                  initialWeight="font-bold"
                  onSave={handleSaveHeroTitle}
                />
              ) : (
                textContent?.heroTitle || "Bienvenue au Bistro des Amis"
              )}
            </h1>
            <p className="text-xl md:text-2xl text-bistro-sand/90 mb-8">
              {isEditingEnabled ? (
                <InPlaceTextEditor
                  initialText={textContent?.heroSubtitle || "Votre pause gourmande à Verdun"}
                  initialColor={textContent?.heroSubtitleColor || "#F5E9D7"}
                  initialSize="text-xl md:text-2xl"
                  onSave={handleSaveHeroSubtitle}
                />
              ) : (
                textContent?.heroSubtitle || "Votre pause gourmande à Verdun"
              )}
            </p>
            <Link to="/menu">
              <Button 
                className="bg-bistro-olive hover:bg-secondary hover:text-secondary-foreground text-bistro-sand text-lg px-8 py-6 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Découvrir le menu
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </div>
      
      <section className="py-16 md:py-24">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <AnimatedSection className="order-2 md:order-1">
              <h2 className="section-title" style={{
                color: textContent?.historyTitleColor || "#3A2E1F",
                fontFamily: textContent?.historyTitleFont || "Playfair Display"
              }}>
                {textContent?.historyTitle || "Notre Histoire"}
              </h2>
              <p className="text-lg mb-6" style={{
                color: textContent?.historyTextColor || "#3A2E1F"
              }}>
                {textContent?.historyText || "Un bistro rustique au cœur de Verdun, où bonne cuisine et ambiance conviviale se rencontrent. Ouvert depuis 1930, le Bistro des Amis perpétue la tradition d'une cuisine authentique dans un cadre chaleureux."}
              </p>
              <p className="text-lg mb-6" style={{
                color: textContent?.historyTextColor || "#3A2E1F"
              }}>
                {textContent?.historyText2 || "Notre philosophie est simple : des produits frais, des plats savoureux et un service attentionné. Que ce soit pour un déjeuner rapide, un dîner en famille ou un souper entre amis, notre équipe vous accueille avec le sourire."}
              </p>
              <div className="flex space-x-4 mt-8">
                <Link to="/menu">
                  <Button className="btn-primary">
                    Notre menu
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="border-bistro-olive text-bistro-olive hover:bg-bistro-olive hover:text-bistro-sand">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="order-1 md:order-2" delay={300} direction="right">
              <div className="relative rounded-lg overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform duration-500 shine-effect">
                <img 
                  src={historyImageUrl} 
                  alt="Extérieur du Bistro des Amis" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      <section className="bg-bistro-sand py-16 md:py-24">
        <div className="content-container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="section-title mx-auto">Ce qui nous distingue</h2>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Cuisine maison",
                description: "Des plats préparés avec passion à partir d'ingrédients frais et de saison.",
                delay: 150
              },
              {
                title: "Ambiance chaleureuse",
                description: "Un cadre rustique et convivial pour des moments inoubliables entre amis ou en famille.",
                delay: 300
              },
              {
                title: "Tradition depuis 1930",
                description: "L'authenticité d'un bistro qui a traversé les décennies en conservant son âme.",
                delay: 450
              }
            ].map((feature, index) => (
              <AnimatedSection key={index} delay={feature.delay}>
                <div className="bg-bistro-sand-light p-6 rounded-lg shadow-md h-full flex flex-col">
                  <h3 className="text-xl font-playfair font-bold text-secondary mb-4">{feature.title}</h3>
                  <p className="text-foreground/80 flex-grow">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24">
        <div className="content-container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="section-title mx-auto">{textContent?.galleryTitle || "Notre univers"}</h2>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.length > 0 ? (
              galleryImages.map((image, index) => (
                <AnimatedSection key={index} delay={150 + (index * 150)}>
                  <div 
                    className="relative overflow-hidden rounded-lg shadow-md group shine-effect cursor-pointer"
                    onClick={() => handleImageClick(index)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.alt} 
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <p className="text-white p-4 font-medium text-sm">{image.alt}</p>
                    </div>
                    <input
                      type="file"
                      id={`gallery-image-upload-${index}`}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, index)}
                      disabled={uploading}
                    />
                  </div>
                </AnimatedSection>
              ))
            ) : (
              // Fallback to original images
              [
                {
                  src: "/lovable-uploads/a801663d-ec08-448a-a543-cfeccd30346d.png",
                  alt: "Le bar du Bistro des Amis",
                  delay: 150
                },
                {
                  src: "/lovable-uploads/1cbe3f9b-808e-4c73-8fab-38ffe1369dde.png",
                  alt: "Salle à manger du Bistro des Amis",
                  delay: 300
                },
                {
                  src: "/lovable-uploads/00ac4d79-14ae-4287-8ca4-c2b40d004275.png",
                  alt: "Espace intérieur du Bistro des Amis",
                  delay: 450
                },
                {
                  src: "/lovable-uploads/19408610-7939-4299-999c-208a2355a264.png",
                  alt: "Notre barista préparant un café",
                  delay: 600
                },
                {
                  src: "/lovable-uploads/17ae501f-c21a-4f1e-964e-ffdff257c0cb.png",
                  alt: "Notre équipe passionnée",
                  delay: 750
                },
                {
                  src: "/lovable-uploads/bf89ee9a-96c9-4013-9f71-93f91dbff5d5.png",
                  alt: "Façade du Bistro des Amis",
                  delay: 900
                }
              ].map((image, index) => (
                <AnimatedSection key={index} delay={image.delay}>
                  <div className="relative overflow-hidden rounded-lg shadow-md group shine-effect">
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <p className="text-white p-4 font-medium text-sm">{image.alt}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))
            )}
          </div>
        </div>
      </section>
      
      <section 
        className="relative py-20 md:py-32 bg-cover bg-center"
        style={{ backgroundImage: "url('/lovable-uploads/00ac4d79-14ae-4287-8ca4-c2b40d004275.png')" }}
      >
        <div className="absolute inset-0 bg-bistro-brick/70"></div>
        <div className="content-container relative z-10">
          <AnimatedSection className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-bistro-sand mb-6">Venez passer un moment convivial</h2>
            <p className="text-lg text-bistro-sand/90 mb-8">
              Réservez dès maintenant pour garantir votre table et profiter de notre ambiance chaleureuse et de notre cuisine savoureuse.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/contact">
                <Button className="w-full sm:w-auto bg-bistro-sand text-bistro-wood hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300 text-lg px-6 py-3">
                  Nous contacter
                </Button>
              </Link>
              <Link to="/events">
                <Button className="w-full sm:w-auto bg-bistro-sand text-bistro-wood hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300 text-lg px-6 py-3">
                  Voir nos événements
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
