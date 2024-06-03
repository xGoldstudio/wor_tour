import { getCardFromLevel, getCardStats } from "@/cards";
import FullCard from "@/game/gui/card/FullCard";
import usePlayerStore from "@/home/store/playerStore";
import Modal, { CoverModal } from "@/home/ui/modal";
import useScrollCardList from "./useScrollCardList";
import { Button, cn, preventDefault } from "@repo/ui";

interface CardModalProps {
  cardId: number;
  closeModal: () => void;
}

export default function CardModal({ closeModal, cardId }: CardModalProps) {
  const card = getCardStats(cardId);
  const collectionInfo = usePlayerStore((state) =>
    state.getCollectionInfo(cardId),
  );

  const { isPlayed, isDeckFull } = usePlayerStore((state) => ({
    isPlayed: state.isPlayed(cardId),
    isDeckFull: state.isDeckFull(),
  }));

  const level = collectionInfo ? collectionInfo.level - 1 : 1;

  const { currentPosition, setIsPressed, changePosition } = useScrollCardList(
    level,
    3,
  );

  const isLevelOwned = level > currentPosition;

  return (
    <Modal title={`card_${cardId}`} closeModal={closeModal}>
      <CoverModal closeModal={closeModal}>
        <div
          className="flex flex-col items-center gap-16 w-full h-full"
          onMouseDown={preventDefault(() => setIsPressed(true))}
          onMouseUp={preventDefault(() => setIsPressed(false))}
          onMouseMove={changePosition}
        >
          <div className="flex gap-3 rounded-sm bg-slate-900 px-3 py-2">
            {card.stats.map((_, index) => (
              <BulletPosition
                selected={index === currentPosition}
                key={`${_.cost}_${index}`}
              />
            ))}
          </div>
          <div className="relative h-[430px]">
            {card.stats.map((_, index) => (
              <FullCard
                key={`level_${index}`}
                card={getCardFromLevel(card, index + 1)}
                position={index - currentPosition}
                cardData={collectionInfo}
              />
            ))}
          </div>
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
            <Button action={() => {}}>Buy more cards</Button>
          )}
        </div>
      </CoverModal>
    </Modal>
  );
}

function BulletPosition({ selected }: { selected: boolean }) {
  return (
    <div
      className={cn(
        "w-4 h-4 bg-slate-50 rounded-full shadow-[0px_0px_5px_0px_#fca5a5] ",
        !selected && "bg-slate-500 shadow-none",
      )}
    ></div>
  );
}
