import { CardRarity, textureByRarity } from "@repo/lib";
import { cn } from "../lib/utils";

interface CoverProps {
  cardRarity: CardRarity;
  className?: string;
  isSelected?: boolean;
  isButton?: boolean;
}

export default function Cover({
  cardRarity,
  className,
  isSelected,
  isButton,
}: CoverProps) {
  return (
    <div
      className={cn(
        "absolute w-full h-full top-0 left-0 overflow-hidden",
        className,
        isSelected && "h-[calc(100%_+_15px)]  -top-2",
        isButton && "w-[calc(100%_+_15px)] -left-2"
      )}
    >
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
