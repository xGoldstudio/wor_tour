import { cn, Cover } from "@repo/ui";
import { useEffect, useState } from "react";
import CollectionTab from "./CollectionTab";
import DeckTab from "./DeckTab";
import { useEditionMode } from "./context/UseEditionMode";
import usePlayerStore from "@/home/store/playerStore/playerStore";

export type Tabs = "Deck" | "Collection";

export interface TabProps {
  setCurrentTab: (tab: Tabs) => void;
}

const tabs: Record<Tabs, React.FC<TabProps>> = {
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
        "w-full h-[40px] hover:cursor-pointer shadow-md rounded-t-md "
      )}
      onClick={() => setCurrentTab(children?.toString() as Tabs)}
    >
      <div className="rounded-t-md overflow-hidden text-nowrap relative z-10 font-semibold h-full">
        <Cover cardRarity="rare" className="bg-slate-400" />
        <div className="text-slate-900 font-bold h-full flex justify-center items-center relative px-12 ">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DeckInterface() {
  const [currentTab, setCurrentTab] = useState<Tabs>("Deck");
  const TabElement = tabs[currentTab];
  const { editionMode, setEditionMode } = useEditionMode();
  const { deck } = usePlayerStore((state) => ({
    deck: state.deck,
  }));

  useEffect(() => {
    if (editionMode && currentTab !== "Deck") {
      setCurrentTab("Deck");
    }
  }, [editionMode]);

  useEffect(() => {
    if (currentTab !== "Deck") {
      setCurrentTab("Deck");
    }
  }, [deck]);

  useEffect(() => {
    if (currentTab !== "Deck" && editionMode) {
      setEditionMode(false);
    }
  }, [currentTab])

  return (
    <div className="w-full max-w-[700px] pt-4 flex flex-col">
      <div className="mx-8 relative flex justify-around gap-4">
        <TabModal currentTab={currentTab} setCurrentTab={setCurrentTab}>
          Deck
        </TabModal>
        <TabModal currentTab={currentTab} setCurrentTab={setCurrentTab}>
          Collection
        </TabModal>
      </div>
      <div className="w-full h-[40px] hover:cursor-pointer bg-slate-400">
        <div className="overflow-hidden relative z-10 font-semibold h-full">
          <Cover cardRarity="rare" />
        </div>
      </div>
      <TabElement setCurrentTab={setCurrentTab} />
    </div>
  );
}
