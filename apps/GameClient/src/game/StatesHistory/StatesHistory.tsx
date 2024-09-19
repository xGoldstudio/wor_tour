import { CardState, getStateData } from "@repo/lib";
import {
	Borders,
	CardIllustartion,
	InnerBord,
	useGameEventListener,
} from "@repo/ui";
import { EffectLayout } from "../../../../../packages/ui/components/card/Effects";
import { AddStateEvent } from "game_engine";
import { useState } from "react";

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
          <div className="flex w-full items-center justify-start pl-2 gap-2 relative h-full">
            <div className="w-full h-full absolute flex flex-col z-10 gap-2 pt-2">
              {listOfStates.map((state, index) => (
                <EffectLayout
                  key={state.type + " " + state.value + " " + index}
                  effect={getStateData(state)}
                  size={1}
                  showDesc
                />
              ))}
            </div>
          </div>
        </InnerBord>
      </CardIllustartion>
    </Borders>
  );
}
