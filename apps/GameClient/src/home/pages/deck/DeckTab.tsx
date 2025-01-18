import { filterUndefined, getImageUrl, ICONS } from "@repo/lib";
import { CARD_BORDER_HEIGHT, CARD_BORDER_WIDTH, cn, ManaBall } from "@repo/ui";
import * as _ from "lodash";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import Collection from "./Collection";
import { useEditionMode } from "./context/UseEditionMode";
import { DeckCardUI } from "./deckCardUi/DeckCardUI";
import { NUMBER_OF_CARD_IN_DECK } from "@/const";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import { getDeckStrength } from "@/services/MatchmakingService/buildDeck";
import { CardType } from "game_engine";
import { useWhenLeaveTab } from "@/home/tabs/useWhenLeaveTab";
import { PlayerCardCollectionInfo } from "./cardFilters";
import PlayerDetails from "./PlayerDetails";
import { CARD_GAP } from "./CollectionInterface";
import CardReplacement from "./CardReplacement";
import DragContextProvider, {
  DragContext,
  DragContextType,
} from "./dragAndDrop/DragContext";
import Droppable from "./dragAndDrop/Droppable";
import { useEditDeckActions } from "./context/EditionModeContext";
import ButtonOptimizeStrengthDeck from "./ButtonOptimizeStrengthDeck";

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
        "flex items-center px-2 gap-2 bold relative text-white shadow-md rounded-md z-0",
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
      <StatBox className="col-start-2">
        <img
          src={getImageUrl(ICONS, "epees-bouclier.png")}
          alt="swords and a shield"
          width={28}
          height={28}
        />
        <span className="text-xl bold ">{powerTotal.toFixed(1)}</span>
      </StatBox>
      <div className="col-start-4 h-full flex items-center justify-end">
        <ButtonOptimizeStrengthDeck currentDeck={deck} />
      </div>
    </>
  );
}

function EmptyDeckPlaceholder({
  size,
  index,
}: {
  size: number;
  index: number;
}) {
  const { editionMode, setEditionMode } = useEditionMode();
  const { replaceCard, swapCards } = useEditDeckActions();

  return (
    <Droppable<number>
      onDrop={(originCardId) => {
        const originIndex = usePlayerStore
          .getState()
          .deck.findIndex((id) => id === originCardId);
        if (originIndex === -1) {
          // we dropped the origin card
          const target = usePlayerStore.getState().deck[index];
          if (target === 0) {
            return;
          }
          replaceCard(target);
          return;
        }
        if (originIndex === index) {
          // we dropped the card on itself
          return;
        }
        // we dropped a card on another card
        swapCards(index, originCardId);
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
  return (
    <DragContextProvider>
      <DeckTabContent size={size} />
    </DragContextProvider>
  );
}

function DeckTabContent({ size }: { size: number }) {
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

  const { isDragging } = useContext(DragContext) as DragContextType<number>;

  const [isDraggingState, setIsDraggingState] = useState(!!isDragging.current);
  useEffect(
    () => setIsDraggingState(!!isDragging.current),
    [isDragging.current]
  );

  return (
    <ScrollContainer
      className="grow scrollbar-hiden overflow-y-scroll flex flex-col relative"
      innerRef={parentScrollRef}
      horizontal={false}
      vertical={!isDraggingState}
    >
      <div className="absolute top-0 left-0 w-full min-h-full flex flex-col items-center">
        <div
          className="pt-6 grid grid-cols-4 w-fit"
          style={{ gap: CARD_GAP * size }}
        >
          <DeckStats deck={filterUndefined(detailledDeck)} />
          {detailledDeck.map((card, index) => (
            <div className="relative" key={index}>
              <EmptyDeckPlaceholder size={size} index={index} />
              <div className="absolute top-0 left-0">
                {card && (
                  <DeckCardUI
                    isDeckCard
                    card={card}
                    size={size}
                    key={`${card.id}_${index}`}
                    parentScrollRef={parentScrollRef}
                  />
                )}
              </div>
            </div>
          ))}
          {!editionMode && (
            <>
              <StatBox className="col-start-0 col-span-4 w-full p-1" />
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
          <PlayerDetails deck={filterUndefined(detailledDeck)}></PlayerDetails>
        )}
      </div>
    </ScrollContainer>
  );
}
