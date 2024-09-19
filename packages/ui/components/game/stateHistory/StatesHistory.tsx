import { CardState, getStateData } from "@repo/lib";
import {
  Borders,
  CardIllustartion,
  InnerBord,
  useGameEventListener,
} from "@repo/ui";
import { EffectLayout } from "../../card/Effects";
import { AddStateEvent } from "game_engine";
import { useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

export default function StatesHistory() {
  const width = 70;
  const height = 450;

  const [listOfStates, setListOfStates] = useState<CardState[]>([]);

  useGameEventListener<AddStateEvent>({
    type: "addState",
    action: (event) => {
      setListOfStates((states) => [...states, { ...event.state }]);
    },
  });

  return (
    <Borders width={width} height={height} borderUnit={1} rarity={"rare"}>
      <CardIllustartion width={width} height={height} borderUnit={0.6}>
        <InnerBord size={1}>
          <div className="flex w-full items-center justify-start gap-2 relative h-full">
            <ScrollContainer
              className="w-full h-full absolute flex flex-col z-10 gap-2 pt-2 items-center pb-4 overflow-y-scroll"
            >
              {listOfStates.map((state, index) => (
                <EffectLayout
                  key={state.type + " " + state.value + " " + index}
                  effect={getStateData(state)}
                  size={1}
                  showDesc
                />
              ))}
            </ScrollContainer>
          </div>
        </InnerBord>
      </CardIllustartion>
    </Borders>
  );
}
