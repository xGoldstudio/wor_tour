
import Card from "@/Card";
import findCard from "@/cards";
import { AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useGameStore from "@/stores/gameStateInterface";
import { useState } from "react";

export default function Deck() {
  const { playerDeck } = useGameStore();
	const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div
          className="w-[192px] h-[267px] border-2 border-black rounded-md relative"
          style={{
            backgroundImage: "url('/back.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
					<div className="absolute px-2 rounded-full bg-slate-200 top-2 left-2 border-2 border-black">{playerDeck.length}</div>
				</div>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(200px*4)]">
        <AlertDialogHeader>
          <DialogTitle>Deck: {playerDeck.length}</DialogTitle>
          <DialogDescription className="grid grid-cols-[192px_192px_192px_192px] gap-4 py-4 w-auto">
						{
							playerDeck.map(id => (
								<Card card={findCard(id)} key={id} />
							))
						}
          </DialogDescription>
        </AlertDialogHeader>
				<AlertDialogFooter>
					<div className="flex w-full justify-center">
						<Button onClick={() => setIsOpen(false)}>Continue</Button>
					</div>
				</AlertDialogFooter>
      </DialogContent>
    </Dialog>
  );
}
