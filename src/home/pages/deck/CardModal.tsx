import { CardType, getCardFromLevel, getCardStats } from "@/cards";
import { ManaBall } from "@/game/gui/ManaBar";
import CardBorder, {
  CardContentIllustartion,
  InnerBord,
} from "@/game/gui/card/CardBorder";
import { getImageEffects } from "@/game/gui/card/GameCard";
import { Button } from "@/home/Home";
import usePlayerStore, { CollectionCard } from "@/home/store/playerStore";
import Modal, { CoverModal } from "@/home/ui/modal";
import { preventDefault } from "@/lib/eventUtils";
import { cn } from "@/lib/utils";
import { useState } from "react";
import * as _ from "lodash";

interface CardModalProps {
  cardId: number;
  closeModal: () => void;
}

export function useScrollCardList(defaultPosition: number, numberOfCards: number) {
  const [isPressed, setIsPressed] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(defaultPosition);
  function changePosition(e: React.MouseEvent<HTMLDivElement>) {
    if (!isPressed) {
      return;
    }

    if (e.movementX > 0) {
      updatePosition(-1);
    } else if (e.movementX < 0) {
      updatePosition(1);
    }
  }

  function updatePosition(value: number) {
    setCurrentPosition((prev) => Math.max(0, Math.min(numberOfCards - 1, prev + value)));
    setIsPressed(false);
  }

  return {
    currentPosition,
    setIsPressed,
    changePosition,
  };
}

export default function CardModal({ closeModal, cardId }: CardModalProps) {
  const card = getCardStats(cardId);
  const collectionInfo = usePlayerStore((state) =>
    state.getCollectionInfo(cardId)
  );

  const { isPlayed, isDeckFull } = usePlayerStore((state) => ({
    isPlayed: state.isPlayed(cardId),
    isDeckFull: state.isDeckFull(),
  }));

  const { currentPosition, setIsPressed, changePosition } = useScrollCardList(
    collectionInfo.level - 1,
    3,
  );

  const isLevelOwned = collectionInfo.level > currentPosition;

  return (
    <Modal title={`card_${cardId}`} closeModal={closeModal}>
      <CoverModal closeModal={closeModal}>
        <div
          className="flex flex-col items-center gap-16 w-full h-full"
          onMouseDown={preventDefault(() => setIsPressed(true))}
          onMouseUp={preventDefault(() => setIsPressed(false))}
          onMouseMove={changePosition}
        >
          <div className="flex gap-3 rounded-sm bg-slate-900 px-3 py-2">
            {card.stats.map((_, index) => (
              <BulletPosition selected={index === currentPosition} key={`${_.cost}_${index}`} />
            ))}
          </div>
          <div className="relative h-[430px]">
            {card.stats.map((_, index) => (
              <FullCard
                key={`level_${index}`}
                card={getCardFromLevel(card, index + 1)}
                position={index - currentPosition}
                cardData={collectionInfo}
              />
            ))}
          </div>
          {isLevelOwned ? (
            isPlayed ? (
              <Button
                action={() =>
                  usePlayerStore.getState().removeCardFromDeck(cardId)
                }
              >
                Remove from deck
              </Button>
            ) : (
              <Button
                action={() => usePlayerStore.getState().addCardToDeck(cardId)}
                disabled={isDeckFull}
              >
                {isDeckFull ? "Deck is full" : "Play this card"}
              </Button>
            )
          ) : (
            <Button action={() => {}}>Buy more cards</Button>
          )}
        </div>
      </CoverModal>
    </Modal>
  );
}

function BulletPosition({ selected }: { selected: boolean }) {
  return (
    <div
      className={cn(
        "w-4 h-4 bg-slate-50 rounded-full shadow-[0px_0px_5px_0px_#fca5a5] ",
        !selected && "bg-slate-500 shadow-none"
      )}
    ></div>
  );
}

export function FullCard({
  card,
  position,
  cardData,
}: {
  card: CardType;
  position: number;
  cardData?: CollectionCard;
}) {
  const translateX =
    (position !== 0 ? 50 : 0) + Math.max(0, Math.abs(position) - 1) * 65;

  const effectToShow = getImageEffects(card.effects);

  let cardLevelStones: number[] = [];

  if (cardData?.level === card.level) {
    if (card.level === 1) {
      cardLevelStones = _.range(3);
    } else if (card.level === 2) {
      cardLevelStones = _.range(7);
    }
  }

  return (
    <div
      className="absolute transition-all duration-500 ease-in-out"
      style={{
        transform: `translateX(${
          -50 + (position >= 0 ? translateX : -translateX)
        }%) scale(${position === 0 ? 1 : 0.6})`,
        zIndex: position === 0 ? 1 : 0,
        opacity: Math.abs(position) <= 1 ? 1 : 0.5,
        filter: `brightness(${Math.abs(position) === 0 ? 1 : 0.5})`,
      }}
    >
      <div className="relative select-none w-min">
        <CardBorder rarity={card.rarity} size={5}>
          <div className="w-full h-full flex flex-col">
            <div className="absolute top-0 w-full h-full flex flex-col justify-between">
              <div>
                <div className="flex">
                  <InnerBord size={3}>
                    <div className="grow bg-slate-50 px-2 font-stylised text-xl h-min">
                      {card.name}
                    </div>
                  </InnerBord>
                  <div className="absolute right-0 z-10">
                    <svg
                      className="h-full absolute left-0 -translate-x-full"
                      viewBox="0 0 32 32"
                    >
                      <polygon points="0,0 32,32 32,0" fill="black" />
                    </svg>
                    <div className=" bg-black text-white text-[2rem] font-[stylised] leading-[2rem] px-4 pl-2 py-[5px]">
                      {card.level}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-full grow overflow-hidden relative pt-2 ">
                <div className="flex flex-col items-end gap-2 absolute top-5 z-10 right-2">
                  {effectToShow.map((effectSrc) => (
                    <div
                      className="p-2 bg-slate-100 border-2 border-black rounded-full shadow-[0px_0px_5px_0px_#fca5a5]"
                      key={effectSrc}
                    >
                      <img src={`/${effectSrc}`} width={22} height={22} />
                    </div>
                  ))}
                </div>
                <CardContentIllustartion card={card} size={3} />
              </div>
              {cardData && cardLevelStones.length > 0 && (
                <div className="pt-2 relative">
                  <div className="flex gap-2 justify-center">
                    {cardLevelStones.map((i) => (
                      <img
                        key={i}
                        id={`shard_${i}`}
                        src="/ruby.png"
                        className={cn(
                          "w-4 h-4 bg-transparent",
                          i % 2 ? "-translate-y-[3px]" : "",
                          i > cardData.shard - 1
                            ? "brightness-0"
                            : "drop-shadow-[1px_1px_1px_black]"
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 w-full pt-2 gap-2">
                <StatLine title="Force" value={card.dmg} />
                <StatLine title="Life" value={card.hp} />
                <StatLine title="Speed" value={card.attackSpeed} />
              </div>
            </div>
          </div>
        </CardBorder>
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 scale-[150%]">
          <ManaBall mana={card.cost} />
        </div>
      </div>
    </div>
  );
}

interface StateLineProps {
  className?: string;
  title: string;
  value: number;
}

function StatLine({ className, title, value }: StateLineProps) {
  return (
    <div className={cn("text-sm", className)}>
      <InnerBord size={3}>
        <div className=" bg-slate-50 flex pb-[2px] justify-between items-center flex-col">
          <p className="text-nowrap font-stylised text-base">{title}</p>
          <p className="font-stylised text-sm">{value}</p>
        </div>
      </InnerBord>
    </div>
  );
}
