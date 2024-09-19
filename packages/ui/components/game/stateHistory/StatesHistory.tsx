import { CardState, inPx } from "@repo/lib";
import { cn, useGameEventListener } from "@repo/ui";
import { AddStateEvent } from "game_engine";
import { useEffect, useRef, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import StatesHistoryState from "./StatesHistoryState";

function afterPaint(cb: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}

export default function StatesHistory() {
  const [listOfStates, setListOfStates] = useState<CardState[]>([]);
  const [isUseScrolling, setIsUserScrolling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGameEventListener<AddStateEvent>({
    type: "addState",
    action: (event) => {
      setListOfStates((states) => [...states, { ...event.state }]);
    },
  });

  useEffect(() => {
    requestAnimationFrame(() => {
      afterPaint(scrollToBottom);
    });
  }, [listOfStates]);

  function scrollToBottom() {
    if (scrollRef.current && !isUseScrolling) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }

  const wrapperRef = useRef<HTMLDivElement>(null);

  const width = 70;
  const [height, setHeight] = useState(wrapperRef.current?.clientHeight || 0);

  useEffect(() => {
    if (wrapperRef.current) {
      setHeight(wrapperRef.current.clientHeight);
    }
  }, [wrapperRef.current]);

  return (
    <div
      onMouseLeave={() => {
        setIsUserScrolling(false);
      }}
      className={cn(`w-[${width}px] h-full relative`)}
      ref={wrapperRef}
    >
      <div
        className={cn(`absolute z-10 top-0`)}
        style={{
          width: inPx(width),
          height: inPx(height),
        }}
      >
        <div className="flex w-full items-center justify-start gap-2 relative h-full">
          <ScrollContainer
            className="w-full h-full absolute flex flex-col z-10 gap-2 items-center overflow-y-scroll py-1"
            innerRef={scrollRef}
            onScroll={() => {
              // if scroll to bottom
              if (
                scrollRef.current &&
                Math.round(
                  scrollRef.current.scrollTop + scrollRef.current.clientHeight
                ) === scrollRef.current.scrollHeight
              ) {
                setIsUserScrolling(false);
                return;
              }
              if (!isUseScrolling) {
                setIsUserScrolling(true);
              }
            }}
          >
            {listOfStates.map((state, index) => (
              <StatesHistoryState
                key={state.type + " " + state.value + " " + index}
                state={state}
              />
            ))}
          </ScrollContainer>
        </div>
      </div>
    </div>
  );
}
