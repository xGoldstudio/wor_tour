// import React, { useEffect, useRef, useState } from "react";
// import { ActiveFilters, CardFilters, FiltersDescription } from "./cardFilters";
// import { CardSorts, sorts } from "./cardSorts";
// import { FilterModal } from "./FilterBox";
// import { SortModal } from "./SortBox";
// import { div } from "three/examples/jsm/nodes/Nodes.js";

import { cn } from "@repo/ui";
import React from "react";
import { CardSorts, sorts } from "./cardSorts";
import { numberOfLevels } from "../../../../../Editor/src/editor/features/progression/consts";
import { div } from "three/examples/jsm/nodes/Nodes.js";
import { ActiveFilters, CardFilters, FiltersDescription } from "./cardFilters";

// interface SortAndFilterBoxProps {
//   setActualSort: (sort: CardSorts) => void;
//   actualSort: CardSorts;
//   setActualFilter?: (filter: ActiveFilters) => void;
//   actualFilter?: ActiveFilters;
// }

// interface OutsideClickHandlerProps {
//   children: React.ReactNode;
//   onOutsideClick: () => void;
// }

// function OutsideClickHandler({
//   children,
//   onOutsideClick,
// }: OutsideClickHandlerProps) {
//   const wrapperRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         wrapperRef.current &&
//         !wrapperRef.current.contains(e.target as Node)
//       ) {
//         onOutsideClick();
//       }
//     };
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         onOutsideClick();
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleEscape);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEscape);
//     };
//   });

//   return (
//     <div className="absolute flex items-center justify-center" ref={wrapperRef}>
//       {children}
//     </div>
//   );
// }

// export function SortAndFilterBox({
//   setActualSort,
//   actualSort,
//   setActualFilter,
//   actualFilter,
// }: SortAndFilterBoxProps) {
//   const [sortIsOpen, setSortIsOpen] = useState(false);
//   const [filterIsOpen, setFilterIsOpen] = useState(false);
//   const isFIlter = !!setActualFilter;
//   return (
//     <div
//       className={`${isFIlter ? "w-full h-6 flex -top-4 justify-center items-center" : "-mb-[4.5rem] -ml-60 w-full flex justify-center items-center z-10"}`}
//     >
//       <div>
//         <button
//           onClick={() => {
//             setSortIsOpen(true);
//             filterIsOpen ? setFilterIsOpen(false) : null;
//           }}
//         >
//           Sort{" "}
//           {`(${
//             sorts[
//               Object.keys(sorts)
//                 .filter((sort) => (sort as CardSorts) === actualSort)
//                 .find((sort) => sort === actualSort) as CardSorts
//             ].label
//           })`}
//         </button>
//       </div>
//       {setActualFilter && (
//         <div>
//           <button
//             onClick={() => {
//               setFilterIsOpen(true);
//               sortIsOpen ? setSortIsOpen(false) : null;
//             }}
//           >
//             Filter{" "}
//             {`(${Object.keys(actualFilter!)
//               .filter(
//                 (filter) =>
//                   actualFilter![filter as CardFilters] === true &&
//                   FiltersDescription[filter as CardFilters].label
//               )
//               .join(", ")})`}
//           </button>
//         </div>
//       )}
//       {sortIsOpen && (
//         <SortModal
//           deck={isFIlter}
//           setActualSort={setActualSort}
//           actualSort={actualSort}
//           closeModal={() => setSortIsOpen(false)}
//         />
//       )}
//       {filterIsOpen && (
//         <OutsideClickHandler onOutsideClick={() => setFilterIsOpen(false)}>
//           <FilterModal
//             setActualFilter={setActualFilter!}
//             actualFilter={actualFilter!}
//             closeModal={() => setFilterIsOpen(false)}
//           />
//         </OutsideClickHandler>
//       )}
//     </div>
//   );
// }

interface BoxProps {
  children: React.ReactNode;
  box?: boolean;
  isAscending?: boolean;
  setIsAscending?: (isAscending: boolean) => void;
  currentSort?: CardSorts;
  setCurrentSort?: (sort: CardSorts) => void;
  currentSortNumber?: number;
  setCurrentSortNumber?: (currentSortNumber: number) => void;
}

