import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { ContactFormData } from "@/types";
import { useTheme } from "@/components/theme/ThemeProvider";

// Schéma de validation du formulaire
const formSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(500)
});

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { images } = useTheme();
  
  // Utiliser l'image d'en-tête du contact depuis le ThemeProvider ou une image par défaut
  const backgroundImage = images.contactImageUrl || "/lovable-uploads/00ac4d79-14ae-4287-8ca4-c2b40d004275.png";
  
  // Configuration du formulaire avec React Hook Form et Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      email: "",
      message: ""
    },
  });
  
  // Soumission du formulaire
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulation d'envoi à l'API
    try {
      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Données du formulaire:", data);
      
      // Réinitialiser le formulaire
      form.reset();
      
      // Afficher un toast de succès
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      
      // Afficher un toast d'erreur
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-texture">
      {/* Banner */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white">Contactez-nous</h1>
        </div>
      </div>
      
      {/* Contact Content */}
      <section className="py-16 md:py-24">
        <div className="content-container">
          <AnimatedSection>
            <p className="text-center max-w-3xl mx-auto mb-12 text-lg">
              Une question, une réservation ou simplement envie de nous dire bonjour ? N'hésitez pas à nous contacter. Nous vous répondrons dans les plus brefs délais.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <AnimatedSection className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-playfair font-bold text-bistro-wood mb-6">Écrivez-nous</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-bistro-wood">Nom</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Votre nom" 
                            {...field} 
                            className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-bistro-wood">Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="votre@email.com" 
                            {...field} 
                            className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-bistro-wood">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Votre message" 
                            {...field} 
                            className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive min-h-32"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-bistro-olive hover:bg-bistro-olive-light text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-5 w-5" />
                        Envoyer
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </AnimatedSection>
            
            {/* Contact Information */}
            <AnimatedSection delay={300} direction="right">
              <div className="rounded-lg shadow-xl p-6 md:p-8 text-white overflow-hidden relative">
                {/* Background image with blur but no brightness adjustment */}
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-sm z-0"
                  style={{ backgroundImage: "url('/lovable-uploads/99813d7a-a237-43a1-b751-9371096b7fc2.png')" }}
                >
                </div>
                
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
                
                {/* Content */}
                <div className="relative z-20">
                  <h2 className="text-2xl font-playfair font-bold mb-8">Infos pratiques</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-bistro-olive flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold mb-1">Adresse</h3>
                        <p>12 Rue Wellington</p>
                        <p>Verdun, QC H4G 1N1</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-bistro-olive flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold mb-1">Téléphone</h3>
                        <p>(418) 555-1234</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-bistro-olive flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold mb-1">Email</h3>
                        <p>info@bistrodesamis.com</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-12">
                    <h3 className="text-lg font-bold mb-4">Horaires d'ouverture</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Lundi - Vendredi</span>
                        <span>16h - 23h</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Samedi - Dimanche</span>
                        <span>11h - 23h</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-12">
                    <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg shadow-md">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2798.1901917997275!2d-73.5710056845905!3d45.461396379101126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc910c079aea3fb%3A0xbec0b80c7a6645d5!2sRue%20Wellington%2C%20Montr%C3%A9al%2C%20QC!5e0!3m2!1sfr!2sca!4v1629471543873!5m2!1sfr!2sca"
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        title="Carte Google Maps"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
