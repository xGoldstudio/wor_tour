import { Box } from "@repo/ui";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  ActiveFilters,
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
  function getdefaultValuesForSlider(filterCriteria: CardFiltersStyles) {
    return [
      typeof actualFilter[filterCriteria] === "object" &&
      typeof actualFilter[filterCriteria].min === "number"
        ? actualFilter[filterCriteria].min
        : FiltersDescription[filterCriteria].rangeMin!,
      typeof actualFilter[filterCriteria] === "object" &&
      typeof actualFilter[filterCriteria].max === "number"
        ? actualFilter[filterCriteria].max
        : FiltersDescription[filterCriteria].rangeMax!,
    ];
  }

  function getMinValueForSlider(filterCriteria: CardFiltersStyles) {
    return typeof actualFilter[filterCriteria] === "object" &&
      typeof actualFilter[filterCriteria].min === "number"
      ? actualFilter[filterCriteria].min
      : FiltersDescription[filterCriteria].rangeMin;
  }
  function getMaxValueForSlider(filterCriteria: CardFiltersStyles) {
    return typeof actualFilter[filterCriteria] === "object" &&
      typeof actualFilter[filterCriteria].max === "number"
      ? actualFilter[filterCriteria].max
      : FiltersDescription[filterCriteria].rangeMax;
  }

  return (
    <div className="absolute top-32 z-50 rounded-lg">
      <Box
        width={270}
        height={380}
        rarity="legendary"
        className="flex items-center justify-center"
      >
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
              className="w-full shadow-lg p-1 my-1 rounded-lg text-center"
            >
              {filterCriteria.label}
            </button>
          ) : (
            <div key={index} className="px-3 pb-3 ">
              <span>{filterCriteria.label}</span>
              <Slider
                range
                count={1}
                min={FiltersDescription[filterCriteria.label].rangeMin}
                max={FiltersDescription[filterCriteria.label].rangeMax}
                defaultValue={getdefaultValuesForSlider(
                  filterCriteria.label as CardFiltersStyles
                )}
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
        <button
          onClick={closeModal}
          className="bg-red-200 hover:bg-red-400 w-full rounded-lg shadow-lg"
        >
          X
        </button>
      </Box>
    </div>
  );
}
