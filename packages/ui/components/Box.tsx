import { CardRarity } from "@repo/types";
import { Borders, CardIllustartion, InnerBord } from "./card/CardBorder";

interface BoxProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  size?: number;
  rarity?: CardRarity;
}

export default function Box({
  children,
  width = 500,
  height = 200,
  size = 1,
  rarity = "common",
}: BoxProps) {
  return (
    <Borders width={width} height={height} borderUnit={size} rarity={rarity}>
      <CardIllustartion width={width} height={height} borderUnit={size}>
        <InnerBord size={1}>
          <div className="w-full h-full relative bg-slate-100 text-center p-2 py-4">
            {children}
          </div>
        </InnerBord>
      </CardIllustartion>
    </Borders>
  );
}
