import * as _ from "lodash";
import usePlayerStore from "@/home/store/playerStore";
import { CardUI } from "./CardUI";
import ScrollContainer from "react-indiana-drag-scroll";

export default function DeckTab() {
  const { deck, NUMBER_OF_CARD_IN_DECK } = usePlayerStore((state) => ({
    deck: state.deck,
    NUMBER_OF_CARD_IN_DECK: state.NUMBER_OF_CARD_IN_DECK,
  }));

  const deckArray = _.concat(
    deck,
    _.fill(Array(NUMBER_OF_CARD_IN_DECK - deck.length), null)
  );
  // const defaultSort: CardSorts = "cost_asc";
  // const [actualSortDeck, setActualSortDeck] = useState<CardSorts>(defaultSort);
  const detailledDeck = [];
  const getCompleteInfo = usePlayerStore((state) => state.getCompleteInfo);
  for (let i = 0; i < NUMBER_OF_CARD_IN_DECK; i++)
    detailledDeck.push(getCompleteInfo(deckArray[i]!));
  // detailledDeck = sorts[actualSortDeck].sortFunction(detailledDeck);

  const { collection } = usePlayerStore((state) => ({
    collection: state.getCollection(),
  }));
  const { detailledCollection } = usePlayerStore((state) => ({
    detailledCollection: state.getCollectionCompleteInfo(collection),
  }));
  return (
    <ScrollContainer className="grow overflow-y-scroll scrollbar-hide flex justify-center">
      <div className="w-[650px] grid grid-rows-[1fr_auto] top-0 h-[650px]">
        <div className="grid grid-cols-4 gap-y-8 pt-8">
          {detailledDeck.map((card) => (
            <div className="w-full flex justify-center" key={card.id}>
              <CardUI cardId={card.id} />
            </div>
          ))}
        </div>
        Collection :
        <div className="grid grid-cols-4 gap-y-8 pt-8">
          {detailledCollection.map((card) => (
            <div className="w-full flex justify-center" key={card.id}>
              <CardUI cardId={card.id} />
            </div>
          ))}
        </div>
        {/* <SortAndFilterBox
        setActualSort={setActualSort}
        actualSort={actualSort}
        setActualFilter={setActualFilter}
        actualFilter={actualFilter}
      /> */}
        {/* <SortAndFilterBox
        setActualSort={setActualSortDeck}
        actualSort={actualSortDeck}
      /> */}
        {/* <ShowStat detailledDeck={detailledDeck} /> */}
      </div>
    </ScrollContainer>
  );
}
