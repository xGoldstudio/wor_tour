import { inPx, textureByRarity } from "@repo/ui";
import * as _ from "lodash";
import { InnerBord } from "../../../../../../packages/ui/components/card/CardBorder";

export default function BoosterIllustration({
  size,
  title,
}: {
  size: number;
  title: string;
  illustration: string;
}) {
  return (
    <div
      className="w-[128px] h-[178px] bg-slate-50 rounded-sm relative overflow-hidden"
      style={{
        width: inPx(128 * size),
        height: inPx(178 * size),
      }}
    >
      <svg className="w-full h-full" viewBox="0 0 128 178">
        <mask id="boosterMask2">
          <rect
            x="0"
            y="17"
            width="100%"
            height="145"
            fill="white"
            opacity={1}
          />
        </mask>
        <mask id="boosterMask1">
          <line
            x1={0}
            y1="16"
            x2={128}
            y2="16"
            stroke="#ffffff"
            strokeWidth={1}
            opacity={1}
          />
          <rect
            x="0"
            y="0"
            width="100%"
            height="17"
            fill="white"
            opacity={0.7}
          />
          {_.range(20).map((i) => (
            <line
              x1={-3 + i * 8}
              y1="-5"
              x2={-3 + (i + 1) * 8}
              y2="15"
              stroke="#ffffff"
              strokeWidth={1}
              key={i}
              opacity={1}
            />
          ))}
          <line
            x1={0}
            y1="162"
            x2={128}
            y2="162"
            strokeWidth={1}
            stroke="#ffffff"
            opacity={1}
          />
          <rect
            x="0"
            y="162"
            width="100%"
            height="20"
            fill="white"
            opacity={0.7}
          />
          {_.range(20).map((i) => (
            <line
              x1={-3 + i * 8}
              y1="163"
              x2={-3 + (i + 1) * 8}
              y2="183"
              stroke="#ffffff"
              strokeWidth={1}
              key={i}
              opacity={1}
            />
          ))}
        </mask>
        <rect
          href={textureByRarity("epic")}
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="white"
          mask="url(#boosterMask2)"
        />
        <image
          className="blur-[6px]"
          href={textureByRarity("rare")}
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          mask="url(#boosterMask2)"
        />
        <image href="/homeBg.jpeg" x="0" y="0" width="105%" opacity={0.2} />
        <rect
          href={textureByRarity("epic")}
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="white"
          mask="url(#boosterMask1)"
        />
        <image
          className="blur-[6px]"
          href={textureByRarity("epic")}
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          mask="url(#boosterMask1)"
        />
        <text
          x="50%"
          y="35"
          dominantBaseline="middle"
          textAnchor="middle"
          className="font-stylised"
          fill="white"
        >
          {title}
        </text>
        <image href="/logo.png" x="-3" y="100" width="128" height="80" />
      </svg>
      <div className="absolute z-10 h-full w-full top-0">
        <InnerBord size={1}>
          <p></p>
        </InnerBord>
      </div>
    </div>
  );
}
