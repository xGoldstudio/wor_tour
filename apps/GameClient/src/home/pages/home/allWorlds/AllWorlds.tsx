import useDataStore from "@/cards/DataStore";
import { HomeBg } from "@/home/Home";
import Cover from "@/home/ui/Cover";
import { Button, cn } from "@repo/ui";
import TrophyBar from "./trophyBar/TrophyBar";
import AllWorldsAnimationProvider from "./trophyBar/TrophyBarContext";
import { useRef } from "react";
import { createPortal } from "react-dom";
import usePlayerStore from "@/home/store/playerStore";
import ScrollContainer from "react-indiana-drag-scroll";
import WorldPreview from "./WorldPreview";

export default function AllWorlds({ closeModal }: { closeModal: () => void }) {
  const home = document.getElementById("home");

  if (!home) return null;

  return createPortal(
    <AllWorldsAnimationProvider>
      <AllWorldsInner closeModal={closeModal} />
    </AllWorldsAnimationProvider>,
    home
  );
}

function AllWorldsInner({ closeModal }: { closeModal: () => void }) {
  const { worlds } = useDataStore((state) => ({
    worlds: [...state.worlds].reverse(),
  }));
  const { trophies, maxTrophies, currentWorld } = usePlayerStore((state) => ({
    trophies: state.trophies,
    maxTrophies: state.maxTrophies,
    currentWorld: state.currentWorld,
  }));

  const scrollerRef = useRef<null | HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "allWorlds",
        "absolute top-0 w-full h-full grid grid-cols-1 grid-rows-[1fr_66px] items-center justify-end z-20 select-none opacity-100"
      )}
    >
      <div className="absolute w-full h-full z-20 hidden" id="scrollBlocker" />
      <HomeBg />
      <ScrollContainer
        className={cn(
          "allWorldsScrollerContainer",
          "max-h-[100%] overflow-hidden w-full flex flex-col relative"
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
            {worlds.map((world) => (
              <WorldPreview
                world={world}
                key={world.id}
                scroller={scrollerRef.current}
              />
            ))}
          </div>
          <div className="w-full h-32"></div>
        </div>
      </ScrollContainer>
      <div className="w-full h-full relative bg-slate-600 flex justify-center items-center z-20">
        <Cover cardRarity="rare" />
        <Button action={closeModal} rarity="epic" className="px-20 text-white">
          Ok
        </Button>
      </div>
    </div>
  );
}
