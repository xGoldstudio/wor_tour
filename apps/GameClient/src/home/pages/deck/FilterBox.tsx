import { Button } from "@repo/ui";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useEffect, useRef, useState } from "react";
import {
  ActiveFilters,
  CardFilters,
  CardFilterSliderStyles,
  CardFiltersStyles,
  FiltersDescription,
} from "./cardFilters";

interface OutsideClickHandlerProps {
  children: React.ReactNode;
  onOutsideClick: () => void;
}

function OutsideClickHandler({
  children,
  onOutsideClick,
}: OutsideClickHandlerProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        onOutsideClick();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOutsideClick();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  });

  return (
    <div className="absolute flex items-center justify-center" ref={wrapperRef}>
      {children}
    </div>
  );
}

interface FilterBoxProps {
  setCurrentFilter: (filter: ActiveFilters) => void;
  currentFilter: ActiveFilters;
}

export function FilterBox({ setCurrentFilter, currentFilter }: FilterBoxProps) {
  const [filterIsOpen, setFilterIsOpen] = useState(false);

  const handleChange = (filterCriteria: CardFilters) => {
    setCurrentFilter({
      ...currentFilter,
      [filterCriteria]: !currentFilter[filterCriteria],
    });
  };
  const isActiveFilter = (filterCriteria: CardFilters) => {
    if (currentFilter[filterCriteria] === true) {
      return {
        backgroundImage: `url(valid.png)`,
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
    <>
      <Button
        small={true}
        full={false}
        action={() => {
          setFilterIsOpen(!filterIsOpen);
        }}
      >
        <div className="h-6 w-6 flex justify-center items-center ">
          <img
            src="/icons/filter.png"
            alt="gear-wheel"
            width={40}
            height={40}
          />
        </div>
      </Button>
      {filterIsOpen && (
        <OutsideClickHandler onOutsideClick={() => setFilterIsOpen(false)}>
          <div className="absolute -left-[82px] top-14 z-20 flex flex-col items-center justify-center -mt-8 ">
            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-transparent border-b-white " />
            <div className="h-[371px] w-[170px] bg-[#406799] border-white border-2 rounded-md flex flex-col gap-2 items-center text-white">
              <span className="pt-2">Filter</span>
              {Object.values(FiltersDescription).map((filterCriteria, index) =>
                filterCriteria.isButton ? (
                  <div className="flex justify-start items-center gap-2 border-t-[1px] border-opacity-30 border-t-neutral-300 w-full pl-2 pt-2">
                    <button
                      key={index}
                      value={filterCriteria.label}
                      onClick={() => handleChange(filterCriteria.label)}
                      style={isActiveFilter(
                        filterCriteria.label as CardFilters
                      )}
                      className="p-3 bg-[#284673] rounded-lg hover:bg-blue-700"
                    />
                    <div className="pl-1 pb-1">{filterCriteria.label}</div>
                  </div>
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
                            setCurrentFilter({
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
              <div className="w-full h-full flex justify-center items-center border-t-neutral-300 border-t-[1px] border-opacity-30 bg-[#1E3E5B] rounded-b-md">
                <button className="" onClick={() => setFilterIsOpen(false)}>
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>
        </OutsideClickHandler>
      )}
    </>
  );
}
