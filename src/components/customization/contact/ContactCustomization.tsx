
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ContactCustomization = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personnalisation du Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Options de personnalisation pour la page Contact à venir...
        </p>
      </CardContent>
    </Card>
  );
};
