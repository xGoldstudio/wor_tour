import {
  Borders,
  CardIllustartion,
  InnerBord,
  inPx,
} from "@/game/gui/card/CardBorder";
import { Button } from "../../Home";
import ScrollContainer from "react-indiana-drag-scroll";
import usePlayerStore from "@/home/store/playerStore";
import React, { useState } from "react";
import Modal, { BackgroundModal } from "@/home/ui/modal";
import { CardStatsInfo, getCardFromLevel } from "@/cards";
import { FullCard, useScrollCardList } from "../deck/CardModal";
import { preventDefault } from "@/lib/eventUtils";
import useRewardStore from "@/home/store/rewardStore";

export default function ShopTab() {
  const { allCardsUnlocked } = usePlayerStore((state) => ({
    deck: state.deck,
    collection: state.getCollection(),
    allCardsUnlocked: state.getAllCardsUnlocked(),
  }));

  return (
    <div className="w-full grid grid-rows-[auto_1fr] absolute top-0 h-full">
      <ScrollContainer className="grow overflow-y-scroll pt-2 scrollbar-hide flex justify-center">
        <div className="grid grid-cols-3 gap-1 w-[416px]">
          <Booster
            cost={1000}
            cards={allCardsUnlocked}
            packName="Classic refill"
            packDescription="Contain 1 unit from any worlds among unlocked cards."
          />
          <Booster
            cost={1200}
            cards={allCardsUnlocked}
            packName="Classic refill"
            packDescription="Contain 1 unit from any worlds among unlocked cards."
          />
          <Booster
            cost={1400}
            cards={allCardsUnlocked}
            packName="Classic refill"
            packDescription="Contain 1 unit from any worlds among unlocked cards."
          />
          <Booster
            cost={1600}
            cards={allCardsUnlocked}
            packName="Classic refill"
            packDescription="Contain 1 unit from any worlds among unlocked cards."
          />
          <Booster
            cost={1800}
            cards={allCardsUnlocked}
            packName="Classic refill"
            packDescription="Contain 1 unit from any worlds among unlocked cards."
          />
          <Booster
            cost={2000}
            cards={allCardsUnlocked}
            packName="Classic refill"
            packDescription="Contain 1 unit from any worlds among unlocked cards."
          />
          <Booster
            cost={5000}
            cards={allCardsUnlocked}
            packName="Classic refill"
            packDescription="Contain 1 unit from any worlds among unlocked cards."
          />
          <Booster
            cost={8000}
            cards={allCardsUnlocked}
            packName="Classic refill"
            packDescription="Contain 1 unit from any worlds among unlocked cards."
          />
          <Booster
            cost={10000}
            cards={allCardsUnlocked}
            packName="Classic refill"
            packDescription="Contain 1 unit from any worlds among unlocked cards."
          />
          <Booster
            cost={20000}
            cards={allCardsUnlocked}
            packName="Classic refill"
            packDescription="Contain 1 unit from any worlds among unlocked cards."
          />
          <Booster
            cost={50000}
            cards={allCardsUnlocked}
            packName="Classic refill"
            packDescription="Contain 1 unit from any worlds among unlocked cards."
          />
          <Booster
            cost={100000}
            cards={allCardsUnlocked}
            packName="Classic refill"
            packDescription="Contain 1 unit from any worlds among unlocked cards."
          />
          <Booster
            cost={1000000}
            cards={allCardsUnlocked}
            packName="Classic refill"
            packDescription="Contain 1 unit from any worlds among unlocked cards."
          />
        </div>
      </ScrollContainer>
    </div>
  );
}

interface BoosterProps {
  cost: number;
  cards: CardStatsInfo[];
  packName: string;
  packDescription: string;
}

export function Booster({
  cost,
  cards,
  packName,
  packDescription,
}: BoosterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className="flex flex-col items-center gap-2 p-1 bg-teal-100 border-2 border-slate-900 rounded-sm cursor-pointer"
      onClick={() => setIsModalOpen(true)}
    >
      <BoosterImage size={1} />
      <Button action={() => setIsModalOpen(true)} full small>
        {cost}
      </Button>
      {isModalOpen && (
        <BoosterModal
          cards={cards}
          closeModal={() => setIsModalOpen(false)}
          price={cost}
          packName={packName}
          packDescription={packDescription}
        />
      )}
    </div>
  );
}

