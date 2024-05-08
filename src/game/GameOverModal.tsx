import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface GameOverModalInterface {
	currentWinner: "player" | "opponent" | null;
}

export default function GameOverModal({ currentWinner }: GameOverModalInterface) {
	const isWin = currentWinner === "player"
  return (
    <AlertDialog open={!!currentWinner}>
      <AlertDialogContent className="max-w-fit">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl">You {isWin ? "win" : "lose"} the game !</AlertDialogTitle>
        </AlertDialogHeader>
          {/* <AlertDialogAction onClick={() => closeModal()}>Continue</AlertDialogAction> */}
      </AlertDialogContent>
    </AlertDialog>
  );
}