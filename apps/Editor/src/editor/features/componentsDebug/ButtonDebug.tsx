import { PropsOptions, usePropsEditor } from "@/lib/PropsEditor";
import { Button } from "@repo/ui";
import { useState } from "react";

export default function ButtonDebug() {
  const propsPossible: PropsOptions = {
    full: {
      type: "boolean",
    },
    disabled: {
      type: "boolean",
    },
    className: {
      type: "string",
    },
    small: {
      type: "boolean",
    },
    rarity: {
      type: ["common", "rare", "epic", "legendary"],
      default: "rare",
    },
    width: {
      type: "number",
      default: 300,
    },
    unstyled: {
      type: "boolean",
      default: false,
    },
  };

  const [Component, props] = usePropsEditor(propsPossible);
  const [pressedTimes, setPressedTimes] = useState(0);

  return (
    <div>
      <div className="w-full flex flex-col justify-center items-center pt-16 gap-32">
        <div className="flex flex-col justify-center gap-4 max-w-[1000px] w-full">
          {Component}
          <Button action={() => setPressedTimes((i) => i + 1)} {...props}>
            {props.unstyled ? (
              <div className="w-32 h-32 bg-red-500" />
            ) : (
              `Dummy ${pressedTimes}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
