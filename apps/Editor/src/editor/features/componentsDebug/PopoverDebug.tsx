import { PropsOptions, usePropsEditor } from "@/lib/PropsEditor";
import { Button, Popover, PopoverPortal, PopoverTrigger } from "@repo/ui";
import { useRef } from "react";

export default function PopoverDebug() {
  const propsPossible: PropsOptions = {
    position: {
      type: ["top", "right", "bottom", "left"],
      default: "bottom",
    },
  };

  const [Component, props] = usePropsEditor(propsPossible);

  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className="w-full flex flex-col justify-center items-center pt-16 gap-32">
        <div className="flex flex-col gap-4 max-w-[1000px] w-full h-[150vh]">
          {Component}
          <div className="w-[500px]  border-red-600 border-2" ref={wrapperRef}>
            <Popover>
              <PopoverTrigger>Open popover</PopoverTrigger>
              <PopoverPortal {...props}>
                <div className="h-[100px]">Popover content</div>
              </PopoverPortal>
            </Popover>
            <Button action={() => {}}>Simple button</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
