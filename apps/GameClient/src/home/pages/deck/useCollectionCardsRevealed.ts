import { useDebounce } from "@repo/ui";
import { useEffect, useRef, useState } from "react";

interface CollectionCardsRevealedProps {
	cardListRef: React.RefObject<HTMLDivElement>;
	numberOfCards: number
	scrollRef: React.RefObject<HTMLDivElement>;
}

const collectionCardWidth = 128;
const collectionCardHeight = 178;
const cardCollectionGap = 24;

export default function useCollectionCardsRevealed({ cardListRef, scrollRef, numberOfCards }: CollectionCardsRevealedProps) {
	const [currentShownRows, setCurrentShownRows] = useState<null | number>(null);
	const lastScrolledValue = useRef<number | null>(null);

	const internalCurrentShownRows = useRef<number | null>(null);
	const endLines = useRef<number[]>([]);
	const maxRowsShowns = useRef(0);
	const numberOfCardsByRow = useRef(0);

	useEffect(() => {
		function initDomData() {
			if (scrollRef.current === null || cardListRef.current === null) return;
			const containerHeight = scrollRef.current.clientHeight;
			numberOfCardsByRow.current = getCardsByRow(cardListRef.current.clientWidth);
			// diff between scrollRef and cardListRef in absolute top
			const paddingTop = cardListRef.current.getBoundingClientRect().top - scrollRef.current.getBoundingClientRect().top + scrollRef.current.scrollTop;
			endLines.current = getEndLines(paddingTop, numberOfCardsByRow.current, numberOfCards);
			maxRowsShowns.current = getMaxRowsShowns(containerHeight);
			lastScrolledValue.current = null;
			internalCurrentShownRows.current = null;
			onScrollForced();
		}
		initDomData();
		window.addEventListener("resize", initDomData);
		scrollRef.current?.addEventListener("scroll", onScrollDebounced);
		scrollRef.current?.addEventListener("scrollend", onScrollForced);
		return () => {
			window.removeEventListener("resize", initDomData);
			scrollRef.current?.removeEventListener("scroll", onScrollDebounced);
			scrollRef.current?.removeEventListener("scrollend", onScrollForced);
		};
	}, [numberOfCards, scrollRef.current, cardListRef.current]);

	// do not call onScroll directly, use the debounced/forced version instead
	function onScroll() {
		if (scrollRef.current === null) return;
		const scrollTop = scrollRef.current.scrollTop;

		if (lastScrolledValue.current === scrollTop) return;
		const isScrollingDown = scrollTop > (lastScrolledValue.current ?? -1);
		lastScrolledValue.current = scrollTop;

		if (endLines.current.length === 0) return;

		let firstShownRow = internalCurrentShownRows.current ?? 0;
		if (isScrollingDown || internalCurrentShownRows.current === null) {
			while (endLines.current[firstShownRow] < scrollTop) {
				firstShownRow++;
			}
		} else {
			// we check the previous row
			while (firstShownRow > 0 && endLines.current[firstShownRow - 1] > scrollTop) {
				firstShownRow--;
			}
		}
		if (
			internalCurrentShownRows.current !== null &&
			internalCurrentShownRows.current === firstShownRow
		) {
			return;
		}
		internalCurrentShownRows.current = firstShownRow;
		setCurrentShownRows(firstShownRow);
	}

	function getCardsByRow(widthAvailable: number) {
		// include a padding between cards (but padding is minus 1 number of cards)
		const cardWithGap = collectionCardWidth + cardCollectionGap;
		const cardsByRow = Math.floor(widthAvailable / cardWithGap);
		return cardsByRow + (widthAvailable >= cardWithGap * cardsByRow + collectionCardWidth ? 1 : 0);
	}

	function getEndLines(paddingTop: number, numberOfCardsByRow: number, numberOfCards: number) {
		const rows = Math.ceil(numberOfCards / numberOfCardsByRow);
		const endLines = Array(rows);
		for (let i = 0; i < rows; i++) {
			endLines[i] = ((i + 1) * (collectionCardHeight)) + (i * cardCollectionGap) + paddingTop;
		}
		return endLines;
	}

	function getMaxRowsShowns(containerHeight: number) {
		const cardHeight = collectionCardHeight + cardCollectionGap;
		return Math.floor((containerHeight + cardCollectionGap) / cardHeight) + 2;
	}

	const liberty = 3;
	const firstElementToShow = Math.max((currentShownRows ?? 0) - liberty, 0) * numberOfCardsByRow.current;
	const lastElementToShow = (currentShownRows === null) ? 0 : ((currentShownRows + maxRowsShowns.current + liberty) * numberOfCardsByRow.current) + numberOfCardsByRow.current;

	const [onScrollDebounced, onScrollForced] = useDebounce(onScroll, 30);

	return { firstElementToShow, lastElementToShow };
}