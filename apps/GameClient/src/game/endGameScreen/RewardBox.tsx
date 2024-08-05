import { cn, Cover } from "@repo/ui";

interface RewardBoxProps {
  children: React.ReactNode;
  amount: number | string;
}

export default function RewardBox({ children, amount }: RewardBoxProps) {
  return (
    <div
      className={cn("rounded-sm overflow-hidden relative w-[100px] h-[100px]")}
    >
      <Cover cardRarity={"rare"} className=" bg-slate-50" />
      <div className="relative w-full h-full flex justify-center items-center">
        {children}
      </div>
      <div className="absolute w-min bottom-2 z-10 px-2 rounded-md overflow-hidden bg-slate-50 left-1/2 -translate-x-1/2">
        <Cover cardRarity="rare" />
        <p className="relative font-bold text-center">{typeof amount === "number" && amount > 0 ? "+" : ""}{amount}</p>
      </div>
    </div>
  );
}
