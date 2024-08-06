import ScrollContainer from "react-indiana-drag-scroll";
import Collection from "./Collection";
import { Tabs } from "./DeckInterface";
import { useState } from "react";
import usePlayerStore from "@/home/store/playerStore/playerStore";

interface CollectionTabProps {
  setCurrentTab: (tab: Tabs) => void;
}

export default function CollectionTab({ setCurrentTab }: CollectionTabProps) {
  const [selectedCard, setSelectedCard] = useState<number>(0);
  const { collectionInCollection } = usePlayerStore((state) => ({
    collectionInCollection: state.getCollectionCompleteInfo(
      state.getCollection()
    ),
  }));
  return (
    <>
      <ScrollContainer className="grow overflow-y-scroll scrollbar-hide flex justify-center">
        <Collection
          collection={collectionInCollection}
          setCurrentTab={setCurrentTab}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
      </ScrollContainer>
    </>
  );
}
