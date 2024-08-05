import { ExperienceReward } from "@/services/experienceService/experienceService";
import { experienceService } from "@/services/inject";
import { useEffect, useState } from "react";
import ExperienceModal from "./ExperienceModal";
import { getFirst } from "@repo/lib";

export default function ExperienceModalWatcher() {
	const [currentReward, setCurrentReward] = useState<ExperienceReward | null>(null);
	const rewards = experienceService.useWatchRewards();

	useEffect(() => {
		if (rewards.length > 0) {
			setCurrentReward(getFirst(rewards));
		}
	}, [rewards]);

	if (!currentReward) {
		return null;
	}

	return <ExperienceModal reward={currentReward} onContinue={() => {
		setCurrentReward(null);
		experienceService.collectReward();
	}} />;
}