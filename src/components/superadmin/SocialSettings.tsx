
import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter, Youtube, Save, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const socialSchema = z.object({
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
});

export const SocialSettings = () => {
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof socialSchema>>({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
    }
  });

  useEffect(() => {
    const loadSocialLinks = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('type', 'social');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const socialData = {
            facebook: "",
            instagram: "",
            twitter: "",
            youtube: "",
          };
          
          data.forEach(item => {
            if (item.key in socialData) {
              socialData[item.key as keyof typeof socialData] = item.value;
            }
          });
          
          form.reset(socialData);
        }
      } catch (error) {
        console.error('Error loading social links:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les liens sociaux",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSocialLinks();
  }, [form]);

  const handleSaveSocialLinks = async (data: z.infer<typeof socialSchema>) => {
    try {
      // Update each social link in site_settings table
      for (const [key, value] of Object.entries(data)) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: value || "" })
          .eq('type', 'social')
          .eq('key', key);
          
        if (error) throw error;
      }
      
      toast({
        title: "Réseaux sociaux mis à jour",
        description: "Les liens des réseaux sociaux ont été mis à jour avec succès."
      });
    } catch (error) {
      console.error('Error updating social links:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour des liens.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-playfair text-bistro-wood">Réseaux Sociaux</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <RefreshCw className="animate-spin h-8 w-8 text-bistro-olive" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-playfair text-bistro-wood">Réseaux Sociaux</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-bistro-wood/80">
          Configurez les liens vers vos réseaux sociaux qui apparaîtront dans le pied de page du site.
          Laissez un champ vide pour ne pas afficher le réseau social correspondant.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveSocialLinks)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-bistro-wood">
                      <Facebook size={18} />
                      Facebook
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://facebook.com/votreprofil" 
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
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-bistro-wood">
                      <Instagram size={18} />
                      Instagram
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://instagram.com/votreprofil" 
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
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-bistro-wood">
                      <Twitter size={18} />
                      X (Twitter)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://x.com/votreprofil" 
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
                name="youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-bistro-wood">
                      <Youtube size={18} />
                      YouTube
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://youtube.com/c/votrechaine" 
                        {...field} 
                        className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              className="bg-bistro-olive hover:bg-bistro-olive-light text-white mt-4"
            >
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
