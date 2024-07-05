import Modal from "@/home/ui/modal";
import ScrollContainer from "react-indiana-drag-scroll";
import {
  Borders,
  CardIllustartion,
  InnerBord,
} from "../../../../../../../packages/ui/components/card/CardBorder";
import { Badge, Box, getImageUrl } from "@repo/ui";
import Ribbon from "@/home/ui/Ribbon";
import usePlayerStore from "@/home/store/playerStore";
import useDataStore from "@/cards/DataStore";
import _ from "lodash";
import { DeckCardUI } from "../../deck/DeckCardUI";

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
      <div className="w-full h-full bg-slate-900 opacity-80 absolute"></div>
      <div className="w-full h-full relative flex flex-col items-center justify-center">
        <Box rarity="epic" height={800} width={600} size={1.5}>
          <img
            src="/cross.svg"
            className="absolute top-3 right-3 w-8 h-8 cursor-pointer z-10 drop-shadow-[2px_1px_1px_black]"
            onClick={closeModal}
          />
          <div
            className="w-full h-full absolute brightness-75 top-0 left-0"
            style={{
              backgroundImage: "url('/homeBg.jpeg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <ScrollContainer className="w-full h-full flex">
            <div className="w-full h-max flex flex-col items-center relative pb-8">
              <p className="text-4xl font-semibold text-white py-16 relative drop-shadow-[2px_2px_1px_black]">
                Goldaxe
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Borders width={191} height={55} borderUnit={1} rarity={"epic"}>
                  <CardIllustartion width={191} height={55} borderUnit={0.6}>
                    <InnerBord size={1}>
                      <div className="flex w-full items-center justify-start pl-2 gap-2 relative bg-slate-600 h-full">
                        <div
                          className="absolute top-0 left-0 w-full h-full blur-sm"
                          style={{ backgroundImage: "url(/silver.jpeg)" }}
                        />
                        <Badge value="45" />
                        <p className="relative font-semibold">Level</p>
                      </div>
                    </InnerBord>
                  </CardIllustartion>
                </Borders>
                <Borders width={191} height={55} borderUnit={1} rarity={"epic"}>
                  <CardIllustartion width={191} height={55} borderUnit={0.6}>
                    <InnerBord size={1}>
                      <div className="flex w-full items-center justify-start pl-2 gap-2 relative bg-slate-600 h-full">
                        <div
                          className="absolute top-0 left-0 w-full h-full blur-sm"
                          style={{ backgroundImage: "url(/silver.jpeg)" }}
                        />
                        <img
                          className="w-[32px] aspect-square relative"
                          src={getImageUrl(world.illustration)}
                        />
                        <p className="relative font-semibold">World 1</p>
                      </div>
                    </InnerBord>
                  </CardIllustartion>
                </Borders>
                <Borders width={191} height={55} borderUnit={1} rarity={"epic"}>
                  <CardIllustartion width={191} height={55} borderUnit={0.6}>
                    <InnerBord size={1}>
                      <div className="flex w-full items-center justify-start pl-2 gap-2 relative bg-slate-600 h-full">
                        <div
                          className="absolute top-0 left-0 w-full h-full blur-sm"
                          style={{ backgroundImage: "url(/silver.jpeg)" }}
                        />
                        <img
                          src="/trophy.png"
                          className="w-[32px] drop-shadow-[2px_1px_1px_black]"
                        />
                        <p className="relative font-semibold">450</p>
                      </div>
                    </InnerBord>
                  </CardIllustartion>
                </Borders>
                <Stat label="Victory" value="45" />
              </div>
              <Ribbon className="mt-16 px-16">Deck</Ribbon>
              <div className="grid grid-cols-4 w-auto gap-3">
                {deckArray.map((cardId) => (
                  <DeckCardUI cardId={cardId!} unaddble key={cardId} />
                ))}
              </div>
              <Ribbon className="mt-16 px-16">Stats</Ribbon>
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
      </div>
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Borders width={191} height={55} borderUnit={1} rarity={"epic"}>
      <CardIllustartion width={191} height={55} borderUnit={0.6}>
        <InnerBord size={1}>
          <div className="flex w-full items-center justify-center pl-2 relative bg-slate-600 h-full flex-col">
            <div
              className="absolute top-0 left-0 w-full h-full blur-sm"
              style={{ backgroundImage: "url(/silver.jpeg)" }}
            />
            <p className="relative font-semibold leading-5">{label}</p>
            <p className="relative text-sm leading-4">{value}</p>
          </div>
        </InnerBord>
      </CardIllustartion>
    </Borders>
  );
}
