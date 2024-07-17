import { cn } from "../lib/utils";
import textureByRarity from "../lib/textureByRarity";
import { CardRarity } from "../types/DataStoreType";

interface BadgeProps {
  value: string;
  className?: string;
  rarity?: CardRarity;
}

export default function Badge({
  className,
  value,
  rarity = "rare",
}: BadgeProps) {
  return (
    <div
      className={cn(
        "w-[28px] h-[28px] flex justify-center items-center text-xl drop-shadow-[2px_1px_1px_black] font-stylised text-white rounded-full overflow-hidden bg-black",
        rarity === "rare" && "text-slate-600",
        className,
      )}
    >
      <div
        className="absolute w-full h-full blur-[1px] left-0 top-0 rounded-full"
        style={{
          backgroundImage: `url('/${textureByRarity(rarity)}')`,
          backgroundSize: "cover",
          backgroundPositionY: "center",
        }}
      />
      <p className="relative">{value}</p>
    </div>
  );
}
