import { BoxModal } from "@/home/ui/modal";
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

  const handleChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = event.currentTarget;
    for (const key in FiltersDescription) {
      if (FiltersDescription[key as CardFilters].label === value) {
        setCurrentFilter({
          ...currentFilter,
          [key as CardFilters]: !currentFilter[key as CardFilters],
        });
      }
    }
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
    return [
      typeof currentFilter[filterCriteria] === "object" &&
      typeof currentFilter[filterCriteria].min === "number"
        ? currentFilter[filterCriteria].min
        : FiltersDescription[filterCriteria].rangeMin!,
      typeof currentFilter[filterCriteria] === "object" &&
      typeof currentFilter[filterCriteria].max === "number"
        ? currentFilter[filterCriteria].max
        : FiltersDescription[filterCriteria].rangeMax!,
    ];
  }

  function getMinValueForSlider(filterCriteria: CardFiltersStyles) {
    return typeof currentFilter[filterCriteria] === "object" &&
      typeof currentFilter[filterCriteria].min === "number"
      ? currentFilter[filterCriteria].min
      : FiltersDescription[filterCriteria].rangeMin;
  }
  function getMaxValueForSlider(filterCriteria: CardFiltersStyles) {
    return typeof currentFilter[filterCriteria] === "object" &&
      typeof currentFilter[filterCriteria].max === "number"
      ? currentFilter[filterCriteria].max
      : FiltersDescription[filterCriteria].rangeMax;
  }

  return (
    <BoxModal>
      <button onClick={() => setFilterIsOpen(!filterIsOpen)}>Test</button>
      {filterIsOpen && (
        <OutsideClickHandler onOutsideClick={() => setFilterIsOpen(false)}>
          <div className="absolute top-10 z-10 flex flex-col items-center -mt-4 ">
            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-transparent border-b-white " />
            <div className="h-[379px] w-[170px] bg-[#406799] border-white border-2 rounded-md flex flex-col gap-2 items-center text-white">
              Filtre
              {Object.values(FiltersDescription).map((filterCriteria, index) =>
                filterCriteria.isButton ? (
                  <div className="flex justify-start items-center gap-2 border-t-[1px] border-opacity-30 border-t-neutral-300 w-full pl-1 pt-1">
                    <button
                      key={index}
                      value={filterCriteria.label}
                      onClick={handleChange}
                      style={isActiveFilter(
                        filterCriteria.label as CardFilters
                      )}
                      className="flex items-center justify-center p-3 mt-1 bg-[#284673] rounded-lg hover:bg-blue-700"
                    />
                    <div className="">{filterCriteria.label}</div>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="px-3  gap-2 border-t-[1px] border-opacity-30 border-t-neutral-300 w-full pl-1 pt-1 "
                  >
                    <span className="ml-8">{filterCriteria.label}</span>
                    <Slider
                      className="w-4/5 mx-auto"
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
                    <div className="text-center">
                      <span>
                        Min:{" "}
                        {getMinValueForSlider(
                          filterCriteria.label as CardFiltersStyles
                        )}{" "}
                        - Max:{" "}
                        {getMaxValueForSlider(
                          filterCriteria.label as CardFiltersStyles
                        )}
                      </span>
                    </div>
                  </div>
                )
              )}
              <div className="w-full flex justify-center border-t-neutral-300 border-t-[1px] border-opacity-30 pt-[2px] bg-[#1E3E5B]">
                <button
                  onClick={() => setFilterIsOpen(false)}
                  className=" w-3/5 rounded-lg "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </OutsideClickHandler>
      )}
    </BoxModal>
  );
}
