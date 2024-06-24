import { CardType } from "@repo/ui";
import CardBorder, {
  CardContentIllustartion,
} from "../../../../../../packages/ui/components/card/CardBorder";
import CardModal from "@/home/pages/deck/CardModal";
import { useState } from "react";

function StaticCard({
  card,
  size = 1.35,
  isDisabled = false,
}: {
  card: CardType;
  size?: number;
  isDisabled?: boolean;
}) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  return (
    <>
      {isDescriptionOpen && (
        <CardModal
          cardId={card.id}
          closeModal={() => setIsDescriptionOpen(false)}
        />
      )}
      <div onClick={() => setIsDescriptionOpen(true)} className="relative">
        <CardBorder rarity={card.rarity} size={size}>
          <CardContentIllustartion
            card={card}
            size={size}
            isDisabled={isDisabled}
          />
        </CardBorder>
      </div>
    </>
  );
}

export default StaticCard;
