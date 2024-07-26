import ScrollContainer from "react-indiana-drag-scroll";
import BuyCard from "./BuyCard";
import useShopStore from "@/home/store/shopStore/shopStore";
import Ribbon from "@/home/ui/Ribbon";
import { Booster } from "./Booster";
import { useBoosterStore } from "@/home/store/boosterStore";
import Timer from "@/home/services/LoopService/Timer";

export default function ShopTab() {
  const boosters = useBoosterStore((state) => state.boosters);
  const buyableCards = useShopStore((state) => state.cards);

  return (
    <div className="w-full grid grid-rows-[auto_1fr] absolute top-0 h-full">
      <ScrollContainer className="flex flex-col items-center">
        <Ribbon>Boosters</Ribbon>
        <div className="grid grid-cols-3 gap-1 w-[416px]">
          {Object.values(boosters).map((booster) => (
            <Booster booster={booster} key={booster.name} />
          ))}
        </div>
        <Ribbon>Cards by unit</Ribbon>
        <p className="text-center pb-3">
          Next in <Timer name="cardShop" />
        </p>
        <div className="grid grid-cols-3 gap-4">
          {buyableCards.map((card, i) => (
            <BuyCard card={card} key={`${i}_${card.id}`} />
          ))}
        </div>
        <div className="h-[80px] w-4  pt-32"></div>
      </ScrollContainer>
    </div>
  );
}