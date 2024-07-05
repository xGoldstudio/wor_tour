import * as _ from "lodash";
import usePlayerStore from "@/home/store/playerStore";
import { DeckCardUI } from "./DeckCardUI";
import ScrollContainer from "react-indiana-drag-scroll";

export const NUMBER_OF_CARD_IN_DECK: number = 8;
export default function DeckTab() {
  const { deck, NUMBER_OF_CARD_IN_DECK, getCompleteInfo } = usePlayerStore(
    (state) => ({
      deck: state.deck,
      getCompleteInfo: state.getCompleteInfo,
    })
  );

  const deckArray = _.concat(
    deck,
    _.fill(Array(NUMBER_OF_CARD_IN_DECK - deck.length), null)
  );
  const detailledDeck = [];
  for (let i = 0; i < NUMBER_OF_CARD_IN_DECK; i++)
    detailledDeck.push(getCompleteInfo(deckArray[i]!));
  const { collection } = usePlayerStore((state) => ({
    collection: state.getCollection(),
  }));
  const { detailledCollection } = usePlayerStore((state) => ({
    detailledCollection: state.getCollectionCompleteInfo(collection),
  }));
  return (
    <div>
      <ScrollContainer className="grow overflow-y-scroll scrollbar-hide flex justify-center">
        <div className="w-[650px] grid grid-rows-[1fr_auto] top-0 h-[650px]">
          <div className="grid grid-cols-4 gap-y-8 pt-8">
            {detailledDeck.map((card) => (
              <div className="w-full flex justify-center" key={card.id}>
                <DeckCardUI cardId={card.id} />
              </div>
            ))}
          </div>
        </div>
        Collection :
        <div className="grid grid-cols-4 gap-y-8 pt-8">
          {detailledCollection.map((card) => (
            <div className="w-full flex justify-center" key={card.id}>
              <DeckCardUI cardId={card.id} />
            </div>
          ))}
        </div>
      </ScrollContainer>
    </div>
  );
}
