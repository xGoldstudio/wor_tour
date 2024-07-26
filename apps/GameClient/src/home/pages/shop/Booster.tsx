import useBooster, { BoosterType } from "@/home/store/useBooster/useBooster";
import { useState } from "react";
import BoosterIllustration from "./BoosterIllustration";
import Modal, { BackgroundModal } from "@/home/ui/modal";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import CardDisplay from "@/game/gui/card/FullCard";
import useScrollCardList from "../deck/useScrollCardList";
import {
  BoosterRarityDrop,
  Box,
  Button,
  GoldAmount,
} from "@repo/ui";
import ConfirmationModal from "@/home/ui/ConfirmationModal";
import { preventDefault } from "@repo/lib";

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
      <BoosterIllustration size={1} title={booster.name} />
      <Button action={() => setIsModalOpen(true)} full small>
        <GoldAmount amount={booster.cost} />
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

interface BoosterModalProps {
  closeModal: () => void;
  booster: BoosterType;
}

export function BoosterModal({ closeModal, booster }: BoosterModalProps) {
  const { currentPosition, setIsPressed, changePosition } = useScrollCardList(
    0,
    booster.cards.length
  );
  const { gold } = usePlayerStore((state) => ({
    gold: state.gold,
  }));
  const [isBoosterPreview, setIsBoosterPreview] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const buyBooster = useBooster();

  return (
    <Modal closeModal={closeModal} title="booster">
      <BackgroundModal closeModal={closeModal}>
        <div
          className="flex flex-col items-center gap-8 w-full h-full justify-center"
          onMouseDown={preventDefault(() => setIsPressed(true))}
          onMouseUp={preventDefault(() => setIsPressed(false))}
          onMouseMove={changePosition}
        >
          {isBoosterPreview ? (
            <div className="relative h-[430px]">
              {booster.cards.map((card, index) => (
                <CardDisplay
                  key={`level_${index}`}
                  card={card}
                  position={index - currentPosition}
                />
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="w-full h-full bg-slate-900 absolute top-2 left-2 rounded-sm"></div>
              <BoosterIllustration size={2.5} title={booster.name} />

              <div className="absolute -bottom-4 -right-4">
                <Button
                  action={() => setIsBoosterPreview(true)}
                  small
                  className="px-4"
                >
                  <div className="w-10 h-10 flex justify-center items-center">
                    <img src="/glass.svg" className="w-5 h-5" />
                  </div>
                </Button>
              </div>
            </div>
          )}
          <Box cover="rare" rarity="epic" height={250}>
            <div className="flex flex-col h-full justify-between items-center p-4 pb-6">
              <div className="w-full flex flex-col gap-2">
                <div className="h-[18px] mb-1">
                  <BoosterRarityDrop booster={booster} />
                </div>
                <h3 className="font-stylised text-2xl">{booster.name}</h3>
                <p className="">{booster.description}</p>
              </div>
              <Button
                action={() => setIsConfirmationOpen(true)}
                disabled={booster.cards.length === 0 || gold < booster.cost}
              >
                Buy for <GoldAmount amount={booster.cost} className="pl-1" />
              </Button>
            </div>
          </Box>
        </div>
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          closeModal={() => setIsConfirmationOpen(false)}
          onConfirm={() => buyBooster(booster.name, true)}
        >
          <Box cover="rare" rarity="legendary" height={150}>
            <div className="flex items-center justify-center p-4">
              <h3>
                Are you sure you want to buy{" "}
                <span className="font-stylised text-amber-700">
                  {booster.name}
                </span>{" "}
                for
              </h3>
              <GoldAmount amount={booster.cost} className="pl-1" />
            </div>
          </Box>
        </ConfirmationModal>
      </BackgroundModal>
    </Modal>
  );
}
