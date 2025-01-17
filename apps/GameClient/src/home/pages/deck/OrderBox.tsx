import { collectionSortFilterService } from "@/services/inject";
import { getImageUrl, ICONS } from "@repo/lib";
import { Button, cn } from "@repo/ui";

export function OrderBox() {
  const isAscending = collectionSortFilterService.useWatchIsAscending();

  return (
    <Button action={collectionSortFilterService.toggleIsAscending} small={true}>
      <div
        className={cn("whitespace-nowrap z-10", {
          "-rotate-180": isAscending,
        })}
      >
        <div className="h-[20px] w-[20px] flex justify-center items-center ">
          <img
            src={getImageUrl(ICONS, "triangle.png")}
            alt="arrow"
            width={20}
            height={20}
          />
        </div>
      </div>
    </Button>
  );
}
