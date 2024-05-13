import { CardType } from "@/cards";
import CardBorder from "./CardBorder";

function StaticCard({
  card,
}: {
  card: CardType;
}) {
  return (
    <CardBorder rarity={card.rarity} size={1.35}>
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `url(/${card.id}.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </CardBorder>
  );
}

export default StaticCard;
