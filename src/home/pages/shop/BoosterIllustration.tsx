import { InnerBord, inPx } from "@/game/gui/card/CardBorder";
import * as _ from "lodash";

export default function BoosterIllustration({
  size,
  title,
	illustration,
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
        <rect x="0" y="0" width="128" height="178" fill="#ADB5E0" />

        <image
          href={illustration}
          x="50%"
          y="50%"
          transform="translate(-63,-88.5)"
          width="126"
          height="177"
        />

        <line x1={0} y1="16" x2={128} y2="16" stroke="black" strokeWidth={2} />
        {_.range(20).map((i) => (
          <line
            x1={-3 + i * 8}
            y1="-5"
            x2={-3 + (i + 1) * 8}
            y2="15"
            stroke="black"
            strokeWidth={1}
          />
        ))}

        <image href="/logo.png" x="-3" y="0" width="128" height="80" />
        <text
          x="50%"
          y="150"
          dominant-baseline="middle"
          text-anchor="middle"
          className="font-stylised"
					fill="white"
        >
          {title}
        </text>

        <line
          x1={0}
          y1="162"
          x2={128}
          y2="162"
          stroke="black"
          strokeWidth={2}
        />
        {_.range(20).map((i) => (
          <line
            x1={-3 + i * 8}
            y1="163"
            x2={-3 + (i + 1) * 8}
            y2="183"
            stroke="black"
            strokeWidth={1}
          />
        ))}
      </svg>
      <div className="absolute z-10 h-full w-full top-0">
        <InnerBord size={2}>
          <p></p>
        </InnerBord>
      </div>
    </div>
  );
}
