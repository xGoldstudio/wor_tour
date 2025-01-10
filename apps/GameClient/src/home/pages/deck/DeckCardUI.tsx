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
import { PlayerCardCollectionInfo } from "./cardFilters";
import { useEditionMode } from "./context/UseEditionMode";
import { useEditDeckActions } from "./context/EditionModeContext";

export interface CardUIProps {
  card: PlayerCardCollectionInfo;
  size: number;
  deckCard?: boolean;
  isSelectable?: boolean;
  parentScrollRef?: React.RefObject<HTMLDivElement>;
}

export function DeckCardUI({
  card,
  size,
  deckCard,
  isSelectable,
  parentScrollRef,
}: CardUIProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const { addCard, removeCard, replaceCard } = useEditDeckActions();
  const opacity = card.lockLabel !== null ? "brightness-[.70]" : "";
  const { setEditionMode } = useEditionMode();
  
  const wrapperRef = React.useRef<HTMLButtonElement>(null);
  const [isSelected, setIsSelected] = useState(false);
  useOnClickOutside(
    wrapperRef,
    () => {
      setIsSelected(false);
    },
    {
      watching: isSelected,
    }
  );

  const { replacingCard } = useEditionMode();

  function onSelected() {
    if (!parentScrollRef?.current || !wrapperRef.current) {
      return;
    }
    const threshold = 30;
    const top =
      wrapperRef.current.getBoundingClientRect().top +
      parentScrollRef.current.scrollTop -
      parentScrollRef.current.getBoundingClientRect().top -
      threshold;
    const bottom =
      wrapperRef.current.getBoundingClientRect().bottom +
      parentScrollRef.current.scrollTop -
      parentScrollRef.current.getBoundingClientRect().top +
      threshold +
      90;
    if (top < parentScrollRef.current.scrollTop) {
      parentScrollRef.current.scrollTo({
        top: top,
        behavior: "smooth",
      });
    } else if (
      bottom >
      parentScrollRef.current.scrollTop + parentScrollRef.current.clientHeight
    ) {
      parentScrollRef.current.scrollTo({
        top: bottom - parentScrollRef.current.clientHeight,
        behavior: "smooth",
      });
    }
  }

  return (
    <div
      className={cn("relative", isSelected && "z-50")}
      style={{
        width: `${size * CARD_BORDER_WIDTH}px`,
        height: `${size * CARD_BORDER_HEIGHT}px`,
      }}
    >
      {isDescriptionOpen && (
        <CardModal
          cardId={card.id}
          closeModal={() => setIsDescriptionOpen(false)}
        />
      )}
      <Button
        innerRef={wrapperRef}
        unstyled
        dontPreventPropagation
        action={() => {
          if (deckCard && replacingCard) {
            replaceCard(card.id);
          }
          if (isSelectable === false) return;
          setIsSelected((x) => {
            const next = !x;
            if (next) {
              onSelected();
            }
            if (deckCard) {
              setEditionMode(next);
            }
            return next;
          });
        }}
      >
        <div
          className={cn(
            `relative transition-transform rounded-sm`,
            replacingCard &&
              deckCard &&
              "animate-[wiggle_500ms_ease-in-out_infinite] shadow-[0px_0px_6px_4px_rgba(8,72,201,0.9)]"
          )}
          style={{
            width: `${size * CARD_BORDER_WIDTH}px`,
            height: `${size * CARD_BORDER_HEIGHT}px`,
          }}
        >
          <div className="absolute top-0 left-0 grid grid-cols-1 gap-2 backdrop-blur-sm">
            {isSelected && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-300 opacity-90 rounded-sm"
                style={{
                  width: `calc(100% + ${0.3 * CARD_BORDER_WIDTH}px)`,
                  height: `calc(100% + ${0.3 * CARD_BORDER_WIDTH}px)`,
                }}
              ></div>
            )}
            <div className={cn("relative select-none h-min")}>
              {card.lockLabel !== null && (
                <div
                  className="absolute h-full w-full px-5 flex text-center text-sm justify-center items-center z-10"
                  onClick={() => setIsDescriptionOpen(true)}
                >
                  <span className="text-slate-200">{card.lockLabel}</span>
                </div>
              )}
              <div className={`${opacity} hover:cursor-pointer`}>
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
            </div>
            {isSelected && (
              <>
                <Button
                  full
                  rarity={"epic"}
                  className="p-1"
                  action={() => setIsDescriptionOpen(true)}
                >
                  Info
                </Button>
                {card.isInDeck ? (
                  <Button
                    full
                    rarity={"common"}
                    className="p-1"
                    action={() => {
                      removeCard(card.id);
                    }}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    full
                    rarity={"rare"}
                    action={preventDefault(() => {
                      addCard(card.id);
                    })}
                    className="p-1"
                  >
                    Use
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </Button>
    </div>
  );
}
