import { ActiveFilters, defaultFilters } from "@/home/pages/deck/cardFilters";
import { CardSorts, defaultSort } from "@/home/pages/deck/cardSorts";
import { CardsPipeline } from "@/home/pages/deck/Collection";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export default function CollectionSortFilterService() {
	const store = create(persist<CardsPipeline>(() => (
		{
			filters: defaultFilters,
			sort: defaultSort,
			isAscending: true,
		}
	), { name: "CollectionSortFilterServiceStore" }));

	
	/***************
	 **** Getter ****
	 ***************/
	function useWatch() {
		return store((state) => state);
	}
	function useWatchFilter() {
		return store((state) => state.filters);
	}
	function useWatchSort() {
		return store((state) => state.sort);
	}
	function useWatchIsAscending() {
		return store((state) => state.isAscending);
	}

	/***************
	**** Setter ****
	***************/
	function updateFilters(filters: ActiveFilters) {
		store.setState(() => ({
			filters,
		}));
	}

	function updateSort(sort: CardSorts) {
		store.setState(() => ({
			sort,
		}));
	}

	function toggleIsAscending() {
		store.setState((state) => ({
			isAscending: !state.isAscending,
		}));
	}

	function clearFilters() {
		store.setState(() => ({
			filters: defaultFilters,
		}));
	}

	return {
		useWatch,
		updateFilters,
		updateSort,
		toggleIsAscending,
		useWatchFilter,
		useWatchSort,
		useWatchIsAscending,
		clearFilters,
	};
}