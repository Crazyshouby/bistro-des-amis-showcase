
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export const SuperAdminLayout = ({ children }: SuperAdminLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('superadmin_token');
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté de l'espace Super Admin",
    });
    navigate('/superadmin/login');
  };

  return (
    <div className="min-h-screen bg-[#121218]">
      <header className="bg-[#1A1F2C] shadow-md border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#2DD4BF] font-sans">Super Admin - Configuration du site</h1>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="bg-[#2DD4BF] text-[#121218] hover:bg-[#25A699] hover:text-white border-none"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
