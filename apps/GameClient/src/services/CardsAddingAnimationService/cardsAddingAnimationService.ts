export default function CardsAddingAnimationsService() {
	function addCardAddingAnimation(cardId: number) {
		const elt = document.getElementById(getCollectionCardId(cardId));
		if (!elt) {
			return;
		}
		const { x, y } = elt.getBoundingClientRect();
		cardsAddingAnimations.set(cardId, { x, y });
	}

	function consumeCardAddingAnimation(cardId: number) {
		const animation = cardsAddingAnimations.get(cardId);
		if (!animation) {
			return null;
		}
		cardsAddingAnimations.delete(cardId);
		return animation;
	}

	function getCollectionCardId(id: number) {
		return `collection-card-${id}`;
	}

	function getCollectionWrapperId() {
		return "collection-wrapper";
	}

	const cardsAddingAnimations = new Map<number, { x: number, y: number }>();

	function clear() {
		cardsAddingAnimations.clear();
	}

	return {
		getCollectionCardId,
		addCardAddingAnimation,
		consumeCardAddingAnimation,
		getCollectionWrapperId,
		clear,
	}
}