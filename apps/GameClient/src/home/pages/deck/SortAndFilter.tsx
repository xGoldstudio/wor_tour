import { useEffect, useRef, useState } from "react";
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

const OutsideClickHandler = ({ children, onOutsideClick }) => {
  const wrapperRef = useRef(null);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      onOutsideClick();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="absolute flex items-center justify-center" ref={wrapperRef}>
      {children}
    </div>
  );
};

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
                .find((sort) => (sort = actualSort)) as CardSorts
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
