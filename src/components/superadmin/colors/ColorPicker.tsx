
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker = ({ id, value, onChange }: ColorPickerProps) => {
  return (
    <div className="flex-1">
      <Label htmlFor={`color-${id}`} className="mb-1 block">
        Code couleur
      </Label>
      <div className="flex space-x-2">
        <Input
          id={`color-${id}`}
          type="color"
          className="w-16"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono uppercase"
        />
      </div>
    </div>
  );
};
