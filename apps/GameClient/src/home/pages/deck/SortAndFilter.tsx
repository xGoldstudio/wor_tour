import React, { useEffect, useRef, useState } from "react";
import { ActiveFilters, CardFilters, FiltersDescription } from "./cardFilters";
import { CardSorts, sorts } from "./cardSorts";
import { FilterModal } from "./FilterBox";
import { SortModal } from "./SortBox";

interface SortAndFilterBoxProps {
  setActualSort: (sort: CardSorts) => void;
  actualSort: CardSorts;
  setActualFilter?: (filter: ActiveFilters) => void;
  actualFilter?: ActiveFilters;
}

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

export function SortAndFilterBox({
  setActualSort,
  actualSort,
  setActualFilter,
  actualFilter,
}: SortAndFilterBoxProps) {
  const [sortIsOpen, setSortIsOpen] = useState(false);
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const isFIlter = !!setActualFilter;
  return (
    <div
      className={`${isFIlter ? "w-full h-6 flex -top-4 justify-center items-center" : "-mb-[4.5rem] -ml-60 w-full flex justify-center items-center z-10"}`}
    >
      <div>
        <button
          onClick={() => {
            setSortIsOpen(true);
            filterIsOpen ? setFilterIsOpen(false) : null;
          }}
        >
          Sort{" "}
          {`(${
            sorts[
              Object.keys(sorts)
                .filter((sort) => (sort as CardSorts) === actualSort)
                .find((sort) => sort === actualSort) as CardSorts
            ].label
          })`}
        </button>
      </div>
      {setActualFilter && (
        <div>
          <button
            onClick={() => {
              setFilterIsOpen(true);
              sortIsOpen ? setSortIsOpen(false) : null;
            }}
          >
            Filter{" "}
            {`(${Object.keys(actualFilter!)
              .filter(
                (filter) =>
                  actualFilter![filter as CardFilters] === true &&
                  FiltersDescription[filter as CardFilters].label
              )
              .join(", ")})`}
          </button>
        </div>
      )}
      {sortIsOpen && (
        <SortModal
          deck={isFIlter}
          setActualSort={setActualSort}
          actualSort={actualSort}
          closeModal={() => setSortIsOpen(false)}
        />
      )}
      {filterIsOpen && (
        <OutsideClickHandler onOutsideClick={() => setFilterIsOpen(false)}>
          <FilterModal
            setActualFilter={setActualFilter!}
            actualFilter={actualFilter!}
            closeModal={() => setFilterIsOpen(false)}
          />
        </OutsideClickHandler>
      )}
    </div>
  );
}
