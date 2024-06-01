import { ManaBall } from "@/game/gui/ManaBar";
import CardBorder, {
  CardContentIllustartion,
  InnerBord,
} from "@/game/gui/card/CardBorder";
import { Button } from "../../Home";
import ScrollContainer from "react-indiana-drag-scroll";
import { useState } from "react";
import CardModal from "./CardModal";
import usePlayerStore from "@/home/store/playerStore";
import { preventDefault } from "@/lib/eventUtils";
import * as _ from "lodash";
import Box from "@/home/ui/Box";

function SortAndFilterBox() {
  return (
    <div className="absolute w-20 h-6 flex border-2  border-red-600 -top-4 justify-between items-center">
      <button>Sort</button>
      <button>Filter</button>
    </div>
  );
}

export default function DeckTab() {
  const { deck, collection } = usePlayerStore((state) => ({
    deck: state.deck,
    collection: state.getCollection(),
  }));

  const deckArray = _.concat(deck, _.fill(Array(8 - deck.length), null));

  return (
    <div className="w-full grid grid-rows-[1fr_auto] absolute top-0 h-full">
      <ScrollContainer className="grow overflow-y-scroll pt-2 scrollbar-hide flex justify-center">
        <SortAndFilterBox />
        <div className="grid grid-cols-3 gap-4">
          {collection.map((card) => (
            <div className="w-full flex justify-center" key={card.id}>
              <DeckCard cardId={card.id} />
            </div>
          ))}
        </div>
      </ScrollContainer>
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
              {deckArray.map((cardId, index) => (
                <div
                  className="w-full flex justify-center overflow-visible"
                  key={cardId || `index_${index}`}
                >
                  <div className="w-[102px] h-[142px] relative rounded-md box-content">
                    <div className="w-full h-full bg-slate-900 opacity-20 absolute" />
                    <InnerBord size={1}>
                      <></>
                    </InnerBord>
                    {cardId !== null && (
                      <div className="absolute top-0 left-0">
                        <DeckCard cardId={cardId} isHand />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollContainer>
        </Box>
      </div>
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
