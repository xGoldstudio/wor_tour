import { EditorData } from "@repo/lib";
import { create } from "zustand";
import useDataStore from "../DataStore";
import { imageManagerService } from '../inject';

export default function LoadingService() {
	const store = create(() => ({
		progress: 0,
		isLoaded: false,
	}));

	async function init() {
		const data = await fetch("http://localhost:3000/");
		const stringData = await data.json();
		const objectData = JSON.parse(stringData) as EditorData;
		useDataStore.getState().init(objectData);
		const illustrations: string[] = [];
		useDataStore.getState().cards.forEach(card => {
			card.stats.forEach(state => illustrations.push(state.illustration ?? ""))
		});
		useDataStore.getState().worlds.forEach(world => {
			world.illustration && illustrations.push(world.illustration);
			world.cardBackground && illustrations.push(world.cardBackground);
		});
		await imageManagerService.loadImages(illustrations);
		store.setState({ isLoaded: true });
	}

	function useWatchProgress() {
		return store((state) => state.progress);
	}

	function useWatchIsLoaded() {
		return store((state) => state.isLoaded);
	}

	return {
		init,
		useWatchProgress,
		useWatchIsLoaded,
	}
}