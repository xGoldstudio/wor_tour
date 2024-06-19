import { CardType } from "@repo/ui";
import CardBorder, {
  CardContentIllustartion,
} from "../../../../../../packages/ui/components/card/CardBorder";

function StaticCard({ card, size = 1.35 }: { card: CardType, size?: number}) {
  return (
    <CardBorder rarity={card.rarity} size={size}>
      <CardContentIllustartion card={card} size={size} />
    </CardBorder>
  );
}

export default StaticCard;
