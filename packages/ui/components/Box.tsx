import { CardRarity, textureByRarity } from "@repo/lib";
import { Borders, CardIllustartion, InnerBord } from "./card/CardBorder";
import useOnWrapperResize from "../lib/useOnWrapperResize";
import { useRef, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [heightState, setHeightState] = useState(height);
  const [widthState, setWidthState] = useState(width);

  useOnWrapperResize(() => {
    const maxWidth = containerRef.current?.parentElement?.clientWidth || 0;
    const maxHeight = containerRef.current?.parentElement?.clientHeight || 0;
    console.log("hey", maxWidth, maxHeight);
    setWidthState(Math.min(maxWidth, width));
    setHeightState(Math.min(maxHeight, height));
  }, containerRef);

  return (
    <div className={className} ref={containerRef}>
      <Borders
        width={widthState}
        height={heightState}
        borderUnit={size}
        rarity={rarity}
      >
        <CardIllustartion
          width={widthState}
          height={heightState}
          borderUnit={size}
        >
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
