import { getCardFromLevel, getCardStats } from "@/cards";
import CardDisplay from "@/game/gui/card/FullCard";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import Modal from "@/home/ui/modal";
import useScrollCardList from "./useScrollCardList";
import { Button } from "@repo/ui";
import { preventDefault } from "@repo/lib";
import { useContext } from "react";
import { HomeTabContext, HomeTabContextType } from "@/home/HomeTabContext";

interface CardModalProps {
  cardId: number;
  closeModal: () => void;
}

export default function CardModal({ closeModal, cardId }: CardModalProps) {
  const card = getCardStats(cardId);
  const collectionInfo = usePlayerStore((state) =>
    state.getCollectionInfo(cardId)
  );
  const { setCurrentTab } = useContext(
    HomeTabContext
  ) as unknown as HomeTabContextType;

  const { isPlayed, isDeckFull } = usePlayerStore((state) => ({
    isPlayed: state.isPlayed(cardId),
    isDeckFull: state.isDeckFull(),
  }));

  const level = collectionInfo ? collectionInfo.level - 1 : 1;

  const { currentPosition, setIsPressed, changePosition } = useScrollCardList(
    level,
    3
  );

  const isLevelOwned = level >= currentPosition;

  return (
    <Modal title={`card_${cardId}`} closeModal={closeModal} cover>
      <div
        className="flex flex-col items-center justify-center gap-16 w-full h-full"
        onMouseDown={preventDefault(() => setIsPressed(true))}
        onMouseUp={preventDefault(() => setIsPressed(false))}
        onMouseMove={changePosition}
      >
        <div className="relative h-[430px]">
          {card.stats.map((_, index) => (
            <CardDisplay
              key={`level_${index}`}
              card={getCardFromLevel(card, index + 1)}
              position={index - currentPosition}
              cardData={collectionInfo}
            />
          ))}
        </div>
        <div className="flex flex-col items-center gap-4">
          {isLevelOwned ? (
            isPlayed ? (
              <Button
                action={() =>
                  usePlayerStore.getState().removeCardFromDeck(cardId)
                }
              >
                Remove from deck
              </Button>
            ) : (
              <Button
                action={() => usePlayerStore.getState().addCardToDeck(cardId)}
                disabled={isDeckFull}
              >
                {isDeckFull ? "Deck is full" : "Play this card"}
              </Button>
            )
          ) : (
            <Button
              action={() => {
                setCurrentTab("shop");
                closeModal();
              }}
            >
              Buy more cards
            </Button>
          )}
          <Button
            action={closeModal}
            rarity="common"
            className="text-white"
          >
            Leave
          </Button>
        </div>
      </div>
    </Modal>
  );
}
