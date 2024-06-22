import { useStartGame } from "@/game/stores/gameMetadataStore";
import { useState } from "react";
import useDataStore from "@/cards/DataStore";
import { getImageUrl, numberWithCommas, textureByRarity } from "@repo/ui";
import usePlayerStore from "@/home/store/playerStore";
import Cover from "@/home/ui/Cover";
import { EmptyBar } from "@/game/gui/ManaBar";
import {
  Borders,
  CardIllustartion,
  InnerBord,
} from "../../../../../../packages/ui/components/card/CardBorder";
import AllWorlds from "./AllWorlds";
import ProfileModal from "./modals/ProfileModal";
import _ from "lodash";

export default function HomeTab() {
  const startGame = useStartGame();

  const { trophies, currentWorld } = usePlayerStore((state) => ({
    trophies: state.trophies,
    currentWorld: state.currentWorld,
  }));
  const { world } = useDataStore((state) => ({
    world: state.worlds[currentWorld - 1],
  }));
  const [profileOpen, setProfileOpen] = useState(false);
  const [worldsModalOpen, setWorldsModalOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center">
      {worldsModalOpen && (
        <AllWorlds closeModal={() => setWorldsModalOpen(false)} />
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
                <p className="relative font-semibold"  x-id="trophyCountInputTrophies">{numberWithCommas(trophies)}</p>
              </div>
            </InnerBord>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-16 items-center grow pt-20">
        <div
          className="relative w-1/2"
          onClick={() => setWorldsModalOpen(true)}
        >
          <img
            className="w-full aspect-square relative drop-shadow-[-25px_15px_1px_rgba(0,0,0,0.5)]"
            src={getImageUrl(world.illustration)}
          />
          <CurrentWorldProgress />
        </div>
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

function CurrentWorldProgress() {
  const { currentWorld, currentTrophies, maxTrophies, rewardToCollect } =
    usePlayerStore((state) => ({
      currentWorld: state.currentWorld,
      currentTrophies: state.trophies,
      maxTrophies: state.maxTrophies,
      rewardToCollect: state.toCollectTrophiesRewards.size,
    }));

  const trophiesMin = (currentWorld - 1) * 1000;
  const trophiesMax = currentWorld * 1000;
  const diffTrophies = trophiesMax - trophiesMin;
  const progressPercent =
    ((currentTrophies - trophiesMin) / diffTrophies) * 100;

  const maxTrophiesProgressPercent =
    ((maxTrophies - trophiesMin) / diffTrophies) * 100;

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-md">
      <img
        src="/trophy.png"
        className="absolute z-10 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[48px] drop-shadow-[2px_1px_1px_black]"
      />
      {rewardToCollect > 0 && (
        <div className="absolute right-0 top-0 z-10 -translate-y-1/2 translate-x-1/2">
          <div className="w-[20px] h-[20px] bg-slate-200 rounded-sm overflow-hidden flex items-center justify-center">
            <div className="w-[calc(100%_+_3px)] h-[calc(100%_+_3px)] absolute top-[-1.5px] left-[-1.5px] blur-[2px] rounded-sm  bg-amber-100 animate-[shiny_2s_ease-in-out_infinite]"></div>

            <Cover cardRarity="epic" />
            <p className="text-sm z-10 text-slate-100">{rewardToCollect}</p>
          </div>
        </div>
      )}
      <Borders width={170} height={32} borderUnit={0.5} rarity={"rare"}>
        <CardIllustartion width={170} height={32} borderUnit={0.5}>
          <InnerBord size={0.5}>
            <div className="w-full h-full relative overflow-hidden">
              <EmptyBar>
                <div
                  className="absolute top-0 w-full h-full left-0 bg-gradient-to-b from-[#88157F] via-[#D464CB] via-[37%] to-[#88157F] origin-left brightness-200 opacity-30"
                  style={{
                    transform: `scaleX(${maxTrophiesProgressPercent}%)`,
                  }}
                />
                <div
                  className="absolute top-0 w-full h-full left-0 bg-gradient-to-b from-[#88157F] via-[#D464CB] via-[37%] to-[#88157F] origin-left brightness-125"
                  style={{ transform: `scaleX(${progressPercent}%)` }}
                />
              </EmptyBar>
            </div>
            <svg className="absolute top-0 left-0" viewBox="0 0 100 14">
              <mask id="trophiesMask">
                {_.range(9).map((i) => (
                  <rect
                    key={i}
                    x={(i + 1) * 10}
                    y={0}
                    width={1}
                    height={14}
                    fill="white"
                  />
                ))}
              </mask>
              <rect
                fill="black"
                x={0}
                y={0}
                width="100%"
                height="100%"
                mask="url(#trophiesMask)"
              />
              <image
                className="blur-[6px]"
                href={textureByRarity("rare")}
                x="0"
                y="0"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid slice"
                mask="url(#trophiesMask)"
              />
            </svg>
          </InnerBord>
        </CardIllustartion>
      </Borders>
    </div>
  );
}
