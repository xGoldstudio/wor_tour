import { filterUndefined, getImageUrl, ICONS } from "@repo/lib";
import { CARD_BORDER_HEIGHT, CARD_BORDER_WIDTH, cn, ManaBall } from "@repo/ui";
import * as _ from "lodash";
import { useMemo, useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import Collection from "./Collection";
import { useEditionMode } from "./context/UseEditionMode";
import { DeckCardUI } from "./DeckCardUI";
import { NUMBER_OF_CARD_IN_DECK } from "@/const";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { getDeckStrength } from "@/services/MatchmakingService/buildDeck";
import { CardType } from "game_engine";
import { useWhenLeaveTab } from "@/home/tabs/useWhenLeaveTab";
import { PlayerCardCollectionInfo } from "./cardFilters";
import PlayerDetails from "./PlayerDetails";
import { CARD_GAP } from "./CollectionInterface";
import CardReplacement from "./CardReplacement";
import DragContextProvider from "./dragAndDrop/DragContext";
import Droppable from "./dragAndDrop/Droppable";
import { useEditDeckActions } from "./context/EditionModeContext";

interface DeckStatsProps {
  deck: CardType[];
}

export function StatBox({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center px-2 py-1 gap-2 bold relative text-white shadow-md rounded-md z-0",
        className ?? ""
      )}
    >
      <div className="w-full h-full bg-slate-600 opacity-60 rounded-sm backdrop-blur-sm absolute top-0 left-0" />
      <div className="flex items-center gap-2 z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

function DeckStats({ deck }: DeckStatsProps) {
  const powerTotal = getDeckStrength(deck);

  const averageCostDeck =
    deck.length === 0
      ? 0
      : deck.reduce((total, card) => total + card.cost, 0) / deck.length;
  return (
    <>
      <StatBox className="col-start-1 text-xl ">
        <ManaBall size={0.6} />
        <p>{averageCostDeck.toFixed(1)}</p>
      </StatBox>
      <StatBox className="col-start-4">
        <div className="flex w-full items-center justify-end gap-2">
          <span className="text-xl bold ">{powerTotal.toFixed(1)}</span>
          <img
            src={getImageUrl(ICONS, "epees-bouclier.png")}
            alt="swords and a shield"
            width={28}
            height={28}
          />
        </div>
      </StatBox>
    </>
  );
}

function EmptyDeckPlaceholder({ size, index }: { size: number, index: number }) {
  const { editionMode, setEditionMode } = useEditionMode();
  const { replaceCard } = useEditDeckActions();

  return (
    <Droppable<number>
      onDrop={(originCardId) => {
        const originIndex = usePlayerStore.getState().deck.findIndex((id) => id === originCardId);
        if (originIndex === -1) {
          const target = usePlayerStore.getState().deck[index];
          if (target === 0) {
            return;
          }
          replaceCard(target);
          setEditionMode(false);
          return;
        }
        if (originIndex === index) {
          return;
        }
        setEditionMode(false);
        usePlayerStore.getState().deckSwapCards(index, originCardId);
      }}
    >
      <div
        className="flex justify-center items-center cursor-pointer"
        onClick={() => {
          if (!editionMode) {
            setEditionMode(true);
          }
        }}
      >
        <div
          className=" bg-slate-900 bg-opacity-30 border border-slate-700 border-opacity-25 backdrop-filter backdrop-blur-sm rounded-sm "
          style={{
            width: CARD_BORDER_WIDTH * size,
            height: CARD_BORDER_HEIGHT * size,
          }}
        />
      </div>
    </Droppable>
  );
}

export type selectedCardType = { id: number };

function useWhenCardAddedOrRemovedFromDeck(cb: () => void) {
  const { deck } = usePlayerStore((state) => ({
    deck: state.deck,
  }));
  const deckRef = useRef(deck);
  if (deck !== deckRef.current) {
    deckRef.current = deck;
    cb();
  }
}

export default function DeckTab({ size }: { size: number }) {
  const { deck, getCompleteInfo } = usePlayerStore((state) => ({
    deck: state.deck,
    getCompleteInfo: state.getCompleteInfo,
    numberOfCardsInDeck: state.numberOfCardsInDeck,
    currentMissingCards: state.currentMissingCards,
  }));
  const parentScrollRef = useRef<HTMLDivElement>(null);
  const { editionMode, setEditionMode, replacingCard } = useEditionMode();
  useWhenLeaveTab("deck", () => {
    setEditionMode(false);
  });
  useWhenCardAddedOrRemovedFromDeck(() => {
    if (!usePlayerStore.getState().isDeckFull) {
      setEditionMode(true);
    }
  });
  const detailledDeck = useMemo(() => {
    const deckArray = _.concat(
      deck,
      _.fill(Array(NUMBER_OF_CARD_IN_DECK - deck.length), null)
    );
    const detailledDeck: (PlayerCardCollectionInfo | undefined)[] = [];
    for (let i = 0; i < NUMBER_OF_CARD_IN_DECK; i++) {
      const cardId = deckArray[i];
      detailledDeck.push(cardId ? getCompleteInfo(cardId) : undefined);
    }
    return detailledDeck;
  }, [deck]);

  return (
    <ScrollContainer
      className="grow scrollbar-hiden overflow-y-scroll flex flex-col relative"
      innerRef={parentScrollRef}
    >
      <DragContextProvider>
        <div className="absolute top-0 left-0 w-full min-h-full flex flex-col items-center">
          <div
            className="pt-6 grid grid-cols-4 w-fit"
            style={{ gap: CARD_GAP * size }}
          >
            {detailledDeck.map((card, index) => (
              <div className="relative">
                <EmptyDeckPlaceholder size={size} key={index} index={index} />
                <div className="absolute top-0 left-0">
                  {card && (
                    <DeckCardUI
                      deckCard
                      card={card}
                      size={size}
                      key={`${card.id}_${index}`}
                      parentScrollRef={parentScrollRef}
                    />
                  )}
                </div>
              </div>
            ))}
            <DeckStats deck={filterUndefined(detailledDeck)} />
            {!editionMode && (
              <>
                <StatBox className="col-start-0 col-span-4 w-full" />
              </>
            )}
          </div>
          {editionMode ? (
            replacingCard ? (
              <CardReplacement size={size} />
            ) : (
              <Collection
                filterDeck={true}
                parentScrollRef={parentScrollRef}
                size={size}
              />
            )
          ) : (
            <PlayerDetails
              deck={filterUndefined(detailledDeck)}
            ></PlayerDetails>
          )}
        </div>
      </DragContextProvider>
    </ScrollContainer>
  );
}
