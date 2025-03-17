
import { Paintbrush } from "lucide-react";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ColorPicker } from "./ColorPicker";
import { ColorConfig } from "./types";

interface ColorCardProps {
  color: ColorConfig;
  onColorChange: (id: string, value: string) => void;
}

export const ColorCard = ({ color, onColorChange }: ColorCardProps) => {
  return (
    <Card key={color.id}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Paintbrush className="mr-2 h-5 w-5" />
          {color.name}
        </CardTitle>
        <CardDescription>
          {color.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div 
            className="w-16 h-16 rounded-md border"
            style={{ backgroundColor: color.value }}
          ></div>
          <ColorPicker 
            id={color.id}
            value={color.value}
            onChange={(value) => onColorChange(color.id, value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
