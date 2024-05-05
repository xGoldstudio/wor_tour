import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Card from "./Card";
import findCard from "./cards";

interface BoostedOpeningModal {
  cardIds: number[],
  open: boolean,
  closeModal: () => void,
}

export default function BoostedOpeningModal({ cardIds, open, closeModal }: BoostedOpeningModal) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-fit">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl">Your unpacked 3 cards !</AlertDialogTitle>
          <AlertDialogDescription className="flex gap-3 pb-8 pt-6">
            {cardIds.map(id => <Card card={findCard(id)} />)}
          </AlertDialogDescription>
        </AlertDialogHeader>
          <AlertDialogAction onClick={() => closeModal()}>Continue</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
