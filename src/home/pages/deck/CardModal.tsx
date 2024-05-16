import { CardType } from "@/cards";
import { ManaBall } from "@/game/gui/ManaBar";
import CardBorder from "@/game/gui/card/CardBorder";
import { Button } from "@/home/Home";
import Modal from "@/home/ui/modal";
import { preventDefault } from "@/lib/eventUtils";
import { useState } from "react";

interface CardModalProps {
  card: CardType;
  closeModal: () => void;
}

export default function CardModal({ closeModal, card }: CardModalProps) {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

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
    <Modal title={`card_${card.id}`} closeModal={closeModal}>
      <div
        className="flex flex-col items-center gap-16 w-full h-full"
        onMouseDown={preventDefault(() => setIsPressed(true))}
        onMouseUp={preventDefault(() => setIsPressed(false))}
        onMouseMove={changePosition}
      >
        <div className="flex gap-3 rounded-md bg-slate-900 px-3 py-2">
          <div className="w-4 h-4 bg-slate-50 rounded-full shadow-[0px_0px_5px_0px_#fca5a5]"></div>
          <div className="w-4 h-4 bg-slate-50 rounded-full shadow-[0px_0px_5px_0px_#fca5a5]"></div>
          <div className="w-4 h-4 bg-slate-50 rounded-full shadow-[0px_0px_5px_0px_#fca5a5]"></div>
        </div>
        <div className="relative h-[430px]">
          {[0, 1, 2].map((index) => (
            <FullCard
              card={card}
              position={index - currentPosition}
            />
          ))}
        </div>
				<Button action={closeModal}>Play this card</Button>
      </div>
    </Modal>
  );
}

function FullCard({
  card,
  position,
}: {
  card: CardType;
  position: number;
}) {
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
            <div
              className="w-full grow relative"
              style={{
                backgroundImage: `url(/${card.id}.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>

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
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3">
          <ManaBall mana={card.cost} />
        </div>
      </div>
    </div>
  );
}
