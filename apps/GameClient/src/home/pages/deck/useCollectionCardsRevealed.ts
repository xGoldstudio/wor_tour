import { useDebounce } from "@repo/ui";
import { useEffect, useRef, useState } from "react";

interface CollectionCardsRevealedProps {
	contentRef: React.RefObject<HTMLDivElement>;
	cardListRef: React.RefObject<HTMLDivElement>;
	numberOfCards: number
}

const collectionCardWidth = 128;
const collectionCardHeight = 178;
const cardCollectionGap = 24;

export default function useCollectionCardsRevealed({contentRef, cardListRef, numberOfCards }: CollectionCardsRevealedProps) {
	const [currentShownRows, setCurrentShownRows] = useState<null | number>(null);
	const lastScrolledValue = useRef(0);

	const internalCurrentShownRows = useRef<number | null>(null);
	const endLines = useRef<number[]>([]);
	const maxRowsShowns = useRef(0);
	const numberOfCardsByRow = useRef(0);

	useEffect(() => {
		function initDomData() {
			if (contentRef.current === null || cardListRef.current === null) return;
			const containerHeight = contentRef.current.clientHeight;
			numberOfCardsByRow.current = getCardsByRow(contentRef.current.clientWidth);
			endLines.current = getEndLines(numberOfCardsByRow.current, numberOfCards);
			maxRowsShowns.current = getMaxRowsShowns(containerHeight);
			internalCurrentShownRows.current = 0;
			onScroll();
		}
		window.addEventListener("resize", initDomData);
		initDomData();
		return () => {
			window.removeEventListener("resize", initDomData);
		};
	}, [numberOfCards]);

	function onScroll() {
		if (contentRef.current === null) return;
		const scrollTop = contentRef.current.scrollTop;

		const isScrollingDown = scrollTop > lastScrolledValue.current;

		if (endLines.current.length === 0) return;

		let firstShownRow = internalCurrentShownRows.current ?? 0;
		if (isScrollingDown) {
			while (endLines.current[firstShownRow] < scrollTop) {
				firstShownRow++;
			}
		} else {
			while (firstShownRow > 0 && endLines.current[firstShownRow] > scrollTop) {
				firstShownRow--;
			}
		}
		internalCurrentShownRows.current = firstShownRow;
		lastScrolledValue.current = endLines.current[firstShownRow];
		if (
			currentShownRows !== null &&
			currentShownRows === firstShownRow
		)
			return;
		setCurrentShownRows(firstShownRow);
	}

	function getCardsByRow(widthAvailable: number) {
		const cardWidth = collectionCardWidth + cardCollectionGap;
		return Math.floor(widthAvailable / cardWidth);
	}

	function getEndLines(numberOfCardsByRow: number, numberOfCards: number) {
		const cardHeight = collectionCardHeight + cardCollectionGap;
		const rows = Math.ceil(numberOfCards / numberOfCardsByRow);
		const endLines = Array(rows);
		for (let i = 0; i < rows; i++) {
			endLines[i] = i * cardHeight + i * cardCollectionGap;
		}
		return endLines;
	}

	function getMaxRowsShowns(containerHeight: number) {
		const cardHeight = collectionCardHeight + cardCollectionGap;
		return Math.floor((containerHeight + cardCollectionGap) / cardHeight) + 2;
	}

	const firstElementToShow = Math.max((currentShownRows ?? 0) - 3, 0) * numberOfCardsByRow.current;
	const lastElementToShow = (currentShownRows === null) ? 0 : ((currentShownRows + maxRowsShowns.current + 3) * numberOfCardsByRow.current) + numberOfCardsByRow.current;

	const onScrollDebounced = useDebounce(onScroll, 30);

	return { onScroll: onScroll, onScrollDebounced: onScrollDebounced, firstElementToShow, lastElementToShow };
}