import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Schema for login form
const loginSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

// Schema for signup form
const signupSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  fullName: z.string().min(1, "Le nom complet est requis"),
});

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Signup form
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });

  // Handle login submission
  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });
      navigate("/admin");
    } catch (error) {
      toast({
        title: "Erreur inattendue",
        description: "Une erreur s'est produite lors de la connexion.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle signup submission
  const handleSignup = async (data: z.infer<typeof signupSchema>) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) {
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte.",
      });
      setIsLogin(true);
    } catch (error) {
      toast({
        title: "Erreur inattendue",
        description: "Une erreur s'est produite lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-texture">
      {/* Banner */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: "url('/lovable-uploads/17ae501f-c21a-4f1e-964e-ffdff257c0cb.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white">
            {isLogin ? "Connexion" : "Inscription"}
          </h1>
        </div>
      </div>
      
      {/* Auth Form */}
      <section className="py-16 md:py-24">
        <div className="content-container">
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-playfair text-bistro-wood">
                {isLogin ? "Connexion" : "Inscription"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLogin ? (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
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
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-bistro-wood">Mot de passe</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...field} 
                                className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive pr-10"
                              />
                            </FormControl>
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bistro-wood/70 hover:text-bistro-wood"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-bistro-olive hover:bg-bistro-olive-light text-white"
                      disabled={loading}
                    >
                      {loading ? "Connexion en cours..." : "Se connecter"}
                    </Button>
                    
                    <div className="text-center mt-4">
                      <button
                        type="button"
                        className="text-bistro-olive hover:underline text-sm"
                        onClick={() => setIsLogin(false)}
                      >
                        Pas encore de compte? S'inscrire
                      </button>
                    </div>
                  </form>
                </Form>
              ) : (
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-6">
                    <FormField
                      control={signupForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-bistro-wood">Nom complet</FormLabel>
                          <FormControl>
                            <Input 
                              type="text"
                              placeholder="Jean Dupont" 
                              {...field} 
                              className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
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
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-bistro-wood">Mot de passe</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...field} 
                                className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive pr-10"
                              />
                            </FormControl>
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bistro-wood/70 hover:text-bistro-wood"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-bistro-olive hover:bg-bistro-olive-light text-white"
                      disabled={loading}
                    >
                      {loading ? "Inscription en cours..." : "S'inscrire"}
                    </Button>
                    
                    <div className="text-center mt-4">
                      <button
                        type="button"
                        className="text-bistro-olive hover:underline text-sm"
                        onClick={() => setIsLogin(true)}
                      >
                        Déjà un compte? Se connecter
                      </button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Auth;
