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
      <span className="inline-block h-[18px] w-[20px] ml-1 relative bottom-[2px]">
        <img src="/money.png" className="h-[28px] inline-block" />
      </span>
    </span>
  );
}
