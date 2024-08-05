import { Badge } from "@repo/ui";
import { RessourceCounter } from "../Home";
import { experienceService } from "@/services/inject";

export default function ExperienceOutput() {
	const currentLevel = experienceService.useWatchLevels();
	const currentExperience = experienceService.useWatchExperience();
	const targetExperience = experienceService.useWatchExperienceForNextLevel();

  return (
    <RessourceCounter
      amount={currentExperience}
      max={targetExperience}
      icon={
        <Badge
          className="absolute z-10 left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
          value={currentLevel.toString()}
        />
      }
      name="xp"
    />
  );
}
