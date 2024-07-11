import ScrollContainer from "react-indiana-drag-scroll";
import Collection from "./Collection";

export default function CollectionTab() {
  return (
    <ScrollContainer className="grow overflow-y-scroll scrollbar-hide flex justify-center">
      <Collection />
    </ScrollContainer>
  );
}
