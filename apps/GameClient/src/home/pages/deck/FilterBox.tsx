import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  ActiveFilters,
  CardFilter,
  CardFilters,
  CardFilterSliderStyles,
  CardFiltersStyles,
  FiltersDescription,
} from "./cardFilters";

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
    for (const key in FiltersDescription) {
      if (FiltersDescription[key as CardFilters].label === value) {
        setActualFilter({
          ...actualFilter,
          [key as CardFilters]: !actualFilter[key as CardFilters],
        });
      }
    }
  };

  function getStyleForSlider(filterCriteria: CardFiltersStyles) {
    return CardFilterSliderStyles[filterCriteria];
  }

  return (
    <div className="flex flex-col items-center justify-center w-44 h-64 bg-white absolute border-white top-48 z-50 p-2 pt-4 rounded-lg">
      {Object.values(FiltersDescription).map((filterCriteria, index) =>
        filterCriteria.isButton ? (
          <button
            key={index}
            value={filterCriteria.label}
            onClick={handleChange}
            type="button"
            style={{
              backgroundImage: `url(${filterCriteria.style})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: actualFilter[filterCriteria.label] ? 1 : 0.6,
            }}
            className="bg-opacity-10 w-full"
          >
            {filterCriteria.label}
          </button>
        ) : (
          <div key={index}>
            <span>{filterCriteria.label}</span>
            <Slider
              range
              count={1}
              min={FiltersDescription[filterCriteria.label].rangeMin}
              max={FiltersDescription[filterCriteria.label].rangeMax}
              defaultValue={[
                typeof actualFilter[filterCriteria.label] === "object" &&
                typeof actualFilter[filterCriteria.label].min === "number"
                  ? actualFilter[filterCriteria.label].min
                  : FiltersDescription[filterCriteria.label].rangeMin,
                actualFilter[filterCriteria.label].max,
              ]}
              onChange={(value) => {
                if (Array.isArray(value))
                  setActualFilter({
                    ...actualFilter,
                    [filterCriteria.label]: { min: value[0], max: value[1] },
                  });
              }}
              styles={getStyleForSlider(
                filterCriteria.label as CardFiltersStyles
              )}
            />
            <div>
              <span>
                Min:{" "}
                {actualFilter[filterCriteria.label] === false
                  ? FiltersDescription[filterCriteria.label].rangeMin
                  : actualFilter[filterCriteria.label].min}{" "}
                - Max:{" "}
                {actualFilter[filterCriteria.label] === false
                  ? FiltersDescription[filterCriteria.label].rangeMax
                  : actualFilter[filterCriteria.label].max}
              </span>
            </div>
          </div>
        )
      )}
      <button onClick={closeModal}>close</button>
    </div>
  );
}

// TD: factoriser les sliders
