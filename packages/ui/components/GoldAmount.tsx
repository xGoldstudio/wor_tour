import { getImageUrl, ICONS } from "@repo/lib";
import { cn } from "../lib/utils";
import NumberSpan from "./NumberSpan";

interface GoldAmountProps {
  amount: number;
  className?: string;
}

export default function GoldAmount({ amount, className }: GoldAmountProps) {
  return (
    <span className={cn("inline-block", className)}>
      <NumberSpan>{amount}</NumberSpan>
      <span className="inline-block ml-1 relative bottom-[2px]">
        <img src={getImageUrl(ICONS, "/money.png")} className="h-[22px] min-w-[22px] inline-block" />
      </span>
    </span>
  );
}
