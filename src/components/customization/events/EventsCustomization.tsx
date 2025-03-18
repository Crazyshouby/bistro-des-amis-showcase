
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const EventsCustomization = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personnalisation des Événements</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Options de personnalisation pour la page Événements à venir...
        </p>
      </CardContent>
    </Card>
  );
};
