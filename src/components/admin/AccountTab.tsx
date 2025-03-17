
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const profileSchema = z.object({
  fullName: z.string().min(1, "Le nom complet est requis"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  address: z.string().min(1, "L'adresse est requise"),
});

interface AccountTabProps {
  user: any;
}

export const AccountTab = ({ user }: AccountTabProps) => {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || "",
      phone: user?.user_metadata?.phone || "",
      email: user?.email || "",
      address: user?.user_metadata?.address || "",
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user?.user_metadata?.full_name || "",
        phone: user?.user_metadata?.phone || "",
        email: user?.email || "",
        address: user?.user_metadata?.address || "",
      });
    }
  }, [user, form]);

  const handleSaveProfile = async (data: z.infer<typeof profileSchema>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: data.email,
        data: {
          full_name: data.fullName,
          phone: data.phone,
          address: data.address
        }
      });

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour du profil.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-playfair text-bistro-wood">Informations du Compte</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-bistro-wood">Nom Complet</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nom complet" 
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-bistro-wood">Numéro de Téléphone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Numéro de téléphone" 
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
                  <FormLabel className="text-bistro-wood">Adresse Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Email" 
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-bistro-wood">Adresse</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Adresse complète" 
                      {...field} 
                      className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="bg-bistro-olive hover:bg-bistro-olive-light text-white"
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
