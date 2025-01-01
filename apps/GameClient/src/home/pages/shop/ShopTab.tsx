import { Booster } from "./Booster";
import { useBoosterStore } from "@/home/store/boosterStore";

export default function ShopTab() {
  const boosters = useBoosterStore((state) => state.boosters);
  // const buyableCards = useShopStore((state) => state.cards);

  return (
    <div className="w-full flex justify-center items-center absolute top-0 h-full">
      <Booster booster={boosters[0]} key={boosters[0].name} />
    </div>
  );
}

// <ScrollContainer className="flex flex-col items-center overflow-y-scroll">
// <Ribbon>Boosters</Ribbon>
// <div className="grid grid-cols-3 gap-6 w-[416px]">
//   {Object.values(boosters).filter(b => b.cards.length > 0).map((booster) => (
//     <Booster booster={booster} key={booster.name} />
//   ))}
// </div>
// {/* <Ribbon>Cards by unit</Ribbon>
// <p className="text-center pb-3 text-white">
//   Next in <Timer name="cardRotationShop" />
// </p>
// <div className="grid grid-cols-3 gap-6 px-4">
//   {buyableCards.map((card, i) => (
//     <BuyCard card={card} key={`${i}_${card.id}`} />
//   ))}
// </div> */}
// {/* <div className="h-[80px] w-4 pt-32"></div> */}
// </ScrollContainer>
