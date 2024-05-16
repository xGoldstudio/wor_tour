import DebugPanel from "@/DebugPanel";
import { EmptyBar } from "@/game/gui/ManaBar";
import { cn } from "@/lib/utils";
import HomeTab from "./pages/home/HomeTab";
import { useState } from "react";
import DeckTab from "./pages/deck/DeckTab";

type Tabs = "home" | "deck" | "shop";

const tabs: Record<Tabs, () => JSX.Element> = {
  home: HomeTab,
  deck: DeckTab,
  shop: HomeTab,
};

export default function Home() {
  const [currentTab, setCurrentTab] = useState<Tabs>("deck");

  const TabElement = tabs[currentTab];

  return (
    <div className="w-screen h-screen justify-center bg-black relative flex">
      <DebugPanel />
      <div
        className="w-[700px] h-full relative overflow-hidden bg-slate-400"
        id="home"
      >
        <div
          className="w-full h-full absolute blur-sm"
          style={{
            backgroundImage: "url('/homeBg.avif')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        ></div>
        <div className="w-full h-full relative flex flex-col items-center justify-between">
					<Header />
          <div className="grow relative w-full">
            <TabElement />
          </div>

          <div className="flex gap-4 w-full px-4 pt-4">
            <Button action={() => setCurrentTab("shop")} full>
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
}

function RessourceCounter({ amount, max }: RessourceCounterProps) {
  return (
    <div className="text-white border-slate-100 rounded-sm p-[3px] bg-slate-900 w-full border-2">
      <EmptyBar>
        <div className="w-full px-2 py-1 flex justify-center">
          <p>
            {amount}
            {max !== undefined ? `/${max}` : ""}
          </p>
        </div>
      </EmptyBar>
    </div>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  action: () => void;
  full?: boolean;
  small?: boolean;
}

export function Button({ children, action, full, small }: ButtonProps) {
  return (
    <button
      onClick={action}
      className={cn("rounded-sm overflow-hidden", full ? "w-full" : "")}
    >
      <EmptyBar>
        <div
          className={cn(
            "text-white h-full flex justify-center items-center w-full",
            !small ? "px-12 py-2" : "px-2"
          )}
        >
          {children}
        </div>
      </EmptyBar>
    </button>
  );
}

export function Header() {
  return (
    <div className="flex gap-4 px-8 py-4 w-full">
      <RessourceCounter amount={0} max={50} />
      <RessourceCounter amount={1} max={5} />
      <RessourceCounter amount={405} />
    </div>
  );
}
