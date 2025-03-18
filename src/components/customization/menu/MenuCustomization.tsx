
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const MenuCustomization = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personnalisation du Menu</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Options de personnalisation pour la page Menu à venir...
        </p>
      </CardContent>
    </Card>
  );
};
