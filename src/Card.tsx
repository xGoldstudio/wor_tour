import { CardType } from "./cards";

export default function Card({ card }: { card: CardType }) {
  return (
    <div className="select-none border-2 text-black border-black rounded-md w-[192px] h-[267px] text-sm flex flex-col relative bg-blue-50">
      <div className="w-full border-b-[1px] border-black flex px-1 justify-between">
        <p>{card.name}</p>
        <div className="border-l-[1px] border-black pl-2 pr-1">{card.cost}</div>
      </div>
      <div
        className="w-full h-[120px] border-b-[1px] border-black "
        style={{
          backgroundImage: `url('./${card.id}.png')`,
					backgroundSize: "cover",
					backgroundPosition: "center",
        }}
      />
      <div className="text-[10px] leading-3 p-1 flex flex-col gap-1 flex-1">
        <p>E: {card.effect}</p>
        <p>Dmg: {card.dmg}</p>
        <p>AttackSpeed: {card.attackSpeed}</p>
        <p>Dps: {card.attackSpeed * card.dmg}</p>
      </div>
      <div className="w-full flex justify-center">
				<div className="px-4 flex justify-center border-[1px] border-black rounded-t-md border-b-0 bg-slate-100">
				{card.hp} hp
			</div></div>
			<div className="absolute right-1 bottom-0 text-[10px]">{card.rarity}</div>
    </div>
  );
}
