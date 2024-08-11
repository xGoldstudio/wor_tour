import { getImageUrlCssValue, TEXTURE } from "@repo/lib";
import React from "react";

export default function GameCardRing({ ringRef, filter }: { ringRef: React.RefObject<HTMLDivElement>, filter?: string }) {
  return (
    <div
      className="w-[106%] h-[106%] absolute -top-[3%] -left-[3%] origin-top overflow-hidden rounded-md"
      ref={ringRef}
    >
      <div className="w-[200%] h-[200%] top-1/2 left-1/2 opacity-100 absolute transform -translate-x-1/2 -translate-y-1/2">
        <div
          className="w-full h-full ring absolute"
          style={{
            backgroundImage: getImageUrlCssValue(TEXTURE, "fire.avif"),
            backgroundPosition: "center",
            backgroundSize: "cover",
            filter: filter,
          }}
        />
      </div>
    </div>
  );
}