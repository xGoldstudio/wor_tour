import { DeckCard } from "@/game/gui/card/DeckCard";
import ConfirmationModal from "@/home/ui/ConfirmationModal";
import { useState } from "react";
import { priceByRarity, useBuyCard } from "@/home/store/shopStore";
import usePlayerStore from "@/home/store/playerStore";
import { Button, CardType, GoldAmount, cn } from "@repo/ui";

interface BuyCardProps {
  card: CardType;
}

export default function BuyCard({ card }: BuyCardProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { buyCard, canBuy, hasBeenBought } = useBuyCard(card.id);
  const collectionCard = usePlayerStore((state) =>
    state.collection.get(card.id)
  );

  const unavalaible =
    hasBeenBought !== undefined || collectionCard?.level === 3;

  return (
    <div className={cn("flex flex-col gap-2", unavalaible && "brightness-50")}>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        closeModal={() => setIsConfirmationOpen(false)}
        onConfirm={buyCard}
      >
        <p className="text-left">
          Are you sure you want to buy{" "}
          <span className="font-stylised text-blue-500">
            {card.name} lv.{card.level}
          </span>{" "}
          for <GoldAmount amount={priceByRarity[card.rarity]} /> ?
        </p>
      </ConfirmationModal>
      <div
        onClick={() => {
          if (unavalaible) {
            return;
          }
          setIsConfirmationOpen(true);
        }}
        className="cursor-pointer"
      >
        <DeckCard card={card} size={2} />
      </div>
      <Button
        action={() => setIsConfirmationOpen(true)}
        full
        small
        disabled={!canBuy || unavalaible}
      >
        <GoldAmount amount={priceByRarity[card.rarity]} />
      </Button>
    </div>
  );
}
