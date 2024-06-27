import { cn } from "@repo/ui";
import React, { useState } from "react";
import CollectionTab from "./CollectionTab";
import DeckTab from "./DeckTab";

type Tabs = "Deck" | "Collection";

const tabs: Record<Tabs, () => JSX.Element> = {
  Deck: DeckTab,
  Collection: CollectionTab,
};

interface TabModalProps {
  children: React.ReactNode;
  currentTab: Tabs;
  setCurrentTab: (tab: Tabs) => void;
}

function TabModal({ children, currentTab, setCurrentTab }: TabModalProps) {
  return (
    <div
      className={cn(
        "h-[35px] w-[200px] bg-blue-300 flex justify-center items rounded-t-lg text-xl hover:cursor-pointer",
        currentTab !== children?.toString() ? "opacity-50" : null
      )}
      style={{
        backgroundImage: "url(/wood-vertical.jpg)",
        backgroundSize: "cover",
        backgroundPosition: cn(
          "bottom 50px right 100px",
          children?.toString() === "Deck" ? "bottom 0px" : null
        ),
      }}
      onClick={() => setCurrentTab(children?.toString() as Tabs)}
    >
      {children}
    </div>
  );
}

export default function DeckInterface() {
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
      <div
        className="w-full h-[55px] z-10 opacity-80"
        style={{
          backgroundImage: "url(/wood-horizontal.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="w-full flex justify-center overflow-hidden">
        <TabElement />
      </div>
    </div>
  );
}
