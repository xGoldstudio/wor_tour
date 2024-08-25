import { getImageUrl, ICONS, preventDefault } from "@repo/lib";
import {
  Button,
  CardBorder,
  CardContentIllustartion,
  cn,
  Cover,
  ManaBall,
} from "@repo/ui";
import { useState } from "react";
import CardModal from "./CardModal";
import { Tabs } from "./DeckInterface";
import { useEditionMode } from "./context/UseEditionMode";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { CardCollection } from "./cardFilters";

interface CardUIProps {
  cardId: number;
  isHand?: boolean;
  locked?: boolean;
  setCurrentTab?: (tab: Tabs) => void;
  setSelectedCard?: (id: number) => void;
  selectedCard?: number;
}

export function DeckCardUI({
  cardId,
  isHand,
  locked = false,
  setCurrentTab,
  setSelectedCard,
  selectedCard,
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
      isDeckFull: state.isDeckFull(),
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
      <div className={cn(isSelected ? "px-2 relative " : "pb-2 relative ")}>
        {isSelected && (
          <Cover
            cardRarity={card.rarity}
            className="rounded-lg blur-sm absolute "
            isSelected={isSelected}
          />
        )}
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
              isSelected ? setSelectedCard!(0) : setSelectedCard!(card.id),
                !isDeckFull && setEditionMode(true);
            }}
          >
            <CardBorder rarity={card.rarity} size={isHand ? 1.6 : 2}>
              <div
                className={`w-full h-full flex flex-col relative ${opacity}`}
              >
                <CardContentIllustartion
                  isSelected={isSelected}
                  card={card}
                  size={isHand ? 1.6 : 2}
                />
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
          {isSelected && (
            <div className="absolute z-20 w-full flex justify-center items-center   -bottom-[3.15rem] gap-x-3  ">
              <div className=" shadow-2xl group  rounded-lg ">
                <Cover
                  cardRarity={card.rarity}
                  className="rounded-lg blur-sm absolute "
                  isSelected={isSelected}
                  isButton={true}
                />
                <Button
                  small={true}
                  width="w-[3.6rem] "
                  className="h-10"
                  rarity={"rare"}
                  action={() => setIsDescriptionOpen(true)}
                >
                  <img
                    className="p-[0.25rem] group-hover:p-[0.15rem] transition-all duration-100 ease-in-out invert"
                    src={getImageUrl(ICONS, "/information-circle-no-bg.png")}
                    width={64}
                    height={64}
                    alt=""
                  />
                </Button>
              </div>
              <div className="group shadow-2xl">
                {!locked && (card as CardCollection).isInDeck ? (
                  <Button
                    small={true}
                    width="w-[3.6rem]"
                    className="h-10"
                    action={() => {
                      setEditionMode(true);
                      removeCardFromDeck(card.id);
                      setCurrentTab?.("Deck");
                    }}
                  >
                    <img
                      className="p-[0.25rem] group-hover:p-[0.15rem] transition-all duration-100 ease-in-out"
                      src={getImageUrl(ICONS, "/trash-no-bg.png")}
                      width={64}
                      height={64}
                      alt=""
                    />
                  </Button>
                ) : (
                  <Button
                    small={true}
                    width="w-[3.4rem]"
                    className="h-10"
                    disabled={isDeckFull}
                    action={preventDefault(() => {
                      addCardToDeck(card.id);
                      setCurrentTab?.("Deck");
                    })}
                  >
                    <img
                      className="p-[0.25rem] group-hover:p-[0.15rem] transition-all duration-100 ease-in-out"
                      src={getImageUrl(ICONS, "plus.svg")}
                      width={27}
                      height={27}
                      alt=""
                    />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
