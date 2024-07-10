import { Card } from "./cardFilters";
import { DeckCardUI } from "./DeckCardUI";

interface CollectionProps {
  detailledCollection: Card[];
}

export default function Collection({ detailledCollection }: CollectionProps) {
  return (
    <div className="w-[600px] mx-auto grid grid-cols-4 gap-y-6 pt-10 pb-8">
      {detailledCollection.map((card) => (
        <div className="w-full flex justify-center" key={card.id}>
          <DeckCardUI cardId={card.id} />
        </div>
      ))}
    </div>
  );
}
