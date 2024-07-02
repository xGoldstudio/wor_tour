// import usePlayerStore from "@/home/store/playerStore";
// import * as _ from "lodash";

export default function DeckTab() {
  // const { deck, NUMBER_OF_CARD_IN_DECK } = usePlayerStore((state) => ({
  //   deck: state.deck,
  //   NUMBER_OF_CARD_IN_DECK: state.NUMBER_OF_CARD_IN_DECK,
  // }));

  // const deckArray = _.concat(
  //   deck,
  //   _.fill(Array(NUMBER_OF_CARD_IN_DECK - deck.length), null)
  // );
  // const defaultSort: CardSorts = "cost_asc";
  // const [actualSortDeck, setActualSortDeck] = useState<CardSorts>(defaultSort);
  // let detailledDeck = [];
  // const getCompleteInfo = usePlayerStore((state) => state.getCompleteInfo);
  // for (let i = 0; i < NUMBER_OF_CARD_IN_DECK; i++)
  //   detailledDeck.push(getCompleteInfo(deckArray[i]!));
  // detailledDeck = sorts[actualSortDeck].sortFunction(detailledDeck);
  return (
    <div className="w-[650px] grid grid-rows-[1fr_auto] top-0 h-full">
      <div className="grid grid-cols-4 gap-y-8 pt-8">
        {/* {detailledDeck.map((card) => (
          <div className="w-full flex justify-center" key={card.id}>
            <CardUI cardId={card.id} />
          </div>
        ))} */}
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
  );
}
