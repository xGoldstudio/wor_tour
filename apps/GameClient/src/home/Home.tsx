import DebugPanel from "@/DebugPanel";
import HomeTab from "./pages/home/HomeTab";
import { useState } from "react";
import DeckTab from "./pages/deck/DeckTab";
import ShopTab from "./pages/shop/ShopTab";
import { RewardBlockWithContext } from "./pages/reward/Reward";
import usePlayerStore from "./store/playerStore";
import Badge from "../../../../packages/ui/components/Badge";
import { Button, NumberSpan } from "@repo/ui";
import { cn } from "@repo/ui";
import { Borders, CardIllustartion, InnerBord } from "../../../../packages/ui/components/card/CardBorder";

type Tabs = "home" | "deck" | "shop";

const tabs: Record<Tabs, () => JSX.Element> = {
  home: HomeTab,
  deck: DeckTab,
  shop: ShopTab,
};

export default function Home() {
  const [currentTab, setCurrentTab] = useState<Tabs>("home");

  const TabElement = tabs[currentTab];

  return (
    <div className="w-screen h-screen justify-center bg-black relative flex">
      <DebugPanel />
      <div
        className="w-[700px] h-full relative overflow-hidden bg-slate-400"
        id="home"
      >
        <RewardBlockWithContext />
        <div
          className="w-full h-full absolute brightness-75"
          style={{
            backgroundImage: "url('/homeBg.png')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="w-full h-full absolute bg-[linear-gradient(0deg,_rgba(226,232,240,0.2)_0%,_rgba(226,232,240,0)_100%),_linear-gradient(0deg,_rgba(226,232,240,0)_50%,_rgba(226,232,240,1)_70%)]" />
        </div>
        <div className="w-full h-full relative flex flex-col items-center justify-between">
          <Header />
          <div className="grow relative w-full">
            <TabElement />
          </div>

          <div className="flex gap-4 w-[500px] px-4 pt-2 pb-4">
            <Button action={() => setCurrentTab("shop")} full className="py-4">
              Shop
            </Button>
            <Button action={() => setCurrentTab("deck")} full>
              Deck
            </Button>
            <Button action={() => setCurrentTab("home")} full>
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RessourceCounterProps {
  amount: number;
  max?: number;
  icon: React.ReactNode;
}

function RessourceCounter({ amount, max, icon }: RessourceCounterProps) {
  return (
    <div className="relative">
      {icon}
      <Borders width={191} height={45} borderUnit={1} rarity={"common"}>
        <CardIllustartion width={191} height={45} borderUnit={0.6}>
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
                  max === undefined && "text-right w-full pr-2",
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
