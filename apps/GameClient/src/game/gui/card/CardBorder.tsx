import { CardRarity } from "@/cards";
import { inPx } from "@/lib/utils";
import textureByRarity from "./utils/textureByRarity";

interface CardBoardProps {
  rarity: CardRarity;
  children: React.ReactNode;
  size: number;
}

export default function CardBorder({ rarity, children, size }: CardBoardProps) {
  const width = 64 * size;
  const height = 89 * size;
  const borderUnit = Math.min(0.5 * size, 2);

  return (
    <Borders
      width={width}
      height={height}
      borderUnit={borderUnit}
      rarity={rarity}
    >
      <CardIllustartion width={width} height={height} borderUnit={borderUnit}>
        {children}
      </CardIllustartion>
    </Borders>
  );
}

interface BordersProps {
  width: number;
  height: number;
  rarity: CardRarity;
  children: React.ReactNode;
  borderUnit: number;
}

export function Borders({
  width,
  height,
  rarity,
  children,
  borderUnit,
}: BordersProps) {
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
              backgroundImage: `url(/${textureByRarity(rarity)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
        <div
          className=" bg-black opacity-20 absolute left-0"
          style={{
            width: inPx(borderUnit * 3),
            top: inPx(borderUnit * 3),
            height: inPx(height - borderUnit * 6),
          }}
        ></div>
        <div
          className=" bg-black opacity-20 absolute top-0 left-0"
          style={{
            height: inPx(borderUnit * 3),
            width: inPx(width - borderUnit * 3),
          }}
        ></div>
        <div
          className="w-full bg-black opacity-60 absolute bottom-0 left-0"
          style={{ height: inPx(borderUnit * 3) }}
        ></div>
        <div
          className=" bg-black opacity-60 absolute top-0 right-0"
          style={{
            width: inPx(borderUnit * 3),
            height: inPx(height - borderUnit * 3),
          }}
        ></div>
        {children}
      </div>
    </div>
  );
}

interface CardIllustrationProps {
  children: React.ReactNode;
  width: number;
  height: number;
  borderUnit: number;
}

export function CardIllustartion({
  children,
  width,
  height,
  borderUnit,
}: CardIllustrationProps) {
  return (
    <div
      className="absolute rounded-[2px] overflow-hidden"
      style={{
        top: inPx(8 * borderUnit),
        left: inPx(7.5 * borderUnit),
        width: inPx(width - 16 * borderUnit),
        height: inPx(height - 17 * borderUnit),
      }}
    >
      {children}
    </div>
  );
}

export function CardContentIllustartion({
  card,
  size,
}: {
  card: { worldIllustration: string; illustration: string | null };
  size: number;
}) {
  const borderUnit = Math.min(0.5 * size, 2);

  return (
    <>
      <InnerBord size={size}>
        <div
          className="w-full h-full grow absolute box-border"
          style={{
            backgroundImage: `url(${card.worldIllustration})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: `calc(100% - ${7 * borderUnit}px)`,
          }}
        ></div>
        <div
          className="w-full h-full grow absolute box-border"
          style={{
            backgroundImage: `url(${card.illustration})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: `calc(100% - ${7 * borderUnit}px)`,
          }}
        ></div>
      </InnerBord>
    </>
  );
}

export function InnerBord({
  size,
  children,
}: {
  size: number;
  children: React.ReactNode;
}) {
  const borderUnit = Math.min(0.5 * size, 2);

  return (
    <div className="w-full h-full relative rounded-[2px] overflow-hidden">
      <div
        className="w-full bg-black opacity-60 absolute bottom-0 top-0"
        style={{ height: inPx(4 * borderUnit) }}
      ></div>
      <div
        className="h-full  bg-black opacity-60 absolute left-0"
        style={{ width: inPx(3 * borderUnit), top: inPx(4 * borderUnit) }}
      ></div>
      <div
        className=" bg-black opacity-20 absolute bottom-0 w-full"
        style={{
          height: inPx(3 * borderUnit),
          left: inPx(3 * borderUnit),
        }}
      ></div>
      <div
        className=" bg-black opacity-20 absolute right-0"
        style={{
          height: `calc(100% - ${7 * borderUnit}px)`,
          width: inPx(2 * borderUnit),
          top: inPx(4 * borderUnit),
        }}
      ></div>
      <div
        className="relative box-content"
        style={{
          paddingTop: inPx(4 * borderUnit),
          paddingBottom: inPx(3 * borderUnit),
          left: inPx(3 * borderUnit),
          width: `calc(100% - ${5 * borderUnit}px)`,
          height: `calc(100% - ${7 * borderUnit}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}