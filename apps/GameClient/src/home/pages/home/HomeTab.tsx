import { useStartGame } from "@/game/stores/gameMetadataStore";
import { useState } from "react";
import { cn, Cover } from "@repo/ui";
import { numberWithCommas, textureByRarity } from "@repo/lib";
import usePlayerStore from "@/home/store/playerStore";
import { InnerBord } from "../../../../../../packages/ui/components/card/CardBorder";
import AllWorlds from "./allWorlds/AllWorlds";
import ProfileModal from "./modals/ProfileModal";
import AnimationContainer from "@/home/animations/AnimationContainer";
import WorldIllustration from "./WorldIllustration";
import { Tabs } from "@/home/Home";
import { useEditionMode } from "../deck/context/UseEditionMode";

interface HomeTabProps {
  setCurrentTab?: (tab: Tabs) => void;
}

export default function HomeTab({ setCurrentTab }: HomeTabProps) {
  const startGame = useStartGame();
  const { setEditionMode } = useEditionMode();

  const { trophies, isDeckFull } = usePlayerStore((state) => ({
    trophies: state.trophies,
    currentWorld: state.currentWorld,
    isDeckFull: state.isDeckFull(),
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
          className={cn(
            "relative rounded-sm flex p-1 flex-col items-center font-slate-600 cursor-pointer",
            !isDeckFull && "brightness-75"
          )}
          onClick={() => {
            isDeckFull ? startGame() : setCurrentTab!("deck"),
              setEditionMode(true);
          }}
        >
          <div
            className={cn(
              "w-[calc(100%_+_6px)] h-[calc(100%_+_6px)] absolute top-[-3px] left-[-3px] blur-sm rounded-sm bg-amber-100  animate-[shiny_2s_ease-in-out_infinite]",
              !isDeckFull && "bg-gray-950"
            )}
          ></div>

          {isDeckFull ? (
            <Cover cardRarity="epic" className="rounded-sm" />
          ) : (
            <>
              <div className="h-7 w-3/5 flex items-center justify-center absolute -top-7 bg-gray-800  backdrop-blur-sm opacity-80 rounded-t-sm font-bold text-white">
                Deck Incomplete
              </div>
              <Cover cardRarity="rare" className="rounded-sm" />
            </>
          )}
          <div className="relative rounded-sm w-full flex justify-center py-2 mx-4">
            <div
              className={cn(
                "bg-white w-full h-full absolute top-0 backdrop-blur-sm opacity-50 rounded-sm",
                !isDeckFull && "bg-gray-800"
              )}
            ></div>
            {!isDeckFull && (
              <img
                src="/padlock-nobg.png"
                className="h-[22px] absolute top-1/2 -translate-y-1/2 left-[4.65rem] brightness-75"
                alt="padlock"
              />
            )}
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
