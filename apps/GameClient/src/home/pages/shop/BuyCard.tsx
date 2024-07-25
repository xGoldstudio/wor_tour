import { DeckCard } from "@/game/gui/card/DeckCard";
import ConfirmationModal from "@/home/ui/ConfirmationModal";
import { useState } from "react";
import { priceByRarity, useBuyCard } from "@/home/store/shopStore";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { Box, Button, FullCard, GoldAmount, cn } from "@repo/ui";
import { CardType, getShardsFromLevel } from "@repo/lib";

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

  function openModal() {
    if (unavalaible || !canBuy) {
      return;
    }
    setIsConfirmationOpen(true);
  }

  return (
    <div className={cn("flex flex-col gap-2", unavalaible && "brightness-50")}>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        closeModal={() => setIsConfirmationOpen(false)}
        onConfirm={buyCard}
      >
        <FullCard
          card={card}
          size={1}
          cardShards={{
            shards: collectionCard?.shard ?? 0,
            maxShards: getShardsFromLevel(collectionCard?.level ?? 1),
          }}
          showEffectDesc
        />
        <Box cover="rare" rarity="legendary" height={150}>
          <p className="text-left p-4">
            Are you sure you want to buy{" "}
            <span className="font-stylised text-blue-500">
              {card.name} lv.{card.level}
            </span>{" "}
            for <GoldAmount amount={priceByRarity[card.rarity]} /> ?
          </p>
        </Box>
      </ConfirmationModal>
      <div onClick={openModal} className="cursor-pointer">
        <DeckCard card={card} size={2} />
      </div>
      <Button action={openModal} full small disabled={!canBuy || unavalaible}>
        <GoldAmount amount={priceByRarity[card.rarity]} />
      </Button>
    </div>
  );
}
