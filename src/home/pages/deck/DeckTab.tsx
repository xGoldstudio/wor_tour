import { CardType } from "@/cards";
import { ManaBall } from "@/game/gui/ManaBar";
import CardBorder, {
  CardContentIllustartion,
  InnerBord,
} from "@/game/gui/card/CardBorder";
import usePlayerStore from "@/home/store/playerStore";
import Box from "@/home/ui/Box";
import { preventDefault } from "@/lib/eventUtils";
import { cn } from "@/lib/utils";
import * as _ from "lodash";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { Button } from "../../Home";
import { ActiveFilters, CardFilters, filters } from "./CardFilters";
import CardModal from "./CardModal";
import { CardSorts, sorts } from "./CardSorts";

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
        "flex flex-col items-center justify-center w-44 h-20 bg-gray-500 absolute top-48 z-50",
        !deck && "left-[16.37rem]"
      )}
    >
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
    <div className="flex flex-col items-center justify-center w-44 h-40 bg-gray-500 absolute top-48 z-50">
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
  classNameProps: string;
  setActualSort: (sort: CardSorts) => void;
  actualSort: CardSorts;
  setActualFilter?: (filter: ActiveFilters) => void;
  actualFilter?: ActiveFilters;
}

function SortAndFilterBox({
  setActualSort,
  actualSort,
  setActualFilter,
  actualFilter,
  classNameProps,
}: SortAndFilterBoxProps) {
  const [sortIsOpen, setSortIsOpen] = useState(false);
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const deck = !!setActualFilter;
  return (
    <div className={classNameProps}>
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
          deck={deck}
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

type DetailedCardType = CardType & { isInDeck: boolean };
interface ShowStatProps {
  detailledDeck: DetailedCardType[];
}

function ShowStat({ detailledDeck }: ShowStatProps) {
  const [showStat, setShowStat] = useState(false);
  let costAverage = 0;
  let dmgAverage = 0;
  let attackSpeedAverage = 0;
  let hpAverage = 0;
  for (let i = 0; i < 8; i++) {
    costAverage += detailledDeck[i].cost;
    dmgAverage += detailledDeck[i].dmg;
    attackSpeedAverage += detailledDeck[i].attackSpeed;
    hpAverage += detailledDeck[i].hp;
  }
  costAverage /= 8;
  dmgAverage /= 8;
  attackSpeedAverage /= 8;
  hpAverage /= 8;
  return (
    <div>
      <div className="absolute right-16 bottom-48">
        <button onClick={() => setShowStat(true)}>...</button>
      </div>
      {showStat && (
        <div className="absolute top-48 left-64 flex flex-col z-50 bg-gray-600">
          <div>Average Cost : {costAverage}</div>
          <div>Damage Average : {dmgAverage.toFixed()}</div>
          <div>Attack Speed Average : {attackSpeedAverage.toFixed(2)}</div>
          <div>Average HP : {hpAverage.toFixed()}</div>
          <button onClick={() => setShowStat(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default function DeckTab() {
  const { deck, collection } = usePlayerStore((state) => ({
    deck: state.deck,
    collection: state.getCollection(),
  }));
  let { detailledCollection } = usePlayerStore((state) => ({
    detailledCollection: state.getCollectionCompleteInfo(collection),
  }));
  const deckArray = _.concat(deck, _.fill(Array(8 - deck.length), null));

  const [actualSort, setActualSort] = useState<CardSorts>("Cost↑");
  const [actualFilter, setActualFilter] = useState<ActiveFilters>({
    Cost: false,
    Common: false,
    Rare: false,
    Epic: false,
    Legendary: false,
  });
  console.log(actualFilter);
  const classNameCollections =
    "w-full h-6 flex -top-4 justify-center items-center";
  const classNameDeck =
    "-mb-[4.5rem] -ml-60 w-full flex justify-center items-center z-10";
  Object.keys(actualFilter).forEach((filter) => {
    actualFilter[filter as keyof ActiveFilters] === true &&
      (detailledCollection =
        filters[filter as keyof ActiveFilters].filterFunction(
          detailledCollection
        ));
  });
  detailledCollection = sorts[actualSort].sortFunction(detailledCollection);

  const [actualSortDeck, setActualSortDeck] = useState<CardSorts>("Cost↑");

  let detailledDeck = [];
  const getCompleteInfo = usePlayerStore((state) => state.getCompleteInfo);
  for (let i = 0; i < 8; i++)
    detailledDeck.push(getCompleteInfo(deckArray[i]!));
  detailledDeck = sorts[actualSortDeck].sortFunction(detailledDeck);

  return (
    <div className="w-full grid grid-rows-[1fr_auto] absolute top-0 h-full">
      <SortAndFilterBox
        classNameProps={classNameCollections}
        setActualSort={setActualSort}
        actualSort={actualSort}
        setActualFilter={setActualFilter}
        actualFilter={actualFilter}
      />
      <ScrollContainer className="grow overflow-y-scroll pt-2 scrollbar-hide flex justify-center">
        <div className="grid grid-cols-3 gap-4">
          {detailledCollection.map((card, index) => (
            <div className="w-full flex justify-center" key={index}>
              <DeckCard cardId={card.id} />
            </div>
          ))}
        </div>
      </ScrollContainer>
      <SortAndFilterBox
        classNameProps={classNameDeck}
        setActualSort={setActualSortDeck}
        actualSort={actualSortDeck}
      />
      <div className="w-full flex justify-center relative overflow-hidden mb-2 mt-4">
        <Box width={650} height={210} rarity="legendary">
          <div
            className="absolute w-full h-full top-0 left-0 blur-sm"
            style={{
              backgroundImage: "url(/silver.jpeg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <ScrollContainer horizontal={true} vertical={false}>
            <div className="flex gap-4 relative pt-[6px] pl-[6px] pb-[8px]">
              {detailledDeck.map((cardId, index) => (
                <div
                  className="w-full flex justify-center overflow-visible"
                  key={cardId.id || `index_${index}`}
                >
                  <div className="w-[102px] h-[142px] relative rounded-md box-content">
                    <div className="w-full h-full bg-slate-900 opacity-20 absolute" />
                    <InnerBord size={1}>
                      <></>
                    </InnerBord>
                    {cardId.id !== null && (
                      <div className="absolute top-0 left-0">
                        <DeckCard cardId={cardId.id} isHand />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollContainer>
        </Box>
      </div>
      <ShowStat detailledDeck={detailledDeck} />
    </div>
  );
}

interface DeckCardProps {
  cardId: number;
  isHand?: boolean;
  unaddble?: boolean;
}

function DeckCard({ cardId, isHand, unaddble: addable }: DeckCardProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const { card, removeCardFromDeck, addCardToDeck, isDeckFull } =
    usePlayerStore((state) => ({
      card: state.getCompleteInfo(cardId),
      removeCardFromDeck: state.removeCardFromDeck,
      addCardToDeck: state.addCardToDeck,
      isDeckFull: state.isDeckFull(),
    }));
  return (
    <>
      {isDescriptionOpen && (
        <CardModal
          cardId={card.id}
          closeModal={() => setIsDescriptionOpen(false)}
        />
      )}
      <div className="relative select-none h-min">
        <div className="" onClick={() => setIsDescriptionOpen(true)}>
          <CardBorder rarity={card.rarity} size={isHand ? 1.6 : 2}>
            <div className="w-full h-full flex flex-col relative">
              <CardContentIllustartion card={card} size={isHand ? 1.6 : 2} />
              <div className="absolute top-0 right-0">
                <svg
                  className="h-full absolute left-0 -translate-x-full"
                  viewBox="0 0 32 32"
                >
                  <polygon points="0,0 32,32 32,0" fill="black" />
                </svg>
                <div className=" bg-black text-white text-sm font-[stylised] leading-3 px-2 pl-1 py-[2px]">
                  {card.level}
                </div>
              </div>
            </div>
          </CardBorder>
          <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 scale-[65%]">
            <ManaBall mana={card.cost} />
          </div>
        </div>
        {!addable && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4">
            {card.isInDeck ? (
              <Button
                action={() => removeCardFromDeck(card.id)}
                small
                className="px-4 py-0"
              >
                <img
                  src="/icons/minus.svg"
                  alt="remove"
                  className="w-4 h-4 m-1 my-2"
                />
              </Button>
            ) : (
              <Button
                action={preventDefault(() => addCardToDeck(card.id))}
                small
                className="px-4 py-0"
                disabled={isDeckFull}
              >
                <img
                  src="/icons/plus.svg"
                  alt="add"
                  className="w-4 h-4 m-1 my-2"
                />
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
