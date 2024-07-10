import { useStartGame } from "@/game/stores/gameMetadataStore";
import { useState } from "react";
import { Cover, numberWithCommas, textureByRarity } from "@repo/ui";
import usePlayerStore from "@/home/store/playerStore";
import {
  InnerBord
} from "../../../../../../packages/ui/components/card/CardBorder";
import AllWorlds from "./allWorlds/AllWorlds";
import ProfileModal from "./modals/ProfileModal";
import AnimationContainer from "@/home/animations/AnimationContainer";
import WorldIllustration from "./WorldIllustration";

export default function HomeTab() {
  const startGame = useStartGame();

  const { trophies } = usePlayerStore((state) => ({
    trophies: state.trophies,
    currentWorld: state.currentWorld,
  }));
  const [profileOpen, setProfileOpen] = useState(false);
  const [worldsModalOpen, setWorldsModalOpen] = useState<
    false | "normal" | "tier" | "world"
  >(false);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <AnimationContainer setWorldsModalOpen={setWorldsModalOpen} />
      {worldsModalOpen && (
        <AllWorlds
          closeModal={() => setWorldsModalOpen(false)}
          state={worldsModalOpen}
        />
      )}
      {profileOpen && <ProfileModal closeModal={() => setProfileOpen(false)} />}
      <div
        className="flex items-center gap-2 relative w-full px-12"
        onClick={() => setProfileOpen(true)}
        id="trophyCount"
      >
        <div className="relative flex items-center justify-between gap-4 px-4 py-4 pr-20">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg width="100%" height="100%">
              <mask id="svgmask1">
                <rect fill="#ffffff" x={0} y={0} width="85%" height="100%" />
                <polygon fill="#ffffff" points="324 0, 383 0, 324 84"></polygon>
              </mask>
              <rect
                fill="black"
                x={0}
                y={0}
                width="100%"
                height="100%"
                mask="url(#svgmask1)"
              />
              <image
                className="blur-[6px]"
                href={textureByRarity("common")}
                x="0"
                y="0"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid slice"
                mask="url(#svgmask1)"
              />
            </svg>
          </div>
          <div className="flex flex-col h-min w-[160px] text-slate-100">
            <p className="relative font-semibold text-xl leading-2">Goldaxe</p>
            <p className="relative text-sm  leading-2">World 1</p>
          </div>
          <div className="relative w-[110px] h-[32px]" x-id="trophyCountInput">
            <img
              id="trophyCountIcon"
              src="/trophy.png"
              className="absolute z-10 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[48px] drop-shadow-[2px_1px_1px_black]"
            />
            <InnerBord size={1.5}>
              <div className="w-full h-full relative bg-slate-600 flex items-center justify-end pr-2">
                <Cover cardRarity="rare" />
                <p
                  className="relative font-semibold"
                  x-id="trophyCountInputTrophies"
                >
                  {numberWithCommas(trophies)}
                </p>
              </div>
            </InnerBord>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-16 items-center grow pt-20">
        <WorldIllustration setWorldsModalOpen={setWorldsModalOpen} />
        <div
          id="battleButton"
          className="relative rounded-sm flex p-1 flex-col items-center font-slate-600 cursor-pointer"
          onClick={() => startGame()}
        >
          <div className="w-[calc(100%_+_6px)] h-[calc(100%_+_6px)] absolute top-[-3px] left-[-3px] blur-sm rounded-sm  bg-amber-100 animate-[shiny_2s_ease-in-out_infinite]"></div>
          <Cover cardRarity="epic" className="rounded-sm" />
          <div className="relative rounded-sm w-full flex justify-center py-2 mx-4">
            <div className="bg-white w-full h-full absolute top-0 backdrop-blur-sm opacity-50 rounded-sm"></div>
            <p className="text-2xl relative font-bold">Battle</p>
          </div>
          <div className="relative flex items-center gap-3 justify-center px-16">
            <img
              src="/money.png"
              className="h-[48px] drop-shadow-[2px_1px_1px_black]"
            />
            <div className="relative">
              <p className="text-sm font-semibold leading-4">900/5000</p>
              <p className="text-sm leading-4">reset in: 2h50</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
