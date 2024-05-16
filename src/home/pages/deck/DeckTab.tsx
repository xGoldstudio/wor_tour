import findCard, { CardType } from "@/cards";
import { ManaBall } from "@/game/gui/ManaBar";
import CardBorder from "@/game/gui/card/CardBorder";
import { Button } from "../../Home";
import ScrollContainer from "react-indiana-drag-scroll";
import { useState } from "react";
import CardModal from "./CardModal";

export default function DeckTab() {
  return (
    <div className="w-full gap-4 grid grid-rows-[auto_1fr] absolute top-0 h-full">
      <div className="bg-slate-200 w-full p-4 flex justify-center">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
            <div className="w-full flex justify-center">
              <DeckCard card={findCard(7)} />
            </div>
          ))}
        </div>
      </div>

      <ScrollContainer className="grow overflow-y-scroll pt-2 scrollbar-hide flex justify-center">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6].map((id) => (
            <div className="w-full flex justify-center">
              <DeckCard card={findCard(id)} />
            </div>
          ))}
        </div>
      </ScrollContainer>
    </div>
  );
}

interface DeckCardProps {
  card: CardType;
}

function DeckCard({ card }: DeckCardProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  return (
    <>
      {isDescriptionOpen && (
       <CardModal card={card} closeModal={() => setIsDescriptionOpen(false)} />
      )}
      <div
        className="relative select-none"
        onClick={() => setIsDescriptionOpen(true)}
      >
        <CardBorder rarity={card.rarity} size={1.5}>
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
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 scale-[65%]">
          <ManaBall mana={card.cost} />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4">
          <Button action={() => {}} small>
            +
          </Button>
        </div>
      </div>
    </>
  );
}