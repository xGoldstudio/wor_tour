import { ManaBall } from "@/game/gui/ManaBar";
import CardBorder, {
  CardContentIllustartion,
} from "@/game/gui/card/CardBorder";
import { Button } from "../../Home";
import ScrollContainer from "react-indiana-drag-scroll";
import { useState } from "react";
import CardModal from "./CardModal";
import usePlayerStore from "@/home/store/playerStore";
import { preventDefault } from "@/lib/eventUtils";

export default function DeckTab() {
  const { deck, collection } = usePlayerStore((state) => ({
    deck: state.deck,
    collection: state.getCollection(),
  }));

  return (
    <div className="w-full grid grid-rows-[auto_1fr] absolute top-0 h-full">
      <ScrollContainer className="grow overflow-y-scroll pt-2 scrollbar-hide flex justify-center">
        <div className="grid grid-cols-3 gap-4">
          {collection.map((card) => (
            <div className="w-full flex justify-center">
              <DeckCard cardId={card.id} />
            </div>
          ))}
        </div>
      </ScrollContainer>
      <div className="w-full flex justify-center relative min-h-[300px]">
        <div className="absolute w-full h-full bg-slate-400 opacity-50" />
        <div className="grid grid-cols-4 gap-4 p-4">
          {deck.map((cardId) => (
            <div className="w-full flex justify-center">
              <DeckCard cardId={cardId} isHand />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface DeckCardProps {
  cardId: number;
  isHand?: boolean;
}

function DeckCard({ cardId, isHand }: DeckCardProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const { card, removeCardFromDeck, addCardToDeck } = usePlayerStore(
    (state) => ({
      card: state.getCompletInfo(cardId),
      removeCardFromDeck: state.removeCardFromDeck,
      addCardToDeck: state.addCardToDeck,
    })
  );

  return (
    <>
      {isDescriptionOpen && (
        <CardModal
          cardId={card.id}
          closeModal={() => setIsDescriptionOpen(false)}
        />
      )}
      <div className="relative select-none h-min">
        <div className="" onClick={() => setIsDescriptionOpen(true)}>
          <CardBorder rarity={card.rarity} size={isHand ? 1.4 : 2}>
            <div className="w-full h-full flex flex-col relative">
              <CardContentIllustartion card={card} />
              <div className="absolute top-0 right-0">
                <svg
                  className="h-full absolute left-0 -translate-x-full"
                  viewBox="0 0 32 32"
                >
                  <polygon points="0,0 32,32 32,0" fill="black" />
                </svg>
                <div className=" bg-black text-white text-sm font-[stylised] leading-3 px-2 pl-1 py-[2px]">
                  1
                </div>
              </div>
            </div>
          </CardBorder>
          <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 scale-[65%]">
            <ManaBall mana={card.cost} />
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4">
          {card.isInDeck ? (
            <Button action={() => removeCardFromDeck(card.id)} small>
              <img src="/icons/minus.svg" alt="remove" className="w-4 h-4 m-1 my-2" />
            </Button>
          ) : (
            <Button action={preventDefault(() => addCardToDeck(card.id))} small>
              <img src="/icons/plus.svg" alt="add" className="w-4 h-4 m-1 my-2" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
