import { CardType } from "@/cards";
import { ManaBall } from "../ManaBar";
import CardBorder, { CardContentIllustartion } from "./CardBorder";

interface DeckCardProps {
	card: CardType;
	size: number;
}

export function DeckCard({ card, size }: DeckCardProps) {
  return (
    <div className="relative">
      <CardBorder rarity={card.rarity} size={size}>
        <div className="w-full h-full flex flex-col relative">
          <CardContentIllustartion card={card} size={size} />
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
      <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 scale-[65%]">
        <ManaBall mana={card.cost} />
      </div>
    </div>
  );
}
