import { cn, textureByRarity } from "@repo/ui";
import { useState } from "react";
import CollectionTab from "./CollectionTab";
import DeckTab from "./DeckTab";

type Tabs = "Deck" | "Collection";

const tabs: Record<Tabs, () => JSX.Element> = {
  Deck: DeckTab,
  Collection: CollectionTab,
};

interface TabModalProps {
  children: string;
  currentTab: Tabs;
  setCurrentTab: (tab: Tabs) => void;
}

function TabModal({ children, currentTab, setCurrentTab }: TabModalProps) {
  return (
    <div
      className={cn(
        currentTab !== children?.toString() ? "opacity-50" : null,
        "w-[200px] h-[45px] hover:cursor-pointer"
      )}
      onClick={() => setCurrentTab(children?.toString() as Tabs)}
    >
      <svg width="100%" height="100%">
        <rect width="100%" height="100%" />
        <image
          className="blur-[6px]"
          href={textureByRarity("common")}
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
        />{" "}
        {currentTab === children?.toString() && (
          <rect width="100%" height="100%" fill="black" opacity="0.1" />
        )}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          className="font-bold text-lg"
        >
          {children}
        </text>
      </svg>
    </div>
  );
}

export function DeckInterface() {
  const [currentTab, setCurrentTab] = useState<Tabs>("Deck");
  const TabElement = tabs[currentTab];

  return (
    <div>
      <div className="m-2 relative flex justify-center gap-2 -mb-[0px]">
        <TabModal currentTab={currentTab} setCurrentTab={setCurrentTab}>
          Deck
        </TabModal>
        <TabModal currentTab={currentTab} setCurrentTab={setCurrentTab}>
          Collection
        </TabModal>
      </div>
      {/* <div
        className="w-full h-[55px] z-10 opacity-80"
        style={{
          backgroundImage: "url(/wood-horizontal.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div> */}
      <div className="w-full h-[55px]">
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" />
          <image
            className="blur-[6px]"
            href={textureByRarity("common")}
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
          />
        </svg>
      </div>
      <div className="w-full flex justify-center overflow-hidden">
        <TabElement />
      </div>
    </div>
  );
}
