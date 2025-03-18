
import { useState } from "react";
import { Share2, Facebook, Twitter, X } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface SocialShareProps {
  title: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  className?: string;
}

export const SocialShare = ({ 
  title, 
  description = "", 
  imageUrl = "", 
  url, 
  className 
}: SocialShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get current URL if not provided
  const shareUrl = url || window.location.href;
  
  // Generate share URLs for different platforms
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(`${title} - Bistro des Amis`)}`;
  
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`${title} - Bistro des Amis 🍽️`)}&hashtags=BistroDesAmis,CuisineFrançaise,Gastronomie`;
  
  const handleShare = (platform: string) => {
    window.open(
      platform === 'facebook' ? facebookShareUrl : twitterShareUrl,
      '_blank',
      'width=600,height=400'
    );
    
    setIsOpen(false);
    
    toast({
      title: "Partagé avec succès !",
      description: `Contenu partagé sur ${platform === 'facebook' ? 'Facebook' : 'X (Twitter)'}`,
      duration: 3000,
    });
  };
  
  // Function to copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsOpen(false);
      toast({
        title: "Lien copié !",
        description: "L'URL a été copiée dans le presse-papier",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier l'URL",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button 
          className={cn("share-button", className)}
          aria-label="Partager sur les réseaux sociaux"
        >
          <Share2 size={16} />
          <span>Partager</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="end">
        <div className="flex flex-col space-y-1">
          <button
            className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-foreground text-sm"
            onClick={() => handleShare('facebook')}
          >
            <Facebook size={16} className="text-[#1877F2]" />
            <span>Facebook</span>
          </button>
          <button
            className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-foreground text-sm"
            onClick={() => handleShare('twitter')}
          >
            <Twitter size={16} className="text-black" />
            <span>X (Twitter)</span>
          </button>
          <button
            className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-foreground text-sm"
            onClick={copyToClipboard}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              width="16" 
              height="16" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copier le lien</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
