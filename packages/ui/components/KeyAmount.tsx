import { cn } from "../lib/utils";
import NumberSpan from "./NumberSpan";

interface KeyAmountProps {
  amount: number;
  className?: string;
}

export default function KetAmount({ amount, className }: KeyAmountProps) {
  return (
    <span className={cn("inline-block", className)}>
      <NumberSpan>{amount}</NumberSpan>
      <span className="inline-block relative bottom-[2px]">
        <img src="/key.png" className="h-[22px] min-w-[22px] inline-block" />
      </span>
    </span>
  );
}
