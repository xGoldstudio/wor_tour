import { CardType, getCardFromLevel, getCardStats } from "@/cards";
import { ManaBall } from "@/game/gui/ManaBar";
import CardBorder, {
  CardContentIllustartion,
} from "@/game/gui/card/CardBorder";
import { Button } from "@/home/Home";
import usePlayerStore from "@/home/store/playerStore";
import Modal from "@/home/ui/modal";
import { preventDefault } from "@/lib/eventUtils";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CardModalProps {
  cardId: number;
  closeModal: () => void;
}

export default function CardModal({ closeModal, cardId }: CardModalProps) {
  const card = getCardStats(cardId);
  const collectionInfo = usePlayerStore((state) =>
    state.getCollectionInfo(cardId)
  );
  const [currentPosition, setCurrentPosition] = useState(
    collectionInfo.level - 1
  );
  const [isPressed, setIsPressed] = useState(false);
  const { isPlayed, isDeckFull } = usePlayerStore((state) => ({
    isPlayed: state.isPlayed(cardId),
    isDeckFull: state.isDeckFull(),
  }));

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
    setCurrentPosition((prev) => Math.max(0, Math.min(2, prev + value)));
    setIsPressed(false);
  }

  return (
    <Modal title={`card_${cardId}`} closeModal={closeModal}>
      <div
        className="flex flex-col items-center gap-16 w-full h-full"
        onMouseDown={preventDefault(() => setIsPressed(true))}
        onMouseUp={preventDefault(() => setIsPressed(false))}
        onMouseMove={changePosition}
      >
        <div className="flex gap-3 rounded-sm bg-slate-900 px-3 py-2">
          {card.stats.map((_, index) => (
            <BulletPosition selected={index === currentPosition} />
          ))}
        </div>
        <div className="relative h-[430px]">
          {card.stats.map((_, index) => (
            <FullCard
              key={`level_${index}`}
              card={getCardFromLevel(card, index + 1)}
              position={index - currentPosition}
            />
          ))}
        </div>
        {isPlayed ? (
          <Button
            action={() => usePlayerStore.getState().removeCardFromDeck(cardId)}
          >
            Remove from deck
          </Button>
        ) : isDeckFull ? (
          <Button
            action={() => usePlayerStore.getState().addCardToDeck(cardId)}
          >
            Play this card
          </Button>
        ) : (
          <Button
            action={() => usePlayerStore.getState().addCardToDeck(cardId)}
          >
            Play this card
          </Button>
        )}
      </div>
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

function FullCard({ card, position }: { card: CardType; position: number }) {
  const translateX =
    (position !== 0 ? 50 : 0) + Math.max(0, Math.abs(position) - 1) * 65;

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
            <CardContentIllustartion card={card} />

            <div className="absolute top-0 right-0">
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
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 scale-125">
          <ManaBall mana={card.cost} />
        </div>
      </div>
    </div>
  );
}
