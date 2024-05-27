import ScrollContainer from "react-indiana-drag-scroll";
import usePlayerStore from "@/home/store/playerStore";
import BuyCard from "./BuyCard";
import useShopeStore from "@/home/store/shopStore";
import Ribbon from "@/home/ui/Ribbon";
import { Booster } from "./Booster";
import { useEffect, useState } from "react";

export default function ShopTab() {
  const boosters = usePlayerStore((state) => state.getAvailableBoosters());
  const buyableCards = useShopeStore((state) => state.cards);
  const targetTimestamp = useShopeStore((state) => state.nextTimestamp);

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
          Next in <Timer targetTimestamp={targetTimestamp} />
        </p>
        <div className="grid grid-cols-3 gap-4">
          {buyableCards.map((card) => (
            <BuyCard card={card} key={card.id} />
          ))}
        </div>
        <div className="h-[80px] w-4  pt-32"></div>
      </ScrollContainer>
    </div>
  );
}

interface TimerProps {
  targetTimestamp: number;
}

function Timer({ targetTimestamp }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(
    targetTimestamp - Date.now()
  );

  useEffect(() => {
    setTimeRemaining(targetTimestamp - Date.now());
    const interval = setInterval(() => {
      setTimeRemaining(targetTimestamp - Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  const formatTime = (time: number) => {
    if (time <= 0) {
      return "00:00:00";
    }
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return <span>{formatTime(timeRemaining)}</span>;
}