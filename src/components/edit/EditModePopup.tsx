
import React from "react";
import { useEditMode } from "./EditModeProvider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Wand2 } from "lucide-react";

export const EditModePopup: React.FC = () => {
  const { isEditMode, toggleEditMode } = useEditMode();

  if (!isEditMode) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 border border-gray-200">
      <div className="flex items-center gap-4">
        <Wand2 className="h-5 w-5 text-bistro-olive" />
        <div>
          <p className="text-sm font-medium">Mode édition</p>
          <p className="text-xs text-gray-500">Cliquez sur les éléments pour les modifier</p>
        </div>
        <Switch 
          checked={isEditMode} 
          onCheckedChange={toggleEditMode}
          className="data-[state=checked]:bg-bistro-olive"
        />
      </div>
    </div>
  );
};
