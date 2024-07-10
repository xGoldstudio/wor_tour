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
          <img
            src="/icons/triangle.png"
            alt="arrow"
            width={40}
            height={40}
            className=""
          />
        </div>
      </div>
    </Button>
  );
}
