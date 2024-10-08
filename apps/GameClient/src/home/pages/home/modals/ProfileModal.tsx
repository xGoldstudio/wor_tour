import Modal from "@/home/ui/modal";
import ScrollContainer from "react-indiana-drag-scroll";
import { Badge, Box } from "@repo/ui";
import Ribbon from "@/home/ui/Ribbon";
import usePlayerStore from "@/home/store/playerStore/playerStore";
import useDataStore from "@/cards/DataStore";
import _ from "lodash";
import { DeckCardUI } from "../../deck/DeckCardUI";
import WorldField from "./WorldField";
import Field from "./Field";
import { COMMON, getImageUrl, getImageUrlCssValue, ICONS } from "@repo/lib";

interface ProfileModalProps {
  closeModal: () => void;
}

export default function ProfileModal({ closeModal }: ProfileModalProps) {
  const { deck, currentWorld } = usePlayerStore((state) => ({
    deck: state.deck,
    currentWorld: state.currentWorld,
  }));
  const { world } = useDataStore((state) => ({
    world: state.worlds[currentWorld - 1],
  }));

  const deckArray = _.concat(deck, _.fill(Array(8 - deck.length), null));

  return (
    <Modal title="profile" closeModal={closeModal}>
      <Box rarity="epic" height={800} width={600} size={1.5}>
        <img
          src={getImageUrl(ICONS, "cross.svg")}
          className="absolute top-3 right-3 w-8 h-8 cursor-pointer z-10 drop-shadow-[2px_1px_1px_black]"
          onClick={closeModal}
        />
        <div
          className="w-full h-full absolute brightness-75 top-0 left-0"
          style={{
            backgroundImage: getImageUrlCssValue(COMMON, "homeBg.jpeg"),
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <ScrollContainer
          className="w-full h-full flex overflow-y-scroll"
          stopPropagation={false}
        >
          <div className="w-full h-max flex flex-col items-center relative pb-8">
            <p className="text-4xl font-semibold text-white py-16 relative drop-shadow-[2px_2px_1px_black]">
              Goldaxe
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Badge value="45" />
                <p className="relative font-semibold">Level</p>
              </Field>
              <WorldField world={world} />
              <Field>
                <img
                  src={getImageUrl(ICONS, "trophy.png")}
                  className="w-[32px] drop-shadow-[2px_1px_1px_black]"
                />
                <p className="relative font-semibold">450</p>
              </Field>

              <Stat label="Victory" value="45" />
            </div>
            <Ribbon className="my-16 px-16">Deck</Ribbon>
            <div className="grid grid-cols-4 w-auto gap-4">
              {deckArray.map((cardId) => (
                <DeckCardUI cardId={cardId!} size={0.7} />
              ))}
            </div>
            <Ribbon className="my-16 px-16">Stats</Ribbon>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Victory" value="45" />
              <Stat label="Winrate" value="62%" />
              <Stat label="Damage dealt" value="62 862 710" />
              <Stat label="Card destroyed" value="4 598" />
              <Stat label="Biggest Attack" value="7 981" />
              <Stat label="Most played" value="Crabvor Queen" />
              <Stat label="Cards unlocked" value="9/75" />
              <Stat label="Highest trophies" value="975" />
            </div>
          </div>
        </ScrollContainer>
      </Box>
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Field>
      <div className="flex w-full items-center justify-center h-full flex-col">
        <p className="relative font-semibold leading-5">{label}</p>
        <p className="relative text-sm leading-4">{value}</p>
      </div>
    </Field>
  );
}
