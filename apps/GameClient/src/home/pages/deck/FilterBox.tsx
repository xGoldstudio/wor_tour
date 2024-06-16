import { ActiveFilters, CardFilters, filters } from "./cardFilters";
import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

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
    actualFilter.Cost ? filters.Cost.rangeMax! : 9,
  ]);
  const [rangeLevel, setRangeLevel] = useState<number[] | number>([
    actualFilter.Level ? filters.Level.rangeMin! : 1,
    actualFilter.Level ? filters.Level.rangeMax! : 3,
  ]);

  const handleSliderChange = (newRange: number[] | number) => {
    setRange(newRange);
    if (Array.isArray(newRange)) {
      filters.Cost.rangeMin = newRange[0];
      filters.Cost.rangeMax = newRange[1];
    }
    if (filters.Cost.rangeMin === 1 && filters.Cost.rangeMax === 9) {
      setActualFilter({ ...actualFilter, Cost: false });
    } else {
      setActualFilter({ ...actualFilter, Cost: true });
    }
  };

  const handleSliderChange2 = (newRange: number[] | number) => {
    setRange(newRange);
    if (Array.isArray(newRange)) {
      filters.Level.rangeMin = newRange[0];
      filters.Level.rangeMax = newRange[1];
    }
    if (filters.Level.rangeMin === 1 && filters.Level.rangeMax === 3) {
      setActualFilter({ ...actualFilter, Level: false });
    } else {
      setActualFilter({ ...actualFilter, Level: true });
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
      <Slider
        range
        count={1}
        min={1}
        max={3}
        defaultValue={[
          actualFilter.Level
            ? filters.Level.rangeMin!
            : Array.isArray(rangeLevel)
              ? rangeLevel[0]
              : 1,
          actualFilter.Level
            ? filters.Level.rangeMax!
            : Array.isArray(rangeLevel)
              ? rangeLevel[1]
              : 3,
        ]}
        onChange={handleSliderChange2}
      />
      <div>
        <span>Min: {Array.isArray(rangeLevel) && rangeLevel[0]}</span> -{" "}
        <span>Max: {Array.isArray(rangeLevel) && rangeLevel[1]}</span>
      </div>
      <button onClick={closeModal}>Close</button>
    </div>
  );
}

// TD: factoriser les sliders
