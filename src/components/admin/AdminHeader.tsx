
import { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  user: User | null;
  signOut: () => Promise<void>;
  isMobile?: boolean;
}

export const AdminHeader = ({ user, signOut, isMobile }: AdminHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-playfair text-bistro-wood break-words">
          {isMobile ? 'Bienvenue' : `Bienvenue, ${user?.email}`}
        </h2>
        {isMobile && user?.email && (
          <p className="text-sm text-bistro-wood/70 break-words">{user?.email}</p>
        )}
      </div>
      <Button 
        onClick={signOut}
        variant="outline" 
        size={isMobile ? "sm" : "default"}
        className="border-bistro-olive text-bistro-olive hover:bg-bistro-olive hover:text-white w-full md:w-auto"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Se déconnecter
      </Button>
    </div>
  );
};
