import { CollectionCard } from "@/home/store/playerStore/playerStore";
import { FullCard } from "@repo/ui";
import { CardType } from "game_engine";

export default function CardDisplay({
  card,
  position,
  cardData,
}: {
  card: CardType;
  position: number;
  cardData?: CollectionCard;
}) {
  const translateX =
    position !== undefined
      ? (position !== 0 ? 50 : 0) + Math.max(0, Math.abs(position) - 1) * 65
      : 0;

  let cardShards:
    | {
        shards: number;
        maxShards: number;
      }
    | undefined = undefined;

  if (cardData !== undefined) {
    if (cardData.level === card.level) {
      if (card.level === 1) {
        cardShards = {
          shards: cardData.shard,
          maxShards: 3,
        };
      } else if (card.level === 2) {
        cardShards = {
          shards: cardData.shard,
          maxShards: 7,
        };
      }
    }
  }

  return (
    <div
      className={"absolute transition-all duration-500 ease-in-out"}
      style={
        position !== undefined
          ? {
              transform: `translateX(${
                -50 + (position >= 0 ? translateX : -translateX)
              }%) scale(${position === 0 ? 1 : 0.6})`,
              zIndex: position === 0 ? 1 : 0,
              opacity: Math.abs(position) <= 1 ? 1 : 0.5,
              filter: `brightness(${Math.abs(position) === 0 ? 1 : 0.5})`,
            }
          : {}
      }
    >
      <FullCard card={card} size={1} cardShards={cardShards} showEffectDesc={position === 0} />
    </div>
  );
}
