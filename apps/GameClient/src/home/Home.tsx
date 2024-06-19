import DebugPanel from "@/DebugPanel";
import HomeTab from "./pages/home/HomeTab";
import { useState } from "react";
import DeckTab from "./pages/deck/DeckTab";
import ShopTab from "./pages/shop/ShopTab";
import { RewardBlockWithContext } from "./pages/reward/Reward";
import usePlayerStore from "./store/playerStore";
import Badge from "../../../../packages/ui/components/Badge";
import { NumberSpan } from "@repo/ui";
import { cn } from "@repo/ui";
import {
  Borders,
  CardIllustartion,
  InnerBord,
} from "../../../../packages/ui/components/card/CardBorder";
import Cover from "./ui/Cover";
import AllWorlds from "./pages/home/AllWorlds";

type Tabs = "home" | "deck" | "shop";

const tabs: (() => JSX.Element)[] = [ShopTab, HomeTab, DeckTab];

const tabsPosition: Record<Tabs, number> = {
  shop: 0,
  home: 1,
  deck: 2,
};

export default function Home() {
  const [currentTab, setCurrentTab] = useState<Tabs>("home");

  return (
    <div className="w-screen h-screen justify-center bg-black relative flex">
      <DebugPanel />
      <div
        className="w-[700px] h-full relative overflow-hidden bg-slate-900"
        id="home"
      >
        <AllWorlds />
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
              <div className="w-full h-full relative">
                <Tab />
              </div>
            ))}
          </div>

          <div className="flex w-full bg-black relative z-10">
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
              imageUrl="footer/backpack.png"
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
              imageUrl="footer/collection.png"
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
        src={imageUrl}
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
    <div
      className="w-full h-full absolute brightness-75 "
      style={{
        backgroundImage: "url('/homeBg.jpeg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full h-full absolute bg-[radial-gradient(circle,_rgba(226,232,240,0.1)_40%,_rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}

interface RessourceCounterProps {
  amount: number;
  max?: number;
  icon: React.ReactNode;
  width?: number;
}

export function RessourceCounter({
  amount,
  max,
  icon,
  width = 191,
}: RessourceCounterProps) {
  return (
    <div className="relative">
      {icon}
      <Borders width={width} height={45} borderUnit={1} rarity={"epic"}>
        <CardIllustartion width={width} height={45} borderUnit={0.6}>
          <InnerBord size={1}>
            <div className="w-full h-full relative flex items-center justify-center bg-black overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full h-full blur-sm"
                style={{ backgroundImage: "url(/silver.jpeg)" }}
              />
              {max && (
                <div
                  className="absolute top-0 left-0 h-full bg-blue-400 overflow-hidden"
                  style={{ width: `${(amount / max) * 100}%` }}
                />
              )}
              <p
                className={cn(
                  "relative font-semibold",
                  max === undefined && "text-right w-full pr-2"
                )}
              >
                <NumberSpan>{amount}</NumberSpan>
                {max !== undefined && (
                  <>
                    /<NumberSpan>{max}</NumberSpan>
                  </>
                )}
              </p>
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
      <RessourceCounter
        amount={26}
        max={50}
        icon={
          <Badge
            className="absolute z-10 left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
            value="1"
          />
        }
      />
      <RessourceCounter
        amount={4}
        max={5}
        icon={
          <img
            src="/key.png"
            className="absolute z-10 left-[3px] top-1/2 -translate-x-1/2 -translate-y-1/2 h-[32px] drop-shadow-[2px_1px_1px_black] rotate-[25deg] contrast-150"
          />
        }
      />
      <RessourceCounter
        amount={gold}
        icon={
          <img
            src="/money.png"
            className="absolute z-10 left-[3px] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[32px] drop-shadow-[2px_1px_1px_black]"
          />
        }
      />
    </div>
  );
}
