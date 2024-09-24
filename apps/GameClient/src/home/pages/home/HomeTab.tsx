import { useState } from "react";
import { Cover } from "@repo/ui";
import {
  getImageUrl,
  ICONS,
  numberWithCommas,
  textureByRarity,
} from "@repo/lib";
import { InnerBord } from "../../../../../../packages/ui/components/card/CardBorder";
import AllWorlds from "./allWorlds/AllWorlds";
import ProfileModal from "./modals/ProfileModal";
import AnimationContainer from "@/home/animations/AnimationContainer";
import WorldIllustration from "./WorldIllustration";
import { Tabs } from "@/home/Home";
import useClientInterfaceStore from "@/home/store/clientInterfaceStore";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import BattleButton from "./BattleButton";

interface HomeTabProps {
  setCurrentTab?: (tab: Tabs) => void;
}

export default function HomeTab({ setCurrentTab }: HomeTabProps) {
  const { trophies } = usePlayerStore((state) => ({
    trophies: state.trophies,
  }));

  const [profileOpen, setProfileOpen] = useState(false);
  const { worldsModalOpen, setWorldsModalOpen } = useClientInterfaceStore(
    (state) => ({
      worldsModalOpen: state.worldsModalOpen,
      setWorldsModalOpen: state.setWorldsModalOpen,
    })
  );

  return (
    <div className="w-full max-w-[700px] h-full flex flex-col items-center">
      <AnimationContainer />
      {worldsModalOpen && (
        <AllWorlds
          closeModal={() => setWorldsModalOpen(false)}
          state={worldsModalOpen}
        />
      )}
      {profileOpen && <ProfileModal closeModal={() => setProfileOpen(false)} />}
      <div
        className="flex items-center gap-2 relative w-full px-4"
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
              src={getImageUrl(ICONS, "trophy.png")}
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
      <div className="flex flex-col items-center grow justify-center gap-16">
        <WorldIllustration
          setWorldsModalOpen={() => setWorldsModalOpen("normal")}
        />
        <BattleButton setCurrentTab={setCurrentTab} />
      </div>
    </div>
  );
}
