import DebugPanel from "@/DebugPanel";
import HomeTab from "./pages/home/HomeTab";
import { useState } from "react";
import { DeckInterface as DeckTab } from "./pages/deck/DeckInterface";
import ShopTab from "./pages/shop/ShopTab";
import { RewardBlockWithContext } from "./pages/reward/Reward";
import usePlayerStore from "./store/playerStore/playerStore";
import {
  Borders,
  Button,
  CardIllustartion,
  Cover,
  InnerBord,
  NumberSpan,
} from "@repo/ui";
import { cn } from "@repo/ui";
import { COMMON, FOOTER_SRC, getImageUrl, getImageUrlCssValue, ICONS, numberWithCommas, textureByRarity } from "@repo/lib";
import KeysOutput from "./ui/KeysOutput";
import Timer from "@/services/LoopService/Timer";
import ExperienceOutput from "./ui/ExperienceOutput";
import { useEditionMode } from "./pages/deck/context/UseEditionMode";

export type Tabs = "home" | "deck" | "shop";

const tabs: (({
  setCurrentTab,
}: {
  setCurrentTab: (tab: Tabs) => void;
}) => JSX.Element)[] = [ShopTab, HomeTab, DeckTab];

const tabsPosition: Record<Tabs, number> = {
  shop: 0,
  home: 1,
  deck: 2,
};
export default function Home() {
  const [currentTab, setCurrentTab] = useState<Tabs>("home");
  const { editionMode, setEditionMode } = useEditionMode();
  return (
    <div className="w-screen h-screen justify-center bg-black relative flex">
      <DebugPanel />
      <div
        className="w-[700px] h-full relative overflow-hidden bg-slate-900"
        id="home"
      >
        <RewardBlockWithContext />
        <HomeBg />
        <div className="w-full h-full relative flex flex-col items-center justify-between">
          <Header />
          <div
            className={cn(
              `grow overflow-hidden relative grid grid-cols-${tabs.length} transition-transform`
            )}
            style={{
              width: tabs.length * 100 + "%",
              alignSelf: "flex-start",
              transform: `translateX(${-(tabsPosition[currentTab] * (100 / tabs.length))}%)`,
            }}
          >
            {tabs.map((Tab) => (
              <div className="w-full h-full relative" key={Tab.name}>
                <Tab setCurrentTab={setCurrentTab} />
              </div>
            ))}
          </div>
          {editionMode && (
            <div className="h-[70px] w-full bg-white relative z-10 ">
              <div className="grow h-full bg-slate-600 relative flex items-center justify-center">
                <Cover cardRarity="rare" />
                <Button rarity="epic" action={() => setEditionMode(false)}>
                  Done
                </Button>
              </div>
            </div>
          )}

          <div
            className={cn(
              "flex w-full bg-black relative z-10",
              editionMode && "hidden"
            )}
          >
            <div className="w-full h-full absolute flex overflow-hidden">
              <div className="grow h-full bg-slate-600 relative">
                <Cover cardRarity="rare" />
              </div>
              <div className="grow h-full bg-slate-600 relative">
                <Cover cardRarity="rare" />
              </div>
              <div className="grow h-full bg-slate-600 relative">
                <Cover cardRarity="rare" />
              </div>
            </div>
            <div
              className="w-1/3 h-full absolute transition-transform overflow-hidden"
              style={{
                transform: `translateX(${100 * tabsPosition[currentTab]}%)`,
              }}
            >
              <Cover cardRarity="epic" />
            </div>
            <FooterButton
              onClick={() => setCurrentTab("shop")}
              label="Shop"
              selected={currentTab === "shop"}
              imageUrl="backpack.png"
            />
            <FooterButton
              onClick={() => setCurrentTab("home")}
              label="Battle"
              selected={currentTab === "home"}
              imageUrl="fightback.png"
            />
            <FooterButton
              onClick={() => setCurrentTab("deck")}
              label="Collection"
              selected={currentTab === "deck"}
              imageUrl="collection.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface FooterButtonProps {
  onClick: () => void;
  label: string;
  selected?: boolean;
  imageUrl?: string;
}

function FooterButton({
  onClick,
  label,
  selected,
  imageUrl,
}: FooterButtonProps) {
  return (
    <div
      className="relative grow font-semibold text-xl flex justify-center items-center flex-col h-[70px] cursor-pointer select-none"
      onClick={onClick}
    >
      <img
        src={getImageUrl(FOOTER_SRC, imageUrl ?? "")}
        alt="chest"
        className={cn(
          "w-[64px] aspect-square relative transition-transform",
          selected && "scale-110 -translate-y-6"
        )}
      />
      {selected && (
        <p
          className={cn(
            "absolute bottom-[3px] opacity-0 transition-opacity",
            selected && "opacity-100"
          )}
        >
          {label}
        </p>
      )}
    </div>
  );
}

export function HomeBg() {
  return (
    <div className="w-full h-full absolute ">
      <div className="w-full h-full absolute bg-black" />
      <div
        className="w-full h-full absolute blur-sm"
        style={{
          backgroundImage: getImageUrlCssValue(COMMON, "homeBg.jpeg"),
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="w-full h-full absolute bg-[radial-gradient(circle,_rgba(226,232,240,0.1)_40%,_rgba(0,0,0,0.4)_100%)]" />
      </div>
    </div>
  );
}

interface RessourceCounterProps {
  amount: number;
  max?: number;
  icon: React.ReactNode;
  width?: number;
  name: string;
  timer?: string;
}

export function RessourceCounter({
  amount,
  max,
  icon,
  width = 191,
  name,
  timer,
}: RessourceCounterProps) {
  return (
    <div className="relative" x-id={`${name}CountInput`} id={`${name}Count`}>
      {icon}
      <Borders width={width} height={45} borderUnit={1} rarity={"epic"}>
        <CardIllustartion width={width} height={45} borderUnit={0.6}>
          <InnerBord size={1}>
            <div className="w-full h-full relative flex items-center justify-center bg-black overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full h-full blur-sm"
                style={{ backgroundImage: `url(${textureByRarity("rare")})` }}
              />
              {max && (
                <div
                  className="absolute top-0 left-0 h-full bg-blue-400 overflow-hidden"
                  style={{ width: `${(amount / max) * 100}%` }}
                  id={`${name}CountProgressBar`}
                />
              )}
              <p
                className={cn(
                  "relative font-semibold",
                  max === undefined && "text-right w-full pr-2"
                )}
              >
                <span x-id={`${name}CountInputValue`}>
                  {numberWithCommas(amount)}
                </span>
                {max !== undefined && (
                  <>
                    /<NumberSpan>{max}</NumberSpan>
                  </>
                )}
              </p>
              {timer && (
                <div className="absolute top-1/2 -translate-y-1/2 right-1 text-sm w-[40px]">
                  <Timer name={timer} options={{ removeHours: true }} />
                </div>
              )}
            </div>
          </InnerBord>
        </CardIllustartion>
      </Borders>
    </div>
  );
}

export function Header() {
  const { gold } = usePlayerStore((state) => ({
    gold: state.gold,
  }));

  return (
    <div className="flex gap-4 px-8 py-4 w-full justify-center">
      <ExperienceOutput />
      <KeysOutput />
      <RessourceCounter
        amount={gold}
        icon={
          <img
            id="moneyCountIcon"
            src={getImageUrl(ICONS, "money.png")}
            className="absolute z-10 left-[3px] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[32px] drop-shadow-[2px_1px_1px_black]"
          />
        }
        name="money"
      />
    </div>
  );
}
