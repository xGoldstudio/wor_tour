import { CardType } from "@repo/ui";
import CardBorder, {
  CardContentIllustartion,
} from "../../../../../../packages/ui/components/card/CardBorder";

function StaticCard({ card, size = 1.35, isDisabled = false }: { card: CardType, size?: number, isDisabled?: boolean }) {
  return (
    <CardBorder rarity={card.rarity} size={size}>
      <CardContentIllustartion card={card} size={size} isDisabled={isDisabled} />
    </CardBorder>
  );
}

export default StaticCard;
