
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { profileSchema, ProfileData } from "./profileUtils";

interface ProfileFormProps {
  initialData: ProfileData;
  onSubmit: (data: ProfileData) => void;
}

export const ProfileForm = ({ initialData, onSubmit }: ProfileFormProps) => {
  const form = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData
  });

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          
          <div className="border-t border-bistro-sand pt-6 mt-6">
            <h3 className="text-lg font-playfair font-semibold mb-4 text-bistro-wood">Réseaux Sociaux</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="facebookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bistro-wood">Facebook</FormLabel>
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
                name="instagramUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bistro-wood">Instagram</FormLabel>
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
                name="twitterUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bistro-wood">X (Twitter)</FormLabel>
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
                name="youtubeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bistro-wood">YouTube</FormLabel>
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
  );
};
