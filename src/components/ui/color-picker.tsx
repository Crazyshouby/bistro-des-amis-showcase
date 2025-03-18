
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export const ColorPicker = ({ label, value, onChange, id }: ColorPickerProps) => {
  const pickerId = id || `color-picker-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className="space-y-2">
      <Label htmlFor={pickerId}>{label}</Label>
      <div className="flex gap-2">
        <div className="w-10 h-10 rounded border">
          <input
            type="color"
            id={pickerId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full cursor-pointer bg-transparent border-0"
          />
        </div>
        <Input 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
};
