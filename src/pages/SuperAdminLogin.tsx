
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
import bcrypt from "bcryptjs";

const loginSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      // Get the super admin with the provided email
      const { data: superAdmin, error } = await supabase
        .from('super_admins')
        .select('*')
        .eq('email', data.email)
        .single();

      if (error || !superAdmin) {
        toast({
          title: "Échec de l'authentification",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(data.password, superAdmin.password);

      if (!isPasswordValid) {
        toast({
          title: "Échec de l'authentification",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Store the super admin token in localStorage
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

      // Redirect to super admin dashboard
      navigate('/superadmin');
    } catch (err) {
      console.error('Login error:', err);
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
    <div className="bg-[#E5E7EB] min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg border border-[#6B7280]">
        <CardHeader className="border-b border-[#6B7280] bg-[#F3F4F6]">
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
                    <FormLabel className="text-[#374151]">Email</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="superadmin@bistrodesamis.com" 
                        type="email"
                        className="border-[#6B7280] focus:border-[#2DD4BF] focus:ring-[#2DD4BF]"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#374151]">Mot de passe</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          {...field} 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="border-[#6B7280] focus:border-[#2DD4BF] focus:ring-[#2DD4BF] pr-10"
                        />
                      </FormControl>
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#2DD4BF] text-[#E5E7EB] hover:bg-[#6B7280] transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
