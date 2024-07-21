import usePlayerStore from "@/home/store/playerStore";
import {
  Button,
  CardBorder,
  CardContentIllustartion,
  Cover,
  ManaBall,
} from "@repo/ui";
import { useState } from "react";
import CardModal from "./CardModal";
import { preventDefault } from "@repo/lib";
import { cn } from "@repo/ui";
import { Tabs } from "./DeckInterface";

interface CardUIProps {
  cardId: number;
  isHand?: boolean;
  unaddble?: boolean;
  locked?: boolean;
  setCurrentTab?: (tab: Tabs) => void;
  setSelectedCard?: (cardId: number) => void;
  selectedCard?: number;
}

export function DeckCardUI({
  cardId,
  isHand,
  unaddble: addable,
  locked = false,
  setCurrentTab,
  setSelectedCard,
  selectedCard,
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

  const isSelected = selectedCard === card.id;

  const opacity = locked ? "brightness-50" : "opacity-100";
  return (
    <>
      {isDescriptionOpen && (
        <CardModal
          cardId={card.id}
          closeModal={() => setIsDescriptionOpen(false)}
        />
      )}
      <div className="relative p-2">
        {isSelected && (
          <Cover cardRarity={"common"} className="rounded-lg blur-sm" />
        )}
        <div className={cn("relative select-none h-min  ")}>
          {locked && (
            <div
              className="absolute h-full w-full px-10 flex justify-center items-center z-10"
              onClick={() => setIsDescriptionOpen(true)}
            >
              {lockPattern === 0 ? (
                <span className="text-white opacity-60">Not unlocked yet</span>
              ) : (
                <span className="text-white opacity-60">
                  {" "}
                  Unlockable at world {lockPattern}
                </span>
              )}
            </div>
          )}
          <div
            className={`${opacity} `}
            onClick={() => {
              // setIsDescriptionOpen(true);
              setSelectedCard?.(card.id);
            }}
          >
            <CardBorder rarity={card.rarity} size={isHand ? 1.6 : 2}>
              <div
                className={`w-full h-full flex flex-col relative ${opacity}`}
              >
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
              {/* {card.isInDeck ? (
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
                  action={preventDefault(() => {
                    addCardToDeck(card.id);
                    setCurrentTab?.("Deck");
                  })}
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
              )} */}
            </div>
          )}
          {/* <div className="relative w-full  "> */}
          {/*  */}
          {/* {isSelected && (
            <div className="absolute z-20 w-full flex justify-center items-center flex-col pt-1 bottom-2">
              <div className=" shadow-2xl">
                <Button
                  small={true}
                  width="w-28 "
                  rarity={card.rarity}
                  action={() => setIsDescriptionOpen(true)}
                >
                  Infos
                </Button>
              </div>
              <div className="relative    shadow-2xl">
                <Button
                  small={true}
                  width="w-28"
                  action={() => removeCardFromDeck(card.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          )} */}
          {isSelected && (
            <div className="absolute z-20 w-full flex justify-center items-center  pt-1 bottom-2  ">
              <div className=" shadow-2xl group">
                <Button
                  small={true}
                  width="w-[3.4rem] "
                  rarity={card.rarity}
                  action={() => setIsDescriptionOpen(true)}
                >
                  <img
                    className="p-[0.25rem] group-hover:p-[0.15rem]"
                    src="/information-circle-no-bg.png"
                    width={30}
                    height={30}
                    alt=""
                  />
                </Button>
              </div>
              <div className="group shadow-2xl">
                {card.isInDeck ? (
                  <Button
                    small={true}
                    width="w-[3.4rem]"
                    action={() => removeCardFromDeck(card.id)}
                  >
                    <img
                      className="p-[0.25rem] group-hover:p-[0.15rem]"
                      src="/trash-no-bg.png"
                      width={27}
                      height={27}
                      alt=""
                    />
                  </Button>
                ) : (
                  <Button
                    small={true}
                    width="w-[3.4rem]"
                    disabled={isDeckFull}
                    action={preventDefault(() => {
                      addCardToDeck(card.id);
                      setCurrentTab?.("Deck");
                    })}
                  >
                    <img
                      className="p-[0.25rem] group-hover:p-[0.15rem]"
                      src="/icons/plus.svg"
                      width={27}
                      height={27}
                      alt=""
                    />
                  </Button>
                )}
                {/* <Button
                  small={true}
                  width="w-[3.4rem]"
                  action={() => removeCardFromDeck(card.id)}
                >
                  <img
                    className="p-[0.25rem] group-hover:p-[0.15rem]"
                    src="/trash-no-bg.png"
                    width={27}
                    height={27}
                    alt=""
                  />
                </Button> */}
              </div>
            </div>
          )}
        </div>
        {/* </div> */}
      </div>
    </>
  );
}
