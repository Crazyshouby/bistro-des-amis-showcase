
import { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  user: User | null;
  signOut: () => Promise<void>;
}

export const AdminHeader = ({ user, signOut }: AdminHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-playfair text-bistro-wood">Bienvenue, {user?.email}</h2>
      </div>
      <Button 
        onClick={signOut}
        variant="outline" 
        className="border-bistro-olive text-bistro-olive hover:bg-bistro-olive hover:text-white"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Se déconnecter
      </Button>
    </div>
  );
};
