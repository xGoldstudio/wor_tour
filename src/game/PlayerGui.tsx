import useGameStore from "@/stores/gameStateInterface";
import { manaSpeed } from "./useGameEvents";
import { useRef, useState } from "react";

interface PlayerGUIProps {
	mana: number;
	hp: number;
	maxHp: number;
	isPlayer: boolean;
}


function PlayerGUI({ mana, hp, maxHp, isPlayer }: PlayerGUIProps) {
	const manaTimestamp = useGameStore(state => isPlayer
		? state.playerTimestampStartEarningMana
		: state.opponentTimestampStartEarningMana
	);
	const [oldTimestamp, setOldTimestamp] = useState(manaTimestamp);
	const progressBarSlider = useRef<HTMLDivElement | null>(null);

	const isTimeStampDifferent = manaTimestamp !== oldTimestamp && manaTimestamp !== null;
	if (isTimeStampDifferent) {
		setOldTimestamp(manaTimestamp);

		if (progressBarSlider) {
			progressBarSlider.current?.animate(
				[
					{ transform: "scaleX(0%)" },
					{ transform: "scaleX(100%)"},
				],
				manaSpeed,
			);
		}
	}


  return (
    <div className="w-full flex gap-4 flex-col">
      <div className="w-full bg-red-600 p-1 rounded-md flex justify-center text-white">
				<p>{hp}/{maxHp}</p>
			</div>
			<div className="flex gap-4">
			<div className="h-12 w-12 flex justify-center items-center bg-purple-600 text-white rounded-full text-xl">{mana}</div>
				<div className="w-full bg-purple-200 rounded-md flex justify-center text-white overflow-hidden">
					<div
						className="w-full h-full bg-purple-600 rounded-md origin-left overflow-hidden"
						ref={progressBarSlider}
					/>
				</div>
			</div>
    </div>
  );
}

export default PlayerGUI;