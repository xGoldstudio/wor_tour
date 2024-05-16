import { CardRarity, CardType } from "@/cards";

interface CardBoardProps {
  rarity: CardRarity;
  children: React.ReactNode;
  size: number;
}

function inPx(value: number) {
  return `${value}px`;
}

export default function CardBorder({ rarity, children, size }: CardBoardProps) {
  const width = 64 * size;
  const height = 89 * size;


  const borderTextureRarity = {
    common: "bronze.avif",
    rare: "silver.jpeg",
    epic: "gold.jpeg",
    legendary: "diamond.avif",
  };

  return (
    <div
      className="bg-black rounded-sm relative select-none"
      style={{ width: inPx(width), height: inPx(height) }}
    >
      <div className="w-full h-full rounded-sm overflow-hidden relative">
        <div
          className="rounded-sm absolute top-[0px] left-[0px] overflow-hidden"
          style={{ width: inPx(width), height: inPx(height) }}
        >
          <div
            className="w-full h-full blur-[1px]"
            style={{
              backgroundImage: `url(/${borderTextureRarity[rarity]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
        <div
          className="w-[3px] bg-black opacity-20 absolute top-[3px] left-0"
          style={{ height: inPx(height - 6) }}
        ></div>
        <div
          className="h-[3px] bg-black opacity-20 absolute top-0 left-0"
          style={{ width: inPx(width - 3) }}
        ></div>
        <div className="w-full h-[4px] bg-black opacity-60 absolute bottom-0 left-0"></div>
        <div
          className="w-[3px] bg-black opacity-60 absolute top-0 right-0"
          style={{ height: inPx(height - 3) }}
        ></div>

        <CardIllustartion width={width} height={height}>
          {children}
        </CardIllustartion>
      </div>
    </div>
  );
}

interface CardIllustrationProps {
  children: React.ReactNode;
  width: number;
  height: number;
}

function CardIllustartion({ children, width, height }: CardIllustrationProps) {
  return (
    <div
      className="absolute top-[8px] left-[7.5px] rounded-[2px] overflow-hidden"
      style={{ width: inPx(width - 16), height: inPx(height - 17) }}
    >
      <div className="w-full h-[4px] bg-black opacity-60 absolute bottom-0 top-0"></div>
      <div className="h-full w-[3px] bg-black opacity-60 absolute top-[4px] left-0"></div>
      <div
        className="h-[3px] bg-black opacity-20 absolute bottom-0 left-[3px]"
        style={{ width: inPx(width - 16 - 3) }}
      ></div>
      <div
        className="w-[2px] bg-black opacity-20 absolute top-[4px] right-0"
        style={{ height: inPx(height - 17 - 7) }}
      ></div>
      <div
        className="top-[4px] left-[3px] absolute"
        style={{
          width: inPx(width - 16 - 3 - 2),
          height: inPx(height - 17 - 7),
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function CardContentIllustartion({ card }: { card: CardType }) {
  return (
    <>
      <div
        className="w-full h-full grow absolute"
        style={{
          backgroundImage: `url(${card.worldIllustration})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div
        className="w-full grow relative"
        style={{
          backgroundImage: `url(${card.illustration})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </>
  );
}
