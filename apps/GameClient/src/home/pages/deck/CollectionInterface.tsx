import { CARD_BORDER_HEIGHT, CARD_BORDER_WIDTH, cn, Cover } from "@repo/ui";
import { useEffect, useRef, useState } from "react";
import CollectionTab from "./CollectionTab";
import DeckTab from "./DeckTab";
import { useEditionMode } from "./context/UseEditionMode";
import usePlayerStore from "@/home/store/playerStore/playerStore";

export type CollectionTabs = "Deck" | "Collection";

export interface CollectionTabProps {
  size: number;
}

const tabs: Record<CollectionTabs, React.FC<CollectionTabProps>> = {
  Deck: DeckTab,
  Collection: CollectionTab,
};

interface TabModalProps {
  children: string;
  currentTab: CollectionTabs;
  setCurrentTab: (tab: CollectionTabs) => void;
}

function TabModal({ children, currentTab, setCurrentTab }: TabModalProps) {
  return (
    <div
      className={cn(
        currentTab !== children?.toString() ? "opacity-70" : null,
        "w-full h-[40px] hover:cursor-pointer shadow-md rounded-t-md "
      )}
      onClick={() => setCurrentTab(children?.toString() as CollectionTabs)}
    >
      <div className="rounded-t-md overflow-hidden text-nowrap relative z-10 font-semibold h-full">
        <Cover cardRarity="rare" className="bg-slate-400" />
        <div className="text-slate-900 font-bold h-full flex justify-center items-center relative">
          {children}
        </div>
      </div>
    </div>
  );
}

export function CollectionInterface() {
  const [currentTab, setCurrentTab] = useState<CollectionTabs>("Deck");
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
  }, [currentTab]);

  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<number | null>(1);

  useEffect(() => {
    if (!tabContainerRef.current) return;
  }, [tabContainerRef.current]);

  useOnWrapperResize((ref) => {
    setSize(computeCardSize(ref, 4));
  }, tabContainerRef);

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
      <div className="grow w-full relative flex">
        <div className="w-full h-full relative flex justify-center" ref={tabContainerRef}>
          {size !== null && (
            <div
              className="h-full relative flex w-full"
            >
              <TabElement size={size} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function useOnWrapperResize(
  cb: (ref: HTMLDivElement) => void,
  ref: React.MutableRefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(() => {
      if (!ref.current) return;
      cb(ref.current);
    });
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref.current]);
}

// CARD_BORDER_WIDTH
// CARD_BORDER_HEIGHT
export const CARD_GAP = CARD_BORDER_WIDTH / 7;
// 1.5 * 16 = 24
function computeCardSize(
  wrapper: HTMLDivElement,
  cardsByRow: number,
) {
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight;
  // we want to create a gap between cards of size 1/5 of the card width
  const sizeWidth = (width) / ((cardsByRow * CARD_BORDER_WIDTH) + (CARD_GAP * (cardsByRow + 1)));
  const sizeHeight = (height) / (cardsByRow * CARD_BORDER_HEIGHT + (CARD_GAP * (cardsByRow - 1)));
  const size = Math.min(sizeWidth, sizeHeight);
  return size;
}
