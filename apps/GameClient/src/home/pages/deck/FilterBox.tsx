import {
  Button,
  cn,
  Cover,
  Popover,
  PopoverPortal,
  PopoverTrigger,
} from "@repo/ui";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  CardFilters,
  CardFilterSliderStyles,
  CardFiltersRange, FiltersDescription
} from "./cardFilters";
import { collectionSortFilterService } from "@/services/inject";
import { Check, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

export function FilterBox({ hasBeenFiltered }: { hasBeenFiltered: boolean }) {
  const currentFilter = collectionSortFilterService.useWatchFilter();

  const handleChange = (filterCriteria: CardFilters) => {
    collectionSortFilterService.updateFilters({
      ...currentFilter,
      [filterCriteria]: !currentFilter[filterCriteria],
    });
  };

  return (
    <Popover>
      <PopoverTrigger
        small={true}
        full={false}
        rarity={hasBeenFiltered ? "epic" : "rare"}
      >
        <div className="h-[20px] w-[20px] flex justify-center items-center ">
          <SlidersHorizontal />
        </div>
      </PopoverTrigger>
      <PopoverPortal position="bottom">
        <div className="w-[170px] shadow-sm rounded-sm overflow-hidden relative bg-slate-800">
          <Cover cardRarity="common" />
          <div className="m-1 rounded-sm overflow-hidden z-10 relative">
            <div className="w-full h-full absolute bg-slate-800 opacity-60"></div>
            <div className="flex flex-col gap-2 items-center text-white z-10 relative">
              <span className="pt-2">Filter</span>
              {Object.values(FiltersDescription).map((filterCriteria, index) =>
                filterCriteria.isButton ? (
                  <>
                    <div className="border-t-[1px] border-opacity-30 border-t-slate-300 w-full" />
                    <Button
                      key={index}
                      action={() =>
                        handleChange(filterCriteria.label as CardFilters)
                      }
                      unstyled
                      full
                    >
                      <div className="flex justify-start items-center gap-2 w-full pl-2 py-1">
                        <div className="rounded-sm relative bg-slate-100">
                          <Cover cardRarity="rare" />
                          <Check
                            className={cn(
                              currentFilter[filterCriteria.label] !== true &&
                                "opacity-0",
                              "text-slate-800 z-0 relative"
                            )}
                            strokeWidth={3}
                          />
                        </div>
                        {filterCriteria.label}
                      </div>
                    </Button>
                  </>
                ) : (
                  <DelayedSlider
                    filter={
                      currentFilter[filterCriteria.label] as {
                        min: number;
                        max: number;
                      }
                    }
                    label={filterCriteria.label as CardFiltersRange}
                    key={index}
                  />
                )
              )}
              <Button
                full
                small
                action={() => collectionSortFilterService.clearFilters()}
              >
                <span>Clear</span>
              </Button>
            </div>
          </div>
        </div>
      </PopoverPortal>
    </Popover>
  );
}

interface DelayedSliderProps {
  filter: { min: number; max: number };
  label: CardFiltersRange;
}

function getStyleForSlider(filterCriteria: CardFiltersRange) {
  return CardFilterSliderStyles[filterCriteria];
}

function DelayedSlider({ filter, label }: DelayedSliderProps) {
  const description = FiltersDescription[label];
  const [value, setValue] = useState<[number, number]>([
    filter.min,
    filter.max,
  ]);

  useEffect(() => {
    if (filter.min !== value[0] || filter.max !== value[1]) {
      setValue([filter.min, filter.max]);
    }
  }, [filter]);

  return (
    <div className="px-2 gap-2 border-t-[1px] border-opacity-30 border-t-neutral-300 w-full pt-1">
      <p className="text-center w-full">{description.label}</p>
      <div className="grid grid-cols-[15px_1fr_15px] gap-2 items-center justify-center">
        {[value[0]]}
        <Slider
          className="w-full"
          range
          count={1}
          min={description.rangeMin}
          max={description.rangeMax}
          onChange={(value) => {
            if (Array.isArray(value)) {
              setValue([value[0], value[1]]);
            }
          }}
          value={value}
          onChangeComplete={(value) => {
            if (Array.isArray(value))
              collectionSortFilterService.updateFilter(label, {
                min: value[0],
                max: value[1],
              });
          }}
          styles={getStyleForSlider(label)}
        />
        <div className="w-full text-right">{value[1]}</div>
      </div>
    </div>
  );
}
