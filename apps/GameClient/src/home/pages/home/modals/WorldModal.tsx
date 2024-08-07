import Ribbon from "@/home/ui/Ribbon";
import Modal from "@/home/ui/modal";
import { boosters, Box, GoldAmount, useDataStore, World } from "@repo/ui";
import ScrollContainer from "react-indiana-drag-scroll";
import BoosterIllustration from "../../shop/BoosterIllustration";
import { cardWorldMultiplier } from "@repo/lib";
import Field from "./Field";
import WorldField from "./WorldField";
import { getGoldPerVictory, getMaxGoldPerDay } from "@/services/DailyGoldService/dailyGoldService";

interface WorldModalProps {
  closeModal: () => void;
  world: World;
}

export default function WorldModal({ closeModal, world }: WorldModalProps) {
  const allWorlds = useDataStore((state) => state.worlds);

  return (
    <Modal title="profile" closeModal={closeModal}>
      <div className="w-full h-full bg-slate-900 opacity-80 absolute"></div>
      <div className="w-full h-full relative flex flex-col items-center justify-center">
        <Box rarity="epic" height={700} width={600} size={1.5}>
          <img
            src="/cross.svg"
            className="absolute top-3 right-3 w-8 h-8 cursor-pointer z-10 drop-shadow-[2px_1px_1px_black]"
            onClick={closeModal}
          />
          <div
            className="w-full h-full absolute brightness-75 top-0 left-0"
            style={{
              backgroundImage: "url('/homeBg.jpeg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <ScrollContainer className="w-full h-full flex overflow-y-scroll">
            <div className="w-full h-max flex flex-col items-center relative pb-8 gap-4 py-4">
              <Field width={398}>
                <p className="relative">
                  <GoldAmount amount={getGoldPerVictory(world.id)} /> per
                  victory (max{" "}
                  <GoldAmount amount={getMaxGoldPerDay(world.id)} />/ day)
                </p>
              </Field>
              <Ribbon className="px-16">Boosters Unlocked</Ribbon>
              <div className="flex gap-6">
                {boosters
                  .filter((b) => b.unlockCondition.world === world.id)
                  .map((booster) => (
                    <BoosterIllustration
                      size={1}
                      title={booster.name}
                      key={booster.name}
                    />
                  ))}
              </div>
              <Ribbon className="px-16">Cards Multiplicators</Ribbon>
              <div className="grid grid-cols-2 gap-4">
                {[...allWorlds].reverse().map((w) => {
                  if (w.id > world.id) return null;
                  return (
                    <>
                      <WorldField world={w} />
                      <Field>
                        <p className="relative font-semibold text-center w-full">
                          x {(cardWorldMultiplier ** (w.id - 1)).toFixed(2)}
                        </p>
                      </Field>
                    </>
                  );
                })}
              </div>
            </div>
          </ScrollContainer>
        </Box>
      </div>
    </Modal>
  );
}
