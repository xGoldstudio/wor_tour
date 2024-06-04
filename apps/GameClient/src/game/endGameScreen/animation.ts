import gsap from "gsap";

interface EndGameScreenAnimationArgs {
	boxRef: HTMLDivElement;
	currentXpProgress: number;
	targetXpProgress: number;
	currentLevel: number;
	targetLevel: number;
	rewardsRef: HTMLDivElement;
	xpBarRef: HTMLDivElement;
	shinyRef: HTMLDivElement | null;
	buttonRef: HTMLButtonElement;
	nextLevelRef: HTMLDivElement;
	setCurrentLevel: (level: number) => void;
}

export default function endGameScreenAnimation({
	boxRef,
	currentXpProgress,
	targetXpProgress,
	currentLevel,
	targetLevel,
	rewardsRef,
	xpBarRef,
	shinyRef,
	buttonRef,
	nextLevelRef,
	setCurrentLevel,
}: EndGameScreenAnimationArgs) {
	const tl = gsap.timeline();
	tl.fromTo(
		boxRef,
		{ x: -500, opacity: 0 },
		{ x: 0, opacity: 1, duration: 0.4 },
		"appear"
	);
	if (currentLevel < targetLevel) {
		barNextLevel(tl, currentXpProgress, 1, currentLevel + 1);
		if (currentLevel + 1 < targetLevel) {
			for (let i = currentLevel + 1; i < targetLevel; i++) {
				barNextLevel(tl, 0, 1, i + 1);
			}
		}
		barNextLevel(tl, 0, targetXpProgress);
	} else {
		barNextLevel(tl, currentXpProgress, targetXpProgress);
	}
	const rewards = rewardsRef.children;
	for (let i = 0; i < rewards.length; i++) {
		tl.fromTo(
			rewards[i],
			{ scale: 1.5, opacity: 0 },
			{ scale: 1, opacity: 1, duration: 0.3, ease: "power3.out" }
		);
	}

	if (shinyRef) {
		tl.fromTo(
			shinyRef,
			{ scale: 0, opacity: 1 },
			{ scale: 1, opacity: 1, duration: 0.4 },
			"appear"
		);
		gsap.to(shinyRef, {
			rotate: 360,
			duration: 60,
			repeat: -1,
			ease: "linear",
		});
	}
	tl.fromTo(
		buttonRef,
		{ opacity: 0 },
		{ opacity: 1, duration: 0.4 },
		"end"
	);
	function barNextLevel(
		tl: GSAPTimeline,
		currentXpProgress: number,
		targetXpProgress: number,
		nextLevel?: number
	) {
		tl.to(xpBarRef, { scaleX: currentXpProgress, duration: 0 });
		tl.to(xpBarRef, {
			scaleX: targetXpProgress,
			duration: (targetXpProgress - currentXpProgress) * 1.5,
			ease: "linear",
		});
		if (nextLevel === undefined) {
			return;
		}
		tl.fromTo(
			nextLevelRef,
			{ translateX: -50, opacity: 0 },
			{
				translateX: 0,
				opacity: 1,
				ease: "power3.out",
				duration: 0.3,
			}
		);
		tl.to(nextLevelRef, {
			opacity: 0,
			duration: 0.2,
			onComplete: () => {
				setCurrentLevel(nextLevel);
			},
		});
	}
}