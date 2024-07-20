import ScrollContainer from "react-indiana-drag-scroll";
import Collection from "./Collection";
import { Tabs } from "./DeckInterface";

interface CollectionTabProps {
  setCurrentTab: (tab: Tabs) => void;
}

export default function CollectionTab({ setCurrentTab }: CollectionTabProps) {
  return (
    <>
      <ScrollContainer className="grow overflow-y-scroll scrollbar-hide flex justify-center">
        <Collection setCurrentTab={setCurrentTab} />
      </ScrollContainer>
    </>
  );
}
