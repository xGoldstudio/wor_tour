import usePlayerStore from "@/home/store/playerStore";
import { Button, cn, ManaBall, preventDefault } from "@repo/ui";
import { useState } from "react";
import CardBorder, {
  CardContentIllustartion,
} from "../../../../../../packages/ui/components/card/CardBorder";
import CardModal from "./CardModal";

interface CardUIProps {
  cardId: number;
  isHand?: boolean;
  unaddble?: boolean;
  locked?: boolean;
}

export function DeckCardUI({
  cardId,
  isHand,
  unaddble: addable,
  locked = false,
}: CardUIProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const { card, removeCardFromDeck, addCardToDeck, isDeckFull, lockPattern } =
    usePlayerStore((state) => ({
      card: state.getCompleteInfo(cardId),
      removeCardFromDeck: state.removeCardFromDeck,
      addCardToDeck: state.addCardToDeck,
      isDeckFull: state.isDeckFull(),
      lockPattern: state.getTheLockPattern(cardId),
    }));

  const opacity = locked ? "opacity-50" : "opacity-100";
  return (
    <>
      {isDescriptionOpen && (
        <CardModal
          cardId={card.id}
          closeModal={() => setIsDescriptionOpen(false)}
        />
      )}
      <div className={cn("relative select-none h-min ")}>
        {locked && (
          <div className="absolute h-full w-full px-4 flex justify-center items-center z-10">
            {lockPattern === 0
              ? "Not unlocked yet"
              : "Unlockable at world " + lockPattern}
          </div>
        )}
        <div
          className={`${opacity}`}
          onClick={() => setIsDescriptionOpen(true)}
        >
          <CardBorder rarity={card.rarity} size={isHand ? 1.6 : 2}>
            <div className={`w-full h-full flex flex-col relative ${opacity}`}>
              <CardContentIllustartion card={card} size={isHand ? 1.6 : 2} />
              <div className={`absolute top-0 right-0 ${opacity}`}>
                <svg
                  className="h-full absolute left-0 -translate-x-full"
                  viewBox="0 0 32 32"
                >
                  <polygon points="0,0 32,32 32,0" fill="black" />
                </svg>
                <div className=" bg-black text-white text-sm font-[stylised] leading-3 px-2 pl-1 py-[2px]">
                  {card.level}
                </div>
              </div>
            </div>
          </CardBorder>
          <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 scale-[65%]">
            <ManaBall mana={card.cost} />
          </div>
        </div>
        {!addable && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4">
            {card.isInDeck ? (
              <Button
                action={() => removeCardFromDeck(card.id)}
                small
                className="px-4 py-0"
              >
                <img
                  src="/icons/minus.svg"
                  alt="remove"
                  className="w-4 h-4 m-1 my-2"
                />
              </Button>
            ) : (
              <Button
                action={preventDefault(() => addCardToDeck(card.id))}
                small
                className="px-4 py-0"
                disabled={isDeckFull}
              >
                <img
                  src="/icons/plus.svg"
                  alt="add"
                  className="w-4 h-4 m-1 my-2"
                />
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
