import { cn } from "../lib/utils";
import NumberSpan from "./NumberSpan";

interface XpAmountProps {
  amount: number;
  className?: string;
}

export default function XpAmount({ amount, className }: XpAmountProps) {
  return (
    <span className={cn("inline-block", className)}>
      <NumberSpan>{amount}</NumberSpan>
      <span className="ml-1 font-stylised">XP</span>
    </span>
  );
}
