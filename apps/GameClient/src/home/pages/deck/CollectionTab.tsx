import ScrollContainer from "react-indiana-drag-scroll";
import Collection from "./Collection";
import { Tabs } from "./DeckInterface";
import { useState } from "react";
import { selectedCardType } from "./DeckTab";

interface CollectionTabProps {
  setCurrentTab: (tab: Tabs) => void;
}

export default function CollectionTab({ setCurrentTab }: CollectionTabProps) {
  const [selectedCard, setSelectedCard] = useState<selectedCardType>({
    id: 0,
    tab: null,
  });
  return (
    <>
      <ScrollContainer className="grow overflow-y-scroll scrollbar-hide flex justify-center">
        <Collection
          setCurrentTab={setCurrentTab}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
      </ScrollContainer>
    </>
  );
}
