import { preventDefault } from "@repo/lib";
import {
  Button,
  CardBorder,
  CardContentIllustartion,
  cn,
  ManaBall,
} from "@repo/ui";
import { useState } from "react";
import CardModal from "./CardModal";
import { Tabs } from "./DeckInterface";
import { useEditionMode } from "./context/UseEditionMode";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { CardCollection } from "./cardFilters";
import { Info, Plus, Trash } from "lucide-react";

interface CardUIProps {
  cardId: number;
  locked?: boolean;
  setCurrentTab?: (tab: Tabs) => void;
  setSelectedCard?: (id: number) => void;
  selectedCard?: number;
  size?: number;
}

export function DeckCardUI({
  cardId,
  locked = false,
  setCurrentTab,
  setSelectedCard,
  selectedCard,
  size = 1,
}: CardUIProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const { setEditionMode } = useEditionMode();

  const { card, removeCardFromDeck, addCardToDeck, isDeckFull, lockPattern } =
    usePlayerStore((state) => ({
      card: locked
        ? state.getLockedCardInfo(cardId)
        : state.getCompleteInfo(cardId),
      removeCardFromDeck: state.removeCardFromDeck,
      addCardToDeck: state.addCardToDeck,
      isDeckFull: state.isDeckFull,
      lockPattern: state.getTheLockPattern(cardId),
    }));
  const isSelected = selectedCard === card.id;
  const opacity = locked ? "brightness-[.70]" : "";
  return (
    <div>
      {isDescriptionOpen && (
        <CardModal
          cardId={card.id}
          closeModal={() => setIsDescriptionOpen(false)}
        />
      )}
      <div
        className={cn(
          `relative transition-transform`,
          isSelected && "z-50 scale-110"
        )}
        style={{
          width: `${size * 128}px`,
          height: `${size * 178}px`,
        }}
      >
        <div className="absolute top-0 left-0">
          <div className={cn("relative select-none h-min  ")}>
            {locked && (
              <div
                className="absolute h-full w-full px-5 flex text-center text-sm justify-center items-center z-10"
                onClick={() => setIsDescriptionOpen(true)}
              >
                {lockPattern === 0 ? (
                  <span className="text-slate-200">Not unlocked yet</span>
                ) : (
                  <span className="text-slate-200">
                    {" "}
                    Unlockable at world {lockPattern}
                  </span>
                )}
              </div>
            )}
            <div
              className={`${opacity} hover:cursor-pointer`}
              onClick={() => {
                if (setSelectedCard === undefined) {
                  setIsDescriptionOpen(true);
                  return;
                }
                if (isSelected) {
                  setSelectedCard(0);
                } else {
                  setSelectedCard!(card.id);
                  if (!isDeckFull) {
                    setEditionMode(true);
                  }
                }
              }}
            >
              <CardBorder rarity={card.rarity} size={size * 2}>
                <div
                  className={`w-full h-full flex flex-col relative ${opacity}`}
                >
                  <CardContentIllustartion card={card} size={size * 2} />
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
            <div
              className={cn(
                "z-20 w-full grid-cols-2 gap-2 py-2 h-12 opacity-0 hidden",
                isSelected && "opacity-100 grid"
              )}
            >
              <div className="shadow-2xl group rounded-lg w-full h-full">
                <Button
                  full
                  hFull
                  rarity={"rare"}
                  className="p-0"
                  action={() => setIsDescriptionOpen(true)}
                >
                  <Info strokeWidth={2} className="my-1" />
                </Button>
              </div>
              <div className={"shadow-2xl group rounded-lg w-full h-full"}>
                {!locked && (card as CardCollection).isInDeck ? (
                  <Button
                    full
                    hFull
                    rarity={"common"}
                    className="p-0"
                    action={() => {
                      removeCardFromDeck(card.id);
                      setCurrentTab?.("Deck");
                    }}
                  >
                    <Trash strokeWidth={2} />
                  </Button>
                ) : (
                  <Button
                    full
                    hFull
                    rarity={"rare"}
                    action={preventDefault(() => {
                      addCardToDeck(card.id);
                      setCurrentTab?.("Deck");
                    })}
                    className="p-0"
                  >
                    <Plus strokeWidth={2} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
