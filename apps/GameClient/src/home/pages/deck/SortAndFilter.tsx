import { cn } from "@repo/ui";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useState } from "react";
import { ActiveFilters, CardFilters, filters } from "./cardFilters";
import { CardSorts, sorts } from "./cardSorts";
import { CoverModal } from "@/home/ui/modal";
import { CardIllustartion } from "../../../../../../packages/ui/components/card/CardBorder";
import { div } from "three/examples/jsm/nodes/Nodes.js";

interface SortModalProps {
  setActualSort: (sort: CardSorts) => void;
  actualSort: CardSorts;
  closeModal: () => void;
  deck: boolean;
}

export function SortModal({
  setActualSort,
  actualSort,
  closeModal,
  deck,
}: SortModalProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    for (const key in sorts)
      if (sorts[key as CardSorts].label === event.target.value)
        setActualSort(key as CardSorts);
  };
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-48 h-24 absolute top-48 z-50 p-2",
        !deck && "left-[16.37rem]"
      )}
      style={{
        backgroundImage: "url(/bronze.avif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white flex flex-col h-full w-full p-2">
        <label>Order cards by :</label>
        <select name="criteria" onChange={handleChange}>
          {Object.values(sorts).map((sortCriteria, index) => (
            <option
              key={index}
              value={sortCriteria.label}
              onClick={closeModal}
              selected={sorts[actualSort].label === sortCriteria.label}
            >
              {sortCriteria.label}
            </option>
          ))}
        </select>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
}

interface FilterModalProps {
  setActualFilter: (filter: ActiveFilters) => void;
  actualFilter: ActiveFilters;
  closeModal: () => void;
}

export function FilterModal({
  setActualFilter,
  actualFilter,
  closeModal,
}: FilterModalProps) {
  const handleChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = event.currentTarget;
    for (const key in filters) {
      if (filters[key as CardFilters].label === value) {
        setActualFilter({
          ...actualFilter,
          [key as CardFilters]: !actualFilter[key as CardFilters],
        });
      }
    }
  };
  const [range, setRange] = useState<number[] | number>([
    actualFilter.Cost ? filters.Cost.rangeMin! : 1,
    actualFilter.Cost ? filters.Cost.rangeMax! : 3,
  ]);

  const handleSliderChange = (newRange: number[] | number) => {
    setRange(newRange);
    if (Array.isArray(newRange)) {
      filters.Cost.rangeMin = newRange[0];
      filters.Cost.rangeMax = newRange[1];
    }
    if (filters.Cost.rangeMin === 1 && filters.Cost.rangeMax === 3) {
      setActualFilter({ ...actualFilter, Cost: false });
    } else {
      setActualFilter({ ...actualFilter, Cost: true });
    }
  };
  return (
    <div className="flex flex-col items-center justify-center w-44 h-40 bg-white absolute border-white top-48 z-50 p-2 pt-4 rounded-lg">
      {Object.values(filters).map(
        (filterCriteria, index) =>
          index !== 0 && (
            <button
              key={index}
              value={filterCriteria.label}
              onClick={handleChange}
              type="button"
              style={{
                backgroundImage: `url(${filterCriteria.style})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="bg-opacity-10 w-full"
            >
              {filterCriteria.label}
            </button>
          )
      )}
      <Slider
        range
        count={1}
        min={1}
        max={3}
        defaultValue={[
          actualFilter.Cost
            ? filters.Cost.rangeMin!
            : Array.isArray(range)
              ? range[0]
              : 1,
          actualFilter.Cost
            ? filters.Cost.rangeMax!
            : Array.isArray(range)
              ? range[1]
              : 3,
        ]}
        onChange={handleSliderChange}
      />
      <div>
        <span>Min: {Array.isArray(range) && range[0]}</span> -{" "}
        <span>Max: {Array.isArray(range) && range[1]}</span>
      </div>
      <button onClick={closeModal}>Close</button>
    </div>
  );
}

interface SortAndFilterBoxProps {
  setActualSort: (sort: CardSorts) => void;
  actualSort: CardSorts;
  setActualFilter?: (filter: ActiveFilters) => void;
  actualFilter?: ActiveFilters;
}

export function SortAndFilterBox({
  setActualSort,
  actualSort,
  setActualFilter,
  actualFilter,
}: SortAndFilterBoxProps) {
  const [sortIsOpen, setSortIsOpen] = useState(false);
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  return (
    <div
      className={`${!!setActualFilter ? "w-full h-6 flex -top-4 justify-center items-center" : "-mb-[4.5rem] -ml-60 w-full flex justify-center items-center z-10"}`}
    >
      <div>
        <button
          onClick={() => {
            setSortIsOpen(true);
            filterIsOpen ? setFilterIsOpen(false) : null;
          }}
        >
          Sort {`(${actualSort})`}
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
                  filters[filter as CardFilters].label
              )
              .join(", ")})`}
          </button>
        </div>
      )}
      {sortIsOpen && (
        <SortModal
          deck={!!setActualFilter}
          setActualSort={setActualSort}
          actualSort={actualSort}
          closeModal={() => setSortIsOpen(false)}
        />
      )}
      {filterIsOpen && (
        <FilterModal
          setActualFilter={setActualFilter!}
          actualFilter={actualFilter!}
          closeModal={() => setFilterIsOpen(false)}
        />
      )}
    </div>
  );
}