function Box({
  children,
  box = false,
  isAscending = false,
  setIsAscending,
  setCurrentSort,
  currentSortNumber,
  setCurrentSortNumber,
}: BoxProps) {
  const getNextSort: Record<number, CardSorts> = {
    0: "cost",
    1: "rarity",
    2: "world",
    3: "level",
  };
  const nextSort =
    currentSortNumber! < 3
      ? currentSortNumber! + 1
      : // setCurrentSortNumber((prevSortNumber) => prevSortNumber + 1)
        0;
  return (
    <div
      className={cn(
        "justify-center items-center relative w-9 h-9 rounded-sm bg-blue-600 flex border-[1px] border-opacity-70 border-blue-950 drop-shadow-lg  shadow-sky-900 shadow-2xl",
        box === true ? "w-9" : "w-20"
      )}
    >
      <div className="absolute w-full h-8 rounded-sm bg-blue-500">
        <div className=" rounded-sm w-full h-4 bg-blue-300 bg-opacity-30 mt-[2px] mx-auto" />
      </div>
      <div
        className={cn("whitespace-nowrap z-10 transition-all", {
          "-rotate-180": isAscending,
        })}
      >
        {setIsAscending && (
          <button onClick={() => setIsAscending(!isAscending)}>
            {children}
          </button>
        )}
        {setCurrentSort &&
          typeof currentSortNumber !== "undefined" &&
          setCurrentSortNumber && (
            <button
              onClick={() => {
                currentSortNumber! < 3
                  ? setCurrentSortNumber(currentSortNumber + 1)
                  : // setCurrentSortNumber((prevSortNumber) => prevSortNumber + 1)
                    setCurrentSortNumber(0);
                setCurrentSort(getNextSort[nextSort]);
              }}
            >
              {children}
            </button>
          )}
      </div>
    </div>
  );
}

interface SortAndFilterProps {
  currentSort: CardSorts;
  setCurrentSort: (sort: CardSorts) => void;
  isAscending: boolean;
  setIsAscending: (isAscending: boolean) => void;
  currentSortNumber: number;
  setCurrentSortNumber: (currentSortNumber: number) => void;
  currentFilter: ActiveFilters;
  setCurrentFilter: (filter: ActiveFilters) => void;
}

export function SortAndFilter({
  currentSort,
  setCurrentSort,
  isAscending,
  setIsAscending,
  currentSortNumber,
  setCurrentSortNumber,
  currentFilter,
  setCurrentFilter,
}: SortAndFilterProps) {
  return (
    <div className="px-4">
      <div className="h-12 bg-black bg-opacity-30 mt-4 rounded-lg flex items-center px-4 justify-between">
        <div className="">Cards found : 8 / 9</div>
        <div className="flex flex-row space-x-4 relative">
          <Box box={true}> Filtre</Box>
          <FilterBox
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />
          <Box
            box={true}
            isAscending={isAscending}
            setIsAscending={setIsAscending}
          >
            {" "}
            Sort
          </Box>
          <Box
            setCurrentSort={setCurrentSort}
            currentSortNumber={currentSortNumber}
            setCurrentSortNumber={setCurrentSortNumber}
          >
            {" "}
            {
              sorts[
                Object.keys(sorts).find(
                  (sort) => sort.toString() === currentSort
                ) as CardSorts
              ].label
            }
          </Box>
        </div>
      </div>
    </div>
  );
}

interface FilterBoxProps {
  setCurrentFilter: (filter: ActiveFilters) => void;
  currentFilter: ActiveFilters;
}

function FilterBox({ setCurrentFilter, currentFilter }: FilterBoxProps) {
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
  return (
    <div className="absolute top-10 right-[81px] z-10 flex flex-col items-center -mt-4 ">
      <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-transparent border-b-white " />
      <div className="h-[300px] w-[170px] bg-[#406799] border-white border-2 rounded-md flex flex-col gap-2 items-center text-white">
        Filtre
        {Object.values(FiltersDescription).map((filterCriteria, index) =>
          filterCriteria.isButton ? (
            <div className="flex justify-start items-center gap-2 border-t-[1px] border-opacity-30 border-t-neutral-300 w-full pl-1 pt-1">
              <button
                key={index}
                value={filterCriteria.label}
                onClick={handleChange}
                style={isActiveFilter(filterCriteria.label as CardFilters)}
                className="flex items-center justify-center p-3 mt-1 bg-[#284673] rounded-lg hover:bg-blue-700"
              />
              <div className="">{filterCriteria.label}</div>
            </div>
          ) : (
            <></>
          )
        )}
      </div>
    </div>
  );
}

//TD : ajouter un logo validé sur les filtres
//
