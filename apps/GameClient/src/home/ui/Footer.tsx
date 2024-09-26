import { FOOTER_SRC, getImageUrl } from "@repo/lib";
import { cn, Cover } from "@repo/ui";
import { Tabs } from "../Home";

interface FooterProps {
  setCurrentTab: (tab: Tabs) => void;
  currentTab: string;
  tabsPosition: Record<string, number>;
  editionMode: boolean;
}

export default function Footer({
  setCurrentTab,
  currentTab,
  tabsPosition,
  editionMode,
}: FooterProps) {
  return (
    <div
      className={cn(
        "flex max-w-[700px] w-full relative z-10",
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
