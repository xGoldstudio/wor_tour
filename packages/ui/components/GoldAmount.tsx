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
        <img src="/money.png" className="h-[22px] inline-block" />
      </span>
    </span>
  );
}
