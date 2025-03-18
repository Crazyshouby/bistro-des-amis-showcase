
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/shared/AnimatedSection";
import MarkdownContent from "@/components/shared/MarkdownContent";
import { getPageData, isStandardPage } from "@/lib/content-loader";

const Index = () => {
  const pageData = getPageData('home');
  
  // Préchargement des images
  useEffect(() => {
    if (pageData && isStandardPage(pageData) && pageData.gallery) {
      pageData.gallery.forEach(item => {
        const img = new Image();
        img.src = item.imageUrl;
      });
    }
    
    // Charger l'image de héros
    if (pageData && isStandardPage(pageData) && pageData.hero) {
      const img = new Image();
      img.src = pageData.hero.imageUrl;
    }
  }, [pageData]);

  if (!pageData || !isStandardPage(pageData)) {
    return <div>Données de page non disponibles</div>;
  }

  const { hero, gallery, cta, content, styling } = pageData;

  return (
    <div className="bg-texture">
      {/* Hero Section */}
      {hero && (
        <div className="relative h-screen overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${hero.imageUrl}')` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <AnimatedSection 
              className="max-w-3xl mx-auto"
              delay={300}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-bistro-sand mb-6">
                {hero.heading}
              </h1>
              <p className="text-xl md:text-2xl text-bistro-sand/90 mb-8">
                {hero.subheading}
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
      )}
      
      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="content-container">
          <AnimatedSection>
            <MarkdownContent content={content} styling={styling} />
          </AnimatedSection>
        </div>
      </section>
      
      {/* Gallery Section */}
      {gallery && gallery.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="content-container">
            <AnimatedSection className="text-center mb-16">
              <h2 className="section-title mx-auto" style={{ color: styling.h2Color }}>
                Notre univers
              </h2>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((image, index) => (
                <AnimatedSection key={index} delay={150 * (index + 1)}>
                  <div className="relative overflow-hidden rounded-lg shadow-md group shine-effect">
                    <img 
                      src={image.imageUrl} 
                      alt={image.alt} 
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <p className="text-white p-4 font-medium text-sm">{image.alt}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      {cta && (
        <section 
          className="relative py-20 md:py-32 bg-cover bg-center"
          style={{ backgroundImage: `url('${cta.backgroundImage}')` }}
        >
          <div className="absolute inset-0 bg-bistro-brick/70"></div>
          <div className="content-container relative z-10">
            <AnimatedSection className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-bistro-sand mb-6">
                {cta.text}
              </h2>
              <p className="text-lg text-bistro-sand/90 mb-8">
                {cta.description}
              </p>
              {cta.buttons && cta.buttons.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  {cta.buttons.map((button, index) => (
                    <Link key={index} to={button.url}>
                      <Button className="w-full sm:w-auto bg-bistro-sand text-bistro-wood hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300 text-lg px-6 py-3">
                        {button.text}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </AnimatedSection>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
