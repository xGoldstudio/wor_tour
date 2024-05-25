import { CardRarity } from "@/cards";
import { Borders, CardIllustartion, InnerBord } from "@/game/gui/card/CardBorder";

interface BoxProps {
	children: React.ReactNode;
  width?: number;
  height?: number;
  rarity?: CardRarity;
}

export default function Box({
  children,
  width = 500,
  height = 200,
  rarity = "common",
}: BoxProps) {
  return (
    <Borders width={width} height={height} borderUnit={1} rarity={rarity}>
      <CardIllustartion width={width} height={height} borderUnit={1}>
        <InnerBord size={1}>
          <div className="w-full h-full relative bg-slate-100 text-center p-2 py-4">
            {children}
          </div>
        </InnerBord>
      </CardIllustartion>
    </Borders>
  );
}