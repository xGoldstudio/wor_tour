import { getImageUrl, ICONS } from "@repo/lib";
import { Button, cn } from "@repo/ui";

interface OrderBoxProps {
  isAscending: boolean;
  setIsAscending: (isAscending: boolean) => void;
}

export function OrderBox({ isAscending, setIsAscending }: OrderBoxProps) {
  return (
    <Button
      action={() => setIsAscending(!isAscending)}
      small={true}
      full={false}
    >
      <div
        className={cn("whitespace-nowrap z-10 transition-all", {
          "-rotate-180": isAscending,
        })}
      >
        <div className="h-6 w-6 flex justify-center items-center ">
          <img src={getImageUrl(ICONS, "triangle.png")} alt="arrow" width={40} height={40} />
        </div>
      </div>
    </Button>
  );
}
