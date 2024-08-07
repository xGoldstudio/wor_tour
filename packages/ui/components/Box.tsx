import { CardRarity, textureByRarity } from "@repo/lib";
import { Borders, CardIllustartion, InnerBord } from "./card/CardBorder";

interface BoxProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  size?: number;
  rarity?: CardRarity;
  cover?: CardRarity;
  className?: string;
}

export default function Box({
  children,
  width = 500,
  height = 200,
  size = 1,
  rarity = "common",
  cover,
  className,
}: BoxProps) {
  return (
    <div className={className}>
      <Borders width={width} height={height} borderUnit={size} rarity={rarity}>
        <CardIllustartion width={width} height={height} borderUnit={size}>
          <InnerBord size={size}>
            <div className="w-full h-full relative bg-slate-800 text-center">
              {cover && (
                <div
                  className="absolute w-full h-full top-0 left-0 blur-sm"
                  style={{
                    backgroundImage: `url(${textureByRarity(cover)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
              <div className="relative w-full h-full">{children}</div>
            </div>
          </InnerBord>
        </CardIllustartion>
      </Borders>
    </div>
  );
}
