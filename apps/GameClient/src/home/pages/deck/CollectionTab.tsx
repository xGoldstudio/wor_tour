import ScrollContainer from "react-indiana-drag-scroll";
import Collection from "./Collection";
import { Tabs } from "./DeckInterface";
import { useState } from "react";

interface CollectionTabProps {
  setCurrentTab: (tab: Tabs) => void;
}

export default function CollectionTab({ setCurrentTab }: CollectionTabProps) {
  const [selectedCard, setSelectedCard] = useState<number>(0);
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
