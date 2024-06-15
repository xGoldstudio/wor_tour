import { cn } from "@repo/ui";
import { CardSorts, sorts } from "./cardSorts";

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
