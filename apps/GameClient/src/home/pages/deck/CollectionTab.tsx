import ScrollContainer from "react-indiana-drag-scroll";
import Collection from "./Collection";
import { CollectionTabProps } from "./CollectionInterface";

export default function CollectionTab({ size }: CollectionTabProps) {
  return (
    <>
      <ScrollContainer className="grow overflow-y-scroll scrollbar-hide flex justify-center">
        <Collection size={size} />
      </ScrollContainer>
    </>
  );
}
