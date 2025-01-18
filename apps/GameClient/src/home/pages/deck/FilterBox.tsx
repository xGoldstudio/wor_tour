import { Button, Popover, PopoverPortal, PopoverTrigger } from "@repo/ui";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  CardFilters,
  CardFilterSliderStyles,
  CardFiltersStyles,
  defaultFilters,
  FiltersDescription,
} from "./cardFilters";
import { getImageUrlCssValue, ICONS } from "@repo/lib";
import { collectionSortFilterService } from "@/services/inject";
import { SlidersHorizontal } from "lucide-react";

export function FilterBox() {
  const currentFilter = collectionSortFilterService.useWatchFilter();

  const handleChange = (filterCriteria: CardFilters) => {
    collectionSortFilterService.updateFilters({
      ...currentFilter,
      [filterCriteria]: !currentFilter[filterCriteria],
    });
  };
  const isActiveFilter = (filterCriteria: CardFilters) => {
    if (currentFilter[filterCriteria] === true) {
      return {
        backgroundImage: getImageUrlCssValue(ICONS, "valid.png"),
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return;
  };

  function getStyleForSlider(filterCriteria: CardFiltersStyles) {
    return CardFilterSliderStyles[filterCriteria];
  }
  function getdefaultValuesForSlider(filterCriteria: CardFiltersStyles) {
    const usingFilter = currentFilter[filterCriteria];
    return [
      typeof usingFilter === "object" && typeof usingFilter.min === "number"
        ? usingFilter.min
        : FiltersDescription[filterCriteria].rangeMin!,
      typeof usingFilter === "object" && typeof usingFilter.max === "number"
        ? usingFilter.max
        : FiltersDescription[filterCriteria].rangeMax!,
    ];
  }

  function getMinValueForSlider(filterCriteria: CardFiltersStyles) {
    const usingFilter = currentFilter[filterCriteria];
    return typeof usingFilter === "object" &&
      typeof usingFilter.min === "number"
      ? usingFilter.min
      : FiltersDescription[filterCriteria].rangeMin;
  }
  function getMaxValueForSlider(filterCriteria: CardFiltersStyles) {
    const usingFilter = currentFilter[filterCriteria];
    return typeof usingFilter === "object" &&
      typeof usingFilter.max === "number"
      ? usingFilter.max
      : FiltersDescription[filterCriteria].rangeMax;
  }

  return (
    <Popover>
      <PopoverTrigger small={true} full={false} rarity={currentFilter === defaultFilters ? "rare" : "epic"}>
        <div className="h-[20px] w-[20px] flex justify-center items-center ">
          <SlidersHorizontal />
        </div>
      </PopoverTrigger>
      <PopoverPortal position="bottom">
        <div className="w-[170px] bg-[#406799] border-white border-2 rounded-md flex flex-col gap-2 items-center text-white overflow-hidden">
          <span className="pt-2">Filter</span>
          {Object.values(FiltersDescription).map((filterCriteria, index) =>
            filterCriteria.isButton ? (
              <>
                <div className="border-t-[1px] border-opacity-30 border-t-neutral-300 w-full" />
                <Button
                  key={index}
                  action={() =>
                    handleChange(filterCriteria.label as CardFilters)
                  }
                  unstyled
                  full
                >
                  <div className="flex justify-start items-center gap-2 w-full pl-2 py-1">
                    <div
                      style={isActiveFilter(
                        filterCriteria.label as CardFilters
                      )}
                      className="p-3 bg-[#284673] rounded-lg hover:bg-blue-700"
                    />
                    {filterCriteria.label}
                  </div>
                </Button>
              </>
            ) : (
              <div
                key={index}
                className="px-3 gap-2 border-t-[1px] border-opacity-30 border-t-neutral-300 w-full pl-1 pt-1"
              >
                <span className="ml-10">{filterCriteria.label}</span>
                <div className="flex mx-2 justify-center items-center">
                  {getMinValueForSlider(
                    filterCriteria.label as CardFiltersStyles
                  )}
                  <Slider
                    className="w-8/12 mx-auto"
                    range
                    count={1}
                    min={FiltersDescription[filterCriteria.label].rangeMin}
                    max={FiltersDescription[filterCriteria.label].rangeMax}
                    defaultValue={getdefaultValuesForSlider(
                      filterCriteria.label as CardFiltersStyles
                    )}
                    onChange={(value) => {
                      if (Array.isArray(value))
                        collectionSortFilterService.updateFilters({
                          ...currentFilter,
                          [filterCriteria.label]: {
                            min: value[0],
                            max: value[1],
                          },
                        });
                    }}
                    styles={getStyleForSlider(
                      filterCriteria.label as CardFiltersStyles
                    )}
                  />
                  {getMaxValueForSlider(
                    filterCriteria.label as CardFiltersStyles
                  )}
                </div>
              </div>
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
      </PopoverPortal>
    </Popover>
  );
}
