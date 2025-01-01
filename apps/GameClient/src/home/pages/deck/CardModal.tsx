import { getCardFromLevel, getCardStats } from "@/cards";
import CardDisplay from "@/game/gui/card/FullCard";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import Modal from "@/home/ui/modal";
import useScrollCardList from "./useScrollCardList";
import { Button } from "@repo/ui";
import { preventDefault } from "@repo/lib";
import { useContext } from "react";
import { HomeTabContext, HomeTabContextType } from "@/home/HomeTabContext";
import { Plus, ShoppingCart, Trash, Undo2 } from "lucide-react";

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

  const isLevelOwned = collectionInfo && level >= currentPosition;

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
        <div className="flex items-center gap-4">
          <Button action={closeModal} rarity="rare" className="w-[150px]">
            <Undo2 strokeWidth={2} />
          </Button>
          {isLevelOwned ? (
            isPlayed ? (
              <Button
                rarity="common"
                action={() =>
                  usePlayerStore.getState().removeCardFromDeck(cardId)
                }
                className="w-[150px]"
              >
                <Trash strokeWidth={2} />
              </Button>
            ) : (
              <Button
                action={() => usePlayerStore.getState().addCardToDeck(cardId)}
                disabled={isDeckFull}
                className="w-[150px]"
              >
                <Plus strokeWidth={3} />
              </Button>
            )
          ) : (
            <Button
              action={() => {
                setCurrentTab("shop");
                closeModal();
              }}
              className="w-[150px]"
            >
              <ShoppingCart strokeWidth={2} />
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
