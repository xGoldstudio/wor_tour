import { BoxModal } from "@/home/ui/modal";
import { cn } from "@repo/ui";

interface OrderBoxProps {
  isAscending?: boolean;
  setIsAscending?: (isAscending: boolean) => void;
}

export function OrderBox({ isAscending, setIsAscending }: OrderBoxProps) {
  return (
    <BoxModal>
      <div
        className={cn("whitespace-nowrap z-10 transition-all", {
          "-rotate-180": isAscending,
        })}
      >
        {setIsAscending && (
          <button onClick={() => setIsAscending(!isAscending)}>Sort</button>
        )}
      </div>
    </BoxModal>
  );
}
