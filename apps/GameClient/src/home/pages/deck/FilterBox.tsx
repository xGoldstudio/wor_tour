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
  const [rangeCost, setRangeCost] = useState<number[] | number>([
    actualFilter.Cost ? filters.Cost.rangeMin! : 1,
    actualFilter.Cost ? filters.Cost.rangeMax! : 9,
  ]);
  const [rangeLevel, setRangeLevel] = useState<number[] | number>([
    actualFilter.Level ? filters.Level.rangeMin! : 1,
    actualFilter.Level ? filters.Level.rangeMax! : 3,
  ]);

  const handleSliderCostChange = (rangeCost: number[] | number) => {
    setRangeCost(rangeCost);
    if (Array.isArray(rangeCost)) {
      filters.Cost.rangeMin = rangeCost[0];
      filters.Cost.rangeMax = rangeCost[1];
    }
    if (filters.Cost.rangeMin === 1 && filters.Cost.rangeMax === 9) {
      setActualFilter({ ...actualFilter, Cost: false });
    } else {
      setActualFilter({ ...actualFilter, Cost: true });
    }
  };

  const handleSliderLevelChange = (rangeLevel: number[] | number) => {
    setRangeLevel(rangeLevel);
    if (Array.isArray(rangeLevel)) {
      filters.Level.rangeMin = rangeLevel[0];
      filters.Level.rangeMax = rangeLevel[1];
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
        max={9}
        defaultValue={[
          actualFilter.Cost
            ? filters.Cost.rangeMin!
            : Array.isArray(rangeCost)
              ? rangeCost[0]
              : 1,
          actualFilter.Cost
            ? filters.Cost.rangeMax!
            : Array.isArray(rangeCost)
              ? rangeCost[1]
              : 3,
        ]}
        onChange={handleSliderCostChange}
      />
      <div>
        <span>Min: {Array.isArray(rangeCost) && rangeCost[0]}</span> -{" "}
        <span>Max: {Array.isArray(rangeCost) && rangeCost[1]}</span>
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
        onChange={handleSliderLevelChange}
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
