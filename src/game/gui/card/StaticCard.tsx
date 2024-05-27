import { CardType } from "@/cards";
import CardBorder, { CardContentIllustartion } from "./CardBorder";

function StaticCard({ card }: { card: CardType }) {
  const size = 1.35;

  return (
    <CardBorder rarity={card.rarity} size={size}>
      <CardContentIllustartion card={card} size={size} />
    </CardBorder>
  );
}

export default StaticCard;
