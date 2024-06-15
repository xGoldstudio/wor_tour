import { CardRarity } from "@repo/types";
import { textureByRarity } from "@repo/ui";

interface CoverProps {
	cardRarity: CardRarity;
}

export default function Cover({ cardRarity }: CoverProps) {
  return (
    <div
      className="absolute w-full h-full top-0 left-0 blur-sm"
      style={{
        backgroundImage: `url(/${textureByRarity(cardRarity)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}
