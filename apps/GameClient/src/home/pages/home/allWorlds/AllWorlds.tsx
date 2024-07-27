import { HomeBg } from "@/home/Home";
import { Button, cn, Cover } from "@repo/ui";
import TrophyBar from "./trophyBar/TrophyBar";
import AllWorldsAnimationProvider, {
  AllWorldsAnimationContext,
  AllWorldsAnimationContextType,
} from "./trophyBar/TrophyBarContext";
import { useContext, useRef } from "react";
import { createPortal } from "react-dom";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import ScrollContainer from "react-indiana-drag-scroll";
import WorldPreview from "./WorldPreview";
import LevelPreview from "./LevelPreview";
import WorldUnlock from "./WorldUnlock";

export type AllWorldsStateType = "normal" | "tier" | "world";

export default function AllWorlds({
  closeModal,
  state,
}: {
  closeModal: () => void;
  state: AllWorldsStateType;
}) {
  const home = document.getElementById("home");

  if (!home) return null;

  return createPortal(
    <AllWorldsAnimationProvider state={state}>
      <AllWorldsInner closeModal={closeModal} />
    </AllWorldsAnimationProvider>,
    home
  );
}

function AllWorldsInner({ closeModal }: { closeModal: () => void }) {
  const { trophies, maxTrophies, currentWorld } = usePlayerStore((state) => ({
    trophies: state.trophies,
    maxTrophies: state.maxTrophies,
    currentWorld: state.currentWorld,
  }));
  const tiers = [
    ...usePlayerStore((state) => state.tiers).values(),
  ].reverse();
  const { state } = useContext(
    AllWorldsAnimationContext
  ) as AllWorldsAnimationContextType;

  const scrollerRef = useRef<null | HTMLDivElement>(null);
  const showWorldUnlock = useRef(state === "world");

  return (
    <>
      {showWorldUnlock.current && <WorldUnlock closeModal={closeModal} />}
      {state !== "world" && (
        <div
          className={cn(
            "allWorlds",
            "absolute top-0 w-full h-full grid grid-cols-1 grid-rows-[1fr_66px] items-center justify-end z-20 select-none"
          )}
        >
          <HomeBg />
          <ScrollContainer
            className={cn(
              "allWorldsScrollerContainer",
              "max-h-[100%] overflow-hidden w-full flex flex-col relative overflow-y-scroll"
            )}
            innerRef={scrollerRef}
          >
            <div className="relative">
              <TrophyBar
                numberOfTrophies={trophies}
                maxNumberOfTrophies={maxTrophies}
                currentWorld={currentWorld}
              />
              <div className="w-full flex flex-col items-center gap-8">
                {tiers.map((tier) =>
                  tier.isWorld ? (
                    <WorldPreview tier={tier} key={tier.tier} />
                  ) : (
                    <LevelPreview tier={tier} key={tier.tier} />
                  )
                )}
              </div>
              <div className="w-full h-32"></div>
            </div>
          </ScrollContainer>
          <div className="w-full h-full relative bg-slate-600 flex justify-center items-center z-20">
            <Cover cardRarity="rare" />
            <Button
              action={closeModal}
              rarity="epic"
              className="px-20 text-white"
            >
              Ok
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
