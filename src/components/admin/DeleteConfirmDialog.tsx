
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirmDelete: () => void;
  itemToDelete: { type: 'menu' | 'event', id: string } | null;
}

export const DeleteConfirmDialog = ({
  isOpen,
  setIsOpen,
  onConfirmDelete,
  itemToDelete,
}: DeleteConfirmDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cet {itemToDelete?.type === 'menu' ? 'item du menu' : 'événement'} ?
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-500 hover:bg-red-600"
            onClick={onConfirmDelete}
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
