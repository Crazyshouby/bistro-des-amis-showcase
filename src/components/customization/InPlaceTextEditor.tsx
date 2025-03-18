
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Type, Bold, Italic, AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";
import { toast } from "@/components/ui/use-toast";

interface InPlaceTextEditorProps {
  initialText: string;
  initialColor?: string;
  initialFont?: string;
  initialSize?: string;
  initialWeight?: string;
  initialStyle?: string;
  isMultiline?: boolean;
  onSave: (values: {
    text: string;
    color?: string;
    font?: string;
    size?: string;
    weight?: string;
    style?: string;
  }) => Promise<void>;
}

const fontOptions = [
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Lato", label: "Lato" },
];

const fontSizeOptions = [
  { value: "text-sm", label: "Petit" },
  { value: "text-base", label: "Normal" },
  { value: "text-lg", label: "Grand" },
  { value: "text-xl", label: "Très grand" },
  { value: "text-2xl", label: "Énorme" },
];

export const InPlaceTextEditor = ({
  initialText,
  initialColor = "#000000",
  initialFont = "Playfair Display",
  initialSize = "text-base",
  initialWeight = "font-normal",
  initialStyle = "normal",
  isMultiline = false,
  onSave,
}: InPlaceTextEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const [text, setText] = useState(initialText);
  const [color, setColor] = useState(initialColor);
  const [font, setFont] = useState(initialFont);
  const [size, setSize] = useState(initialSize);
  const [weight, setWeight] = useState(initialWeight);
  const [style, setStyle] = useState(initialStyle);
  
  const [isSaving, setIsSaving] = useState(false);
  const textInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (isEditing && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isEditing]);
  
  useEffect(() => {
    setText(initialText);
    setColor(initialColor);
    setFont(initialFont);
    setSize(initialSize);
    setWeight(initialWeight);
    setStyle(initialStyle);
  }, [initialText, initialColor, initialFont, initialSize, initialWeight, initialStyle]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      await onSave({
        text,
        color,
        font,
        size,
        weight,
        style
      });
      
      setIsEditing(false);
      setPopoverOpen(false);
      
      toast({
        title: "Sauvegardé",
        description: "Les modifications ont été enregistrées avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setText(initialText);
    setColor(initialColor);
    setFont(initialFont);
    setSize(initialSize);
    setWeight(initialWeight);
    setStyle(initialStyle);
    setIsEditing(false);
    setPopoverOpen(false);
  };
  
  const getStyleClasses = () => {
    const weightClass = weight === "font-bold" ? "font-bold" : "font-normal";
    const styleClass = style === "italic" ? "italic" : "not-italic";
    const sizeClass = size || "text-base";
    
    return `${weightClass} ${styleClass} ${sizeClass}`;
  };
  
  return (
    <div className="group relative">
      {isEditing ? (
        <div className="flex flex-col gap-2">
          {isMultiline ? (
            <Textarea
              ref={textInputRef as React.RefObject<HTMLTextAreaElement>}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="min-w-[200px]"
            />
          ) : (
            <Input
              ref={textInputRef as React.RefObject<HTMLInputElement>}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-w-[200px]"
            />
          )}
          
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Type className="h-4 w-4 mr-2" />
                Options de texte
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Style de texte</h4>
                  <p className="text-sm text-muted-foreground">
                    Personnalisez l'apparence de votre texte
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <div className="grid grid-cols-4 gap-2">
                    <Button 
                      variant={weight === "font-bold" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setWeight(weight === "font-bold" ? "font-normal" : "font-bold")}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={style === "italic" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setStyle(style === "italic" ? "normal" : "italic")}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="font-family">Police</Label>
                    <Select value={font} onValueChange={setFont}>
                      <SelectTrigger id="font-family">
                        <SelectValue placeholder="Choisir une police" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Taille</Label>
                    <Select value={size} onValueChange={setSize}>
                      <SelectTrigger id="font-size">
                        <SelectValue placeholder="Choisir une taille" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontSizeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <ColorPicker 
                    label="Couleur de texte" 
                    value={color} 
                    onChange={setColor} 
                    id="text-color"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="flex gap-2 mt-2 justify-end">
            <Button size="sm" variant="outline" onClick={handleCancel} disabled={isSaving}>
              <X className="h-4 w-4 mr-1" />
              Annuler
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Check className="h-4 w-4 mr-1" />
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => setIsEditing(true)}
          className={`cursor-pointer inline-block ${getStyleClasses()} hover:bg-gray-100 hover:bg-opacity-50 px-1 py-0.5 rounded transition-colors`}
          style={{ 
            fontFamily: font,
            color: color
          }}
        >
          {text}
          <div className="absolute inset-0 border border-dashed border-transparent group-hover:border-gray-300 rounded pointer-events-none"></div>
        </div>
      )}
    </div>
  );
};
