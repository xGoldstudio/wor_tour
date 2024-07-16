import { CardRarity } from "@repo/types";
import { cn, textureByRarity } from "@repo/ui";

interface CoverProps {
  cardRarity: CardRarity;
	className?: string;
}

export default function Cover({ cardRarity, className }: CoverProps) {
  return (
    <div className={cn("absolute w-full h-full top-0 left-0 overflow-hidden", className)}>
      <div
        className="absolute w-full h-full top-0 left-0 blur-sm"
        style={{
          backgroundImage: `url(/${textureByRarity(cardRarity)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}