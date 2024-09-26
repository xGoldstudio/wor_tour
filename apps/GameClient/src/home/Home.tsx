import DebugPanel from "@/DebugPanel";
import HomeTab from "./pages/home/HomeTab";
import { useRef, useState } from "react";
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
  useOnWrapperResize,
} from "@repo/ui";
import { cn } from "@repo/ui";
import {
  COMMON, getImageUrl,
  getImageUrlCssValue,
  ICONS,
  numberWithCommas,
  textureByRarity
} from "@repo/lib";
import KeysOutput from "./ui/KeysOutput";
import Timer from "@/services/LoopService/Timer";
import ExperienceOutput from "./ui/ExperienceOutput";
import { useEditionMode } from "./pages/deck/context/UseEditionMode";
import Footer from "./ui/Footer";

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
        className="w-full h-full relative overflow-hidden bg-slate-900"
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
              <div
                className="w-full h-full relative flex justify-center"
                key={Tab.name}
              >
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

          <Footer
            setCurrentTab={setCurrentTab}
            currentTab={currentTab}
            tabsPosition={tabsPosition}
            editionMode={editionMode}
          />
        </div>
      </div>
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
          backgroundImage: getImageUrlCssValue(COMMON, "homeBg.png"),
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
  name: string;
  timer?: string;
}

export function RessourceCounter({
  amount,
  max,
  icon,
  name,
  timer,
}: RessourceCounterProps) {
  const container = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);

  useOnWrapperResize(() => {
    setWidth(container.current?.clientWidth || 0);
  }, container);

  return (
    <div className="relative w-full" x-id={`${name}CountInput`} id={`${name}Count`} ref={container}>
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
    <div className="grid grid-cols-3 gap-4 max-[700px]:px-4 py-4 w-full justify-between max-w-[700px]">
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