export function Box({ children }: { children: React.ReactNode }) {
  return (
    <Borders width={500} height={200} borderUnit={1.5} rarity="common">
      <CardIllustartion width={500} height={200} borderUnit={1.5}>
        <InnerBord size={2}>
          <div className="w-full h-full relative bg-slate-100 text-center p-2 py-4">
            {children}
          </div>
        </InnerBord>
      </CardIllustartion>
    </Borders>
  );
}

export function BoosterImage({ size }: { size: number }) {
  return (
    <div
      className="w-[128px] h-[178px] bg-slate-50 rounded-sm relative"
      style={{
        backgroundImage: "url('/booster.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: inPx(128 * size),
        height: inPx(178 * size),
      }}
    >
      <InnerBord size={1}>
        <p></p>
      </InnerBord>
    </div>
  );
}

interface BoosterModalProps {
  cards: CardStatsInfo[];
  closeModal: () => void;
  price: number;
  packName: string;
  packDescription: string;
}

function BoosterModal({
  cards,
  closeModal,
  price,
  packName,
  packDescription,
}: BoosterModalProps) {
  const { currentPosition, setIsPressed, changePosition } = useScrollCardList(
    0,
    cards.length
  );
  const [isBoosterPreview, setIsBoosterPreview] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  return (
    <Modal closeModal={closeModal} title="booster">
      <BackgroundModal closeModal={closeModal}>
        <div
          className="flex flex-col items-center gap-16 w-full h-full justify-center"
          onMouseDown={preventDefault(() => setIsPressed(true))}
          onMouseUp={preventDefault(() => setIsPressed(false))}
          onMouseMove={changePosition}
        >
          {isBoosterPreview ? (
            <div className="relative h-[430px]">
              {cards.map((card, index) => (
                <FullCard
                  key={`level_${index}`}
                  card={getCardFromLevel(card, 1)}
                  position={index - currentPosition}
                />
              ))}
            </div>
          ) : (
            <div
              className="relative"
              onClick={() => {
                setIsBoosterPreview(true);
              }}
            >
              <div className="w-full h-full bg-slate-900 absolute top-2 left-2 rounded-sm"></div>
              <BoosterImage size={2.5} />

              <div className="absolute -bottom-4 -right-4">
                <Button action={() => {}} small>
                  <div className="w-10 h-10 flex justify-center items-center">
                    <img src="/glass.svg" className="w-5 h-5" />
                  </div>
                </Button>
              </div>
            </div>
          )}
          <Box>
            <div className="flex flex-col h-full justify-between items-center">
              <div>
                <h3 className="font-stylised text-2xl">{packName}</h3>
                <p className="">{packDescription}</p>
              </div>
              <Button action={() => setIsConfirmationOpen(true)}>
                Buy for {price} G
              </Button>
            </div>
          </Box>
        </div>
        {isConfirmationOpen && (
          <ConfirmationModal
            closeModal={() => setIsConfirmationOpen(false)}
            packName={packName}
            price={price}
          />
        )}
      </BackgroundModal>
    </Modal>
  );
}

function ConfirmationModal({
  closeModal,
  packName,
  price,
}: {
  closeModal: () => void;
  packName: string;
  price: number;
}) {
  const buyBooster = useRewardStore(
    (state) => () => state.buyBooster(packName)
  );

  return (
    <Modal closeModal={closeModal} title={"confirmation"}>
      <BackgroundModal closeModal={closeModal}>
        <div className="w-full h-full flex flex-col justify-center items-center gap-8">
          <Box>
            <h3>
              Are you sure you want to buy{" "}
              <span className="font-stylised text-amber-500">{packName}</span>{" "}
              for {price} ?
            </h3>
          </Box>
          <div className="flex gap-16">
            <Button
              action={() => {
                buyBooster();
                closeModal();
              }}
            >
              Yes
            </Button>
            <Button action={closeModal}>No</Button>
          </div>
        </div>
      </BackgroundModal>
    </Modal>
  );
}
