import { NumberSpan } from "@/game/gui/HpBar";
import { cn } from "@/lib/utils";

interface GoldAmountProps {
  amount: number;
  className?: string;
}

export function GoldAmount({ amount, className }: GoldAmountProps) {
  return (
    <span className={cn("inline-block", className)}>
      <NumberSpan>{amount}</NumberSpan>
      <div className="inline-block h-[18px] w-[20px] ml-1 relative bottom-[2px]">
        <img
          src="/money.png"
          className="h-[28px] inline-block"
        />
      </div>
    </span>
  );
}
