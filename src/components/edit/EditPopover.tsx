
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface EditPopoverProps {
  content: string;
  type: "text" | "image" | "link" | "html";
  onSave: (content: string) => void;
  onCancel: () => void;
  className?: string;
}

export const EditPopover: React.FC<EditPopoverProps> = ({
  content,
  type,
  onSave,
  onCancel,
  className,
}) => {
  const [editedContent, setEditedContent] = useState(content);
  const [isOpen, setIsOpen] = useState(true);

  const handleSave = () => {
    onSave(editedContent);
    setIsOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className={`${className} outline outline-2 outline-blue-500 outline-offset-2`}>
          {type === "image" ? (
            <img src={content} alt="Editable content" className={className} />
          ) : (
            content
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Modifier le contenu</h3>
          
          {type === "text" && (
            <Input
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Entrez le texte"
            />
          )}
          
          {type === "image" && (
            <Input
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Entrez l'URL de l'image"
            />
          )}
          
          {type === "link" && (
            <Input
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Entrez l'URL du lien"
            />
          )}
          
          {type === "html" && (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Entrez le contenu HTML"
              className="h-24"
            />
          )}
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
            >
              <Check className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
