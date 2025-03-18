
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setLoginError("");
    
    try {
      console.log("Tentative de connexion avec l'email:", data.email);
      
      // Vérification directe des identifiants de démonstration
      // Note: Cette approche simplifiée est utilisée uniquement pour débloquer l'accès
      if (data.email === "superadmin@bistrodesamis.com" && data.password === "SuperAdmin2025!") {
        console.log("Authentification réussie avec les identifiants de démonstration");
        
        // Stockage du token superadmin dans localStorage
        localStorage.setItem('superadmin_token', JSON.stringify({
          id: 1,
          email: "superadmin@bistrodesamis.com",
          role: "super_admin",
          timestamp: Date.now(),
        }));

        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'espace Super Admin",
        });

        // Redirection vers le tableau de bord superadmin
        navigate('/superadmin');
        return;
      }
      
      console.log("Vérification dans la base de données...");
      
      // Si les identifiants directs ne fonctionnent pas, essayer via la base de données
      const { data: superAdmins, error } = await supabase
        .from('super_admins')
        .select('*')
        .eq('email', data.email);

      if (error) {
        console.error("Erreur lors de la recherche du superadmin:", error);
        setLoginError("Erreur lors de la récupération des données");
        toast({
          title: "Erreur de base de données",
          description: "Impossible de vérifier les identifiants",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("Réponse de la base de données:", superAdmins);

      // Vérifier si un superadmin avec cet email existe
      if (!superAdmins || superAdmins.length === 0) {
        console.error("Aucun superadmin trouvé avec cet email");
        setLoginError("Email ou mot de passe incorrect");
        toast({
          title: "Échec de l'authentification",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const superAdmin = superAdmins[0];
      console.log("Superadmin trouvé:", superAdmin.email);
      
      // Vérification simplifiée du mot de passe pour les démonstrations
      if (data.password === superAdmin.password) {
        console.log("Authentification réussie avec le mot de passe de la base de données");
        
        // Stockage du token superadmin dans localStorage
        localStorage.setItem('superadmin_token', JSON.stringify({
          id: superAdmin.id,
          email: superAdmin.email,
          role: superAdmin.role,
          timestamp: Date.now(),
        }));

        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'espace Super Admin",
        });

        // Redirection vers le tableau de bord superadmin
        navigate('/superadmin');
      } else {
        console.error("Mot de passe incorrect");
        setLoginError("Email ou mot de passe incorrect");
        toast({
          title: "Échec de l'authentification",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError("Une erreur s'est produite lors de la connexion");
      toast({
        title: "Erreur de connexion",
        description: "Une erreur s'est produite lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1F2C] min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#222222] shadow-lg border border-[#333333]">
        <CardHeader className="border-b border-[#333333] bg-[#2A2A2A]">
          <CardTitle className="text-[#2DD4BF] font-sans text-xl text-center">Super Admin - Bistro des Amis</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="email@example.com" 
                        type="email"
                        className="border-[#444444] focus:border-[#2DD4BF] focus:ring-[#2DD4BF] bg-[#333333] text-white"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Mot de passe</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          {...field} 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="border-[#444444] focus:border-[#2DD4BF] focus:ring-[#2DD4BF] pr-10 bg-[#333333] text-white"
                        />
                      </FormControl>
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {loginError && (
                <div className="text-red-400 text-sm p-2 bg-red-900/20 border border-red-800/30 rounded">
                  {loginError}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#2DD4BF] text-[#222222] hover:bg-[#25A699] transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#222222]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Lock className="mr-2 h-4 w-4" />
                    Se connecter
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminLogin;
