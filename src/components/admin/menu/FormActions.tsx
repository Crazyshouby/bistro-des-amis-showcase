
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  isUploading: boolean;
}

export const FormActions = ({ onCancel, isEditing, isUploading }: FormActionsProps) => {
  return (
    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Annuler
      </Button>
      <Button
        type="submit"
        className="bg-bistro-olive hover:bg-bistro-olive-light text-white"
        disabled={isUploading}
      >
        {isEditing ? "Mettre à jour" : "Ajouter"}
      </Button>
    </DialogFooter>
  );
};
