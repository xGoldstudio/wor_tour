import { useStartGame } from "@/game/stores/gameMetadataStore";
import * as _ from "lodash";
import { useState } from "react";
import useDataStore from "@/cards/DataStore";
import { Box, getImageUrl, textureByRarity, Badge } from "@repo/ui";
import usePlayerStore from "@/home/store/playerStore";
import Cover from "@/home/ui/Cover";
import { EmptyBar } from "@/game/gui/ManaBar";
import {
  Borders,
  CardIllustartion,
  InnerBord,
} from "../../../../../../packages/ui/components/card/CardBorder";
import Modal from "@/home/ui/modal";
import Ribbon from "@/home/ui/Ribbon";
import { DeckCard } from "../deck/DeckTab";
import ScrollContainer from "react-indiana-drag-scroll";
import AllWorlds from "./AllWorlds";

export default function HomeTab() {
  const startGame = useStartGame();
  const [currentWorld, setCurrentWorld] = useState(0);
  const { world, levels } = useDataStore((state) => ({
    world: state.worlds[currentWorld],
    levels: state.levels,
  }));
  const [profileOpen, setProfileOpen] = useState(false);
  const [worldsModalOpen, setWorldsModalOpen] = useState(false);

  const { deck, trophies } = usePlayerStore((state) => ({
    deck: state.deck,
    trophies: state.trophies,
  }));

  const deckArray = _.concat(deck, _.fill(Array(8 - deck.length), null));

  return (
    <div className="w-full h-full flex flex-col items-center">
      {worldsModalOpen && (
        <AllWorlds closeModal={() => setWorldsModalOpen(false)} />
      )}
      {profileOpen && (
        <Modal title="profile" closeModal={() => setProfileOpen(false)}>
          <div className="w-full h-full bg-slate-900 opacity-80 absolute"></div>
          <div className="w-full h-full relative flex flex-col items-center justify-center">
            <Box rarity="epic" height={800} width={600} size={1.5}>
              <img
                src="/cross.svg"
                className="absolute top-3 right-3 w-8 h-8 cursor-pointer z-10 drop-shadow-[2px_1px_1px_black]"
                onClick={() => setProfileOpen(false)}
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
                    <Borders
                      width={191}
                      height={55}
                      borderUnit={1}
                      rarity={"epic"}
                    >
                      <CardIllustartion
                        width={191}
                        height={55}
                        borderUnit={0.6}
                      >
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
                    <Borders
                      width={191}
                      height={55}
                      borderUnit={1}
                      rarity={"epic"}
                    >
                      <CardIllustartion
                        width={191}
                        height={55}
                        borderUnit={0.6}
                      >
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
                    <Borders
                      width={191}
                      height={55}
                      borderUnit={1}
                      rarity={"epic"}
                    >
                      <CardIllustartion
                        width={191}
                        height={55}
                        borderUnit={0.6}
                      >
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
                      <DeckCard
                        cardId={cardId!}
                        size={1.4}
                        unaddble
                        key={cardId}
                      />
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
      )}
      <div
        className="flex items-center gap-2 relative w-full px-12"
        onClick={() => setProfileOpen(true)}
      >
        <div className="relative flex items-center justify-between gap-4 px-4 py-4 pr-20">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg width="100%" height="100%">
              <mask id="svgmask1">
                <rect fill="#ffffff" x={0} y={0} width="85%" height="100%" />
                <polygon fill="#ffffff" points="324 0, 383 0, 324 84"></polygon>
              </mask>
              <rect
                fill="black"
                x={0}
                y={0}
                width="100%"
                height="100%"
                mask="url(#svgmask1)"
              />
              <image
                className="blur-[6px]"
                href={textureByRarity("common")}
                x="0"
                y="0"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid slice"
                mask="url(#svgmask1)"
              />
            </svg>
          </div>
          <div className="flex flex-col h-min w-[160px] text-slate-100">
            <p className="relative font-semibold text-xl leading-2">Goldaxe</p>
            <p className="relative text-sm  leading-2">World 1</p>
          </div>
          <div className="relative w-[110px] h-[32px]">
            <img
              src="/trophy.png"
              className="absolute z-10 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[48px] drop-shadow-[2px_1px_1px_black]"
            />
            <InnerBord size={1.5}>
              <div className="w-full h-full relative bg-slate-600 flex items-center justify-end pr-2">
                <Cover cardRarity="rare" />
                <p className="relative font-semibold">{trophies}</p>
              </div>
            </InnerBord>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-16 items-center grow pt-20">
        <div
          className="relative w-1/2"
          onClick={() => setWorldsModalOpen(true)}
        >
          <img
            className="w-full aspect-square relative drop-shadow-[-25px_15px_1px_rgba(0,0,0,0.5)]"
            src={getImageUrl(world.illustration)}
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-md overflow-hidden">
            <Borders width={160} height={32} borderUnit={0.5} rarity={"rare"}>
              <CardIllustartion width={160} height={32} borderUnit={0.5}>
                <InnerBord size={0.5}>
                  <EmptyBar />
                </InnerBord>
              </CardIllustartion>
            </Borders>
          </div>
        </div>
        <div
          className="relative rounded-sm flex p-1 flex-col items-center font-slate-600 cursor-pointer"
          onClick={() => startGame()}
        >
          <div className="w-[calc(100%_+_6px)] h-[calc(100%_+_6px)] absolute top-[-3px] left-[-3px] blur-sm rounded-sm  bg-amber-100 animate-pulse"></div>
          <Cover cardRarity="epic" className="rounded-sm" />
          <div className="relative rounded-sm w-full flex justify-center py-2 mx-4">
            <div className="bg-white w-full h-full absolute top-0 backdrop-blur-sm opacity-50 rounded-sm"></div>
            <p className="text-2xl relative font-bold">Battle</p>
          </div>
          <div className="relative flex items-center gap-3 justify-center px-16">
            <img
              src="/money.png"
              className="h-[48px] drop-shadow-[2px_1px_1px_black]"
            />
            <div className="relative">
              <p className="text-sm font-semibold leading-4">900/5000</p>
              <p className="text-sm leading-4">reset in: 2h50</p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
