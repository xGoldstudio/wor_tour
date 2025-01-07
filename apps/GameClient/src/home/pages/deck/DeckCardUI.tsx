import { preventDefault } from "@repo/lib";
import {
  Button,
  CARD_BORDER_HEIGHT,
  CARD_BORDER_WIDTH,
  CardBorder,
  CardContentIllustartion,
  cn,
  ManaBall,
  useOnClickOutside,
} from "@repo/ui";
import React, { useState } from "react";
import CardModal from "./CardModal";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { PlayerCardCollectionInfo } from "./cardFilters";
import { Info, Plus, Trash } from "lucide-react";
import { useEditionMode } from "./context/UseEditionMode";

export interface CardUIProps {
  card: PlayerCardCollectionInfo;
  size: number;
  deckCard?: boolean;
}

export function DeckCardUI({
  card,
  size,
  deckCard,
}: CardUIProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const { removeCardFromDeck, addCardToDeck } = usePlayerStore(
    (state) => ({
      removeCardFromDeck: state.removeCardFromDeck,
      addCardToDeck: state.addCardToDeck,
    })
  );
  const [isSelected, setIsSelected] = useState(false);
  const opacity = card.lockLabel !== null ? "brightness-[.70]" : "";
  const { setEditionMode } = useEditionMode();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapperRef, () => {
    setIsSelected(false);
  });

  return (
    <div>
      {isDescriptionOpen && (
        <CardModal
          cardId={card.id}
          closeModal={() => setIsDescriptionOpen(false)}
        />
      )}
      <div
        ref={wrapperRef}
        className={cn(
          `relative transition-transform`,
          isSelected && "z-50 scale-110"
        )}
        style={{
          width: `${size * CARD_BORDER_WIDTH}px`,
          height: `${size * CARD_BORDER_HEIGHT}px`,
        }}
      >
        <div className="absolute top-0 left-0">
          <div className={cn("relative select-none h-min  ")}>
            {card.lockLabel !== null && (
              <div
                className="absolute h-full w-full px-5 flex text-center text-sm justify-center items-center z-10"
                onClick={() => setIsDescriptionOpen(true)}
              >
                <span className="text-slate-200">{card.lockLabel}</span>
              </div>
            )}
            <div
              className={`${opacity} hover:cursor-pointer`}
              onClick={() => {
                setIsSelected(x => {
                  const next = !x;
                  if (deckCard) {
                    setEditionMode(next);
                  }
                  return next;
                });
              }}
            >
              <CardBorder rarity={card.rarity} size={size}>
                <div
                  className={`w-full h-full flex flex-col relative ${opacity}`}
                >
                  <CardContentIllustartion card={card} size={size} />
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
                {card.isInDeck ? (
                  <Button
                    full
                    hFull
                    rarity={"common"}
                    className="p-0"
                    action={() => {
                      removeCardFromDeck(card.id);
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
