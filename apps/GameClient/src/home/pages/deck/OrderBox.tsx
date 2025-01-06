import { getImageUrl, ICONS } from "@repo/lib";
import { Button, cn } from "@repo/ui";

interface OrderBoxProps {
  isAscending: boolean;
  toggleIsAscending: () => void;
}

export function OrderBox({ isAscending, toggleIsAscending }: OrderBoxProps) {
  return (
    <Button
      action={toggleIsAscending}
      small={true}
    >
      <div
        className={cn("whitespace-nowrap z-10 transition-all", {
          "-rotate-180": isAscending,
        })}
      >
        <div className="h-[20px] w-[20px] flex justify-center items-center ">
          <img src={getImageUrl(ICONS, "triangle.png")} alt="arrow" width={20} height={20} />
        </div>
      </div>
    </Button>
  );
}
