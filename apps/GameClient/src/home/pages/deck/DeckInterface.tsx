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
        currentTab !== children?.toString() ? "opacity-70" : null,
        "w-[200px] h-[45px] hover:cursor-pointer"
      )}
      onClick={() => setCurrentTab(children?.toString() as Tabs)}
    >
      <div className="rounded-sm overflow-hidden text-nowrap relative z-10 font-semibold  h-full">
        <div
          className="absolute w-full h-full blur-sm"
          style={{
            backgroundImage: `url(/${textureByRarity("common")})`,
            backgroundSize: "cover",
            backgroundPositionY: "center",
          }}
        />
        <div className="text-black h-full flex justify-center items-center relative px-12 ">
          {children}
        </div>
      </div>
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
      <div className="w-full h-[55px] hover:cursor-pointer">
        <div className="overflow-hidden relative z-10 font-semibold h-full">
          <div
            className="absolute w-full h-full blur-sm"
            style={{
              backgroundImage: `url(/${textureByRarity("common")})`,
              backgroundSize: "cover",
              backgroundPositionY: "center",
            }}
          />
        </div>
      </div>
      <div className="w-full flex justify-center overflow-hidden">
        <TabElement />
      </div>
    </div>
  );
}
