import useBooster, { BoosterType } from "@/home/store/useBooster";
import { useState } from "react";
import BoosterIllustration from "./BoosterIllustration";
import { Button } from "@/home/Home";
import Modal, { BackgroundModal } from "@/home/ui/modal";
import { preventDefault } from "@/lib/eventUtils";
import usePlayerStore from "@/home/store/playerStore";
import ConfirmationModal from "@/home/ui/ConfirmationModal";
import { GoldAmount } from "@/home/ui/GoldAmount";
import Box from "@/home/ui/Box";
import FullCard from "@/game/gui/card/FullCard";
import useScrollCardList from "../deck/useScrollCardList";

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
    booster.cards.length,
  );
  const { gold } = usePlayerStore((state) => ({
    gold: state.gold,
  }));
  const [isBoosterPreview, setIsBoosterPreview] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const buyBooster = useBooster(booster);

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
            <div className="relative">
              <div className="w-full h-full bg-slate-900 absolute top-2 left-2 rounded-sm"></div>
              <BoosterIllustration
                size={2.5}
                title={booster.name}
                illustration={booster.illustration}
              />

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
          <Box>
            <div className="flex flex-col h-full justify-between items-center">
              <div>
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
          onConfirm={buyBooster}
        >
          <div className="flex items-center justify-center">
            <h3>
              Are you sure you want to buy{" "}
              <span className="font-stylised text-amber-500">
                {booster.name}
              </span>{" "}
              for
            </h3>
            <GoldAmount amount={booster.cost} className="pl-1" />
          </div>
        </ConfirmationModal>
      </BackgroundModal>
    </Modal>
  );
}
