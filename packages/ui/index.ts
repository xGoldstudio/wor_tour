import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// components
export { default as Button } from './components/Button.tsx';
export { default as Box } from './components/Box.tsx';
export { default as GoldAmount } from './components/GoldAmount.tsx';
export { default as KeyAmount } from './components/KeyAmount.tsx';
export { default as XpAmount } from './components/XpAmount.tsx';
export { default as Badge } from './components/Badge.tsx';
export { default as NumberSpan } from './components/NumberSpan.tsx';
export { default as useProgressPieChart } from './components/useProgressPieChart.tsx';
export * from './components/card/CardBorder.tsx';
export { default as HandCard } from './components/card/handCard/HandCard.tsx';
export { default as Effects } from './components/card/Effects.tsx';
export * from './components/card/Effects.tsx';
export { default as ManaBall } from './components/ManaBall.tsx';
export { default as FullCard } from './components/card/FullCard.tsx';
export { StatLine } from './components/card/FullCard.tsx';
export { default as BoosterRarityDrop } from './components/booster/BoosterRarityDrop.tsx';
export { default as Cover } from './components/Cover.tsx';
export { default as EmptyBar } from './components/EmptyBar.tsx';
export { default as ManaBar } from './components/game/ManaBar.tsx';
export { default as StatesHistory } from './components/game/stateHistory/StatesHistory.tsx';
export * from './components/game/useRunGameInstance.ts';
export * from './components/game/FpsTracker.ts';
export { default as GameTimer } from './components/game/GameTimer';
export * from './components/card/useGameSyncAnimation.tsx';
export * from './lib/rxjsToZustand.ts';
export * from './lib/lifecycle.ts';
export { default as useOnWrapperResize } from './lib/useOnWrapperResize.ts';

export { default as useSafeTimeout } from './lib/useSafeTimeout.ts';
export * from "./lib/utils.ts";
export * from './lib/transformLevelStatInlevels.ts';

export * from './data/ComputeProgressionLevels.ts';
export * from './data/ComputeBoosterProgress.ts';
export * from './data/const.ts';
export { default as GameCard } from './components/card/gameCard/GameCard.tsx';
export * from './components/card/gameEventListener.ts';
export * from './components/card/useGameSyncAnimation.tsx';
export {default as useGameEventListener} from './components/card/useGameEventListener.ts';
export {default as textureByRarity} from './lib/textureByRarity.ts';

gsap.registerPlugin(useGSAP);