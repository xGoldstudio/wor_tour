import { collectionSortFilterService } from "@/services/inject";
import { Button, cn } from "@repo/ui";
import { ArrowBigUp } from "lucide-react";

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
          <ArrowBigUp />
        </div>
      </div>
    </Button>
  );
}
