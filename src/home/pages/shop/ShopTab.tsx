import {
  Borders,
  CardIllustartion,
  InnerBord,
} from "@/game/gui/card/CardBorder";
import { Button } from "../../Home";
import ScrollContainer from "react-indiana-drag-scroll";
import React, { useState } from "react";
import Modal, { BackgroundModal } from "@/home/ui/modal";
import { FullCard, useScrollCardList } from "../deck/CardModal";
import { preventDefault } from "@/lib/eventUtils";
import usePlayerStore from "@/home/store/playerStore";
import BoosterIllustration from "./BoosterIllustration";
import useBooster, { BoosterType } from "@/home/store/useBooster";

export default function ShopTab() {
  const boosters = usePlayerStore((state) => state.getAvailableBoosters());

  return (
    <div className="w-full grid grid-rows-[auto_1fr] absolute top-0 h-full">
      <ScrollContainer className="grow overflow-y-scroll pt-2 scrollbar-hide flex justify-center">
        <div className="grid grid-cols-3 gap-1 w-[416px]">
          {Object.values(boosters).map((booster) => (
            <Booster booster={booster} />
          ))}
        </div>
      </ScrollContainer>
    </div>
  );
}

interface BoosterProps {
  booster: BoosterType;
}

export function Booster({ booster }: BoosterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className="flex flex-col items-center gap-2 p-1 cursor-pointer"
      onClick={() => setIsModalOpen(true)}
    >
      <BoosterIllustration
        size={1}
        title={booster.name}
        illustration={booster.illustration}
      />
      <Button action={() => setIsModalOpen(true)} full small>
        {booster.cost}
      </Button>
      {isModalOpen && (
        <BoosterModal
          closeModal={() => setIsModalOpen(false)}
          booster={booster}
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

interface BoosterModalProps {
  closeModal: () => void;
  booster: BoosterType;
}

function BoosterModal({
  closeModal,
  booster,
}: BoosterModalProps) {
  const { currentPosition, setIsPressed, changePosition } = useScrollCardList(
    0,
    booster.cards.length
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
              {booster.cards.map((card, index) => (
                <FullCard
                  key={`level_${index}`}
                  card={card}
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
              <BoosterIllustration
                size={2.5}
                title={booster.name}
                illustration={booster.illustration}
              />

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
                <h3 className="font-stylised text-2xl">{booster.name}</h3>
                <p className="">{booster.description}</p>
              </div>
              <Button
                action={() => setIsConfirmationOpen(true)}
                disabled={booster.cards.length === 0}
              >
                Buy for {booster.cost} G
              </Button>
            </div>
          </Box>
        </div>
        {isConfirmationOpen && (
          <ConfirmationModal
            closeModal={() => setIsConfirmationOpen(false)}
            booster={booster}
          />
        )}
      </BackgroundModal>
    </Modal>
  );
}

function ConfirmationModal({
  closeModal,
  booster,
}: {
  closeModal: () => void;
  booster: BoosterType
}) {
  const buyBooster = useBooster(booster);

  return (
    <Modal closeModal={closeModal} title={"confirmation"}>
      <BackgroundModal closeModal={closeModal}>
        <div className="w-full h-full flex flex-col justify-center items-center gap-8">
          <Box>
            <h3>
              Are you sure you want to buy{" "}
              <span className="font-stylised text-amber-500">{booster.name}</span>{" "}
              for {booster.cost} ?
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
