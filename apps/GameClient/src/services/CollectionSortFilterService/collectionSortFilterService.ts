import { ActiveFilters, CardFilterState, defaultFilters } from "@/home/pages/deck/cardFilters";
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
	function updateFilter(filter: keyof ActiveFilters, value: CardFilterState) {
		store.setState((state) => ({
			filters: {
				...state.filters,
				[filter]: value,
			},
		}))
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
		store,
		useWatch,
		updateFilters,
		updateFilter,
		updateSort,
		toggleIsAscending,
		useWatchFilter,
		useWatchSort,
		useWatchIsAscending,
		clearFilters,
	};
}