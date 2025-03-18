
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Edit, Save, X } from "lucide-react";

interface InPlaceEditingContextType {
  isEditingEnabled: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

const InPlaceEditingContext = createContext<InPlaceEditingContextType>({
  isEditingEnabled: false,
  enableEditing: () => {},
  disableEditing: () => {}
});

export const useInPlaceEditing = () => useContext(InPlaceEditingContext);

interface InPlaceEditingProviderProps {
  children: ReactNode;
}

export const InPlaceEditingProvider: React.FC<InPlaceEditingProviderProps> = ({ children }) => {
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  
  const enableEditing = () => {
    setIsEditingEnabled(true);
    toast({
      title: "Mode édition activé",
      description: "Cliquez sur les éléments pour les modifier directement."
    });
  };
  
  const disableEditing = () => {
    setIsEditingEnabled(false);
  };
  
  return (
    <InPlaceEditingContext.Provider 
      value={{ 
        isEditingEnabled, 
        enableEditing, 
        disableEditing 
      }}
    >
      {children}
      
      {isEditingEnabled && (
        <div className="fixed bottom-6 right-6 flex gap-2 z-50">
          <Button 
            variant="destructive"
            size="sm"
            onClick={disableEditing}
            className="rounded-full h-12 w-12 p-0 shadow-lg"
          >
            <X className="h-5 w-5" />
          </Button>
          <Button 
            variant="default"
            size="sm"
            className="rounded-full h-12 px-4 shadow-lg"
          >
            <Save className="h-5 w-5 mr-2" />
            Terminer l'édition
          </Button>
        </div>
      )}
    </InPlaceEditingContext.Provider>
  );
};

export const EditableText: React.FC<{
  children: ReactNode;
  onSave: (text: string) => Promise<void>;
  className?: string;
}> = ({ children, onSave, className = "" }) => {
  const { isEditingEnabled } = useInPlaceEditing();
  
  if (!isEditingEnabled || typeof children !== 'string') {
    return <span className={className}>{children}</span>;
  }
  
  // Use the InPlaceTextEditor component when editing is enabled
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const EditableImage: React.FC<{
  src: string;
  alt: string;
  onSave: (newImageUrl: string) => Promise<void>;
  className?: string;
  aspectRatio?: "square" | "video" | "wide" | "portrait";
}> = ({ src, alt, onSave, className = "", aspectRatio = "video" }) => {
  const { isEditingEnabled } = useInPlaceEditing();
  
  if (!isEditingEnabled) {
    return <img src={src} alt={alt} className={className} />;
  }
  
  // Use the InPlaceImageEditor component when editing is enabled
  return (
    <div className={className}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

export const InPlaceEditingToggle: React.FC = () => {
  const { isEditingEnabled, enableEditing, disableEditing } = useInPlaceEditing();
  
  return (
    <Button
      variant={isEditingEnabled ? "default" : "outline"}
      onClick={isEditingEnabled ? disableEditing : enableEditing}
      className="gap-2"
    >
      <Edit className="h-4 w-4" />
      {isEditingEnabled ? "Désactiver l'édition directe" : "Activer l'édition directe"}
    </Button>
  );
};
