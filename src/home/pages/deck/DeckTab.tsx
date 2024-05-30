import { ManaBall } from "@/game/gui/ManaBar"
import CardBorder, {
  CardContentIllustartion,
  InnerBord,
} from "@/game/gui/card/CardBorder"
import { Button } from "../../Home"
import ScrollContainer from "react-indiana-drag-scroll"
import { useState } from "react"
import CardModal from "./CardModal"
import usePlayerStore from "@/home/store/playerStore"
import { preventDefault } from "@/lib/eventUtils"
import * as _ from "lodash"
import Box from "@/home/ui/Box"
import { FilterModal, SortModal } from "@/home/ui/modal"
import { CardType, findCard, getCardFromLevel, getCardStats } from "@/cards"

interface SortAndFilterBoxProps {
  classNameProps: string
  setActualSort: (sort: string) => void
  actualSort: string
  setActualFilter?: (filter: filterList) => void
  actualFilter?: filterList
}

function SortAndFilterBox({
  setActualSort,
  actualSort,
  setActualFilter,
  actualFilter,
  classNameProps,
}: SortAndFilterBoxProps) {
  const [sortIsOpen, setSortIsOpen] = useState(false)
  const [filterIsOpen, setFilterIsOpen] = useState(false)
  const deck = !!setActualFilter
  return (
    <div className={classNameProps}>
      <div>
        <button
          onClick={() => {
            setSortIsOpen(true)
            filterIsOpen ? setFilterIsOpen(false) : null
          }}
        >
          Sort {`(${actualSort})`}
        </button>
      </div>
      {setActualFilter && (
        <div>
          <button
            onClick={() => {
              setFilterIsOpen(true)
              sortIsOpen ? setSortIsOpen(false) : null
            }}
          >
            Filter {`(${actualFilter})`}
          </button>
        </div>
      )}
      {sortIsOpen && (
        <SortModal
          deck={deck}
          setActualSort={setActualSort}
          actualSort={actualSort}
          closeModal={() => setSortIsOpen(false)}
        />
      )}
      {filterIsOpen && (
        <FilterModal
          setActualFilter={setActualFilter}
          actualFilter={actualFilter}
          closeModal={() => setFilterIsOpen(false)}
        />
      )}
    </div>
  )
}

type DetailedCardType = CardType & { isInDeck: boolean }
interface ShowStatProps {
  detailledDeck: DetailedCardType[]
}

function ShowStat({ detailledDeck }: ShowStatProps) {
  const [showStat, setShowStat] = useState(false)
  let costAverage = 0
  let dmgAverage = 0
  let attackSpeedAverage = 0
  let hpAverage = 0
  for (let i = 0; i < 8; i++) {
    costAverage += detailledDeck[i].cost
    dmgAverage += detailledDeck[i].dmg
    attackSpeedAverage += detailledDeck[i].attackSpeed
    hpAverage += detailledDeck[i].hp
  }
  costAverage /= 8
  dmgAverage /= 8
  attackSpeedAverage /= 8
  hpAverage /= 8
  return (
    <div>
      <div className="absolute right-16 bottom-48">
        <button onClick={() => setShowStat(true)}>...</button>
      </div>
      {showStat && (
        <div className="absolute top-48 left-64 flex flex-col z-50 bg-gray-600">
          <div>Average Cost : {costAverage}</div>
          <div>Damage Average : {dmgAverage.toFixed()}</div>
          <div>Attack Speed Average : {attackSpeedAverage.toFixed(2)}</div>
          <div>Average HP : {hpAverage.toFixed()}</div>
          <button onClick={() => setShowStat(false)}>Close</button>
        </div>
      )}
    </div>
  )
}

export type filterList = {
  Level1: boolean
  Level2: boolean
  Level3: boolean
  Common: boolean
  Rare: boolean
  Epic: boolean
  Legendary: boolean
}

export default function DeckTab() {
  const { deck, collection } = usePlayerStore((state) => ({
    deck: state.deck,
    collection: state.getCollection(),
  }))
  let { detailledCollection } = usePlayerStore((state) => ({
    detailledCollection: state.getCollectionCompleteInfo(collection),
  }))

  const deckArray = _.concat(deck, _.fill(Array(8 - deck.length), null))
  const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 }

  const [actualSort, setActualSort] = useState("Cost ↑")
  const [actualFilter, setActualFilter] = useState<filterList>({
    Level1: false,
    Level2: false,
    Level3: false,
    Common: false,
    Rare: false,
    Epic: false,
    Legendary: false,
  })

  const classNameCollections =
    "w-full h-6 flex -top-4 justify-center items-center"

  switch (actualSort) {
    case "Cost ↓":
      detailledCollection.sort(
        (a, b) => findCard(a.id, a.level).cost - findCard(b.id, b.level).cost
      )
      debugger
      break
    case "Cost ↑":
      detailledCollection.sort(
        (a, b) =>
          getCardFromLevel(getCardStats(b.id), b.level).cost -
          getCardFromLevel(getCardStats(a.id), a.level).cost
      )
      break
    case "Rarity ↓":
      detailledCollection.sort(
        (a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]
      )
      break
    case "Rarity ↑":
      detailledCollection.sort(
        (a, b) => rarityOrder[a.rarity] + rarityOrder[b.rarity]
      )
      break
    case "World ↓":
      detailledCollection.sort((a, b) => a.world - b.world)
      break
    case "World ↑":
      detailledCollection.sort((a, b) => a.world + b.world)
      break
    default:
      console.log("error on sort")
  }
  let collectionTmp: (CardType & {
    isInDeck: boolean
  })[] = []

  let tmp
  if (actualFilter.Level1) {
    console.log("hello")
    tmp = detailledCollection.filter((card) => card.cost === 1)
    tmp.forEach((valueTmp) => {
      if (!collectionTmp.includes(valueTmp)) collectionTmp.push(valueTmp)
    })
  }
  if (actualFilter.Level2) {
    tmp = detailledCollection.filter((card) => card.cost === 2)
    tmp.forEach((valueTmp) => {
      if (!collectionTmp.includes(valueTmp)) collectionTmp.push(valueTmp)
    })
  }
  if (actualFilter.Level3) {
    tmp = detailledCollection.filter((card) => card.cost === 3)
    tmp.forEach((valueTmp) => {
      if (!collectionTmp.includes(valueTmp)) collectionTmp.push(valueTmp)
    })
  }
  if (actualFilter.Common) {
    tmp = detailledCollection.filter((card) => card.rarity === "common")
    tmp.forEach((valueTmp) => {
      if (!collectionTmp.includes(valueTmp)) collectionTmp.push(valueTmp)
    })
  }
  if (actualFilter.Rare) {
    tmp = detailledCollection.filter((card) => card.rarity === "rare")
    tmp.forEach((valueTmp) => {
      if (!collectionTmp.includes(valueTmp)) collectionTmp.push(valueTmp)
    })
  }
  if (actualFilter.Epic) {
    tmp = detailledCollection.filter((card) => card.rarity === "epic")
    tmp.forEach((valueTmp) => {
      if (!collectionTmp.includes(valueTmp)) collectionTmp.push(valueTmp)
    })
  }
  if (actualFilter.Legendary) {
    tmp = detailledCollection.filter((card) => card.rarity === "legendary")
    tmp.forEach((valueTmp) => {
      if (!collectionTmp.includes(valueTmp)) collectionTmp.push(valueTmp)
    })
  }
  if (Object.values(actualFilter).some((filter) => filter === true))
    detailledCollection = collectionTmp
  const [actualSortDeck, setActualSortDeck] = useState("Cost ↑")
  let detailledDeck = []
  const getCompleteInfo = usePlayerStore((state) => state.getCompleteInfo)

  for (let i = 0; i < 8; i++) detailledDeck.push(getCompleteInfo(deckArray[i]!))
  switch (actualSortDeck) {
    case "Cost ↓":
      detailledDeck.sort((a, b) => a.cost - b.cost)
      break
    case "Cost ↑":
      detailledDeck.sort((a, b) => a.cost + b.cost)
      break
    case "Rarity ↓":
      detailledDeck.sort(
        (a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]
      )
      break
    case "Rarity ↑":
      detailledDeck.sort(
        (a, b) => rarityOrder[a.rarity] + rarityOrder[b.rarity]
      )
      break
    case "World ↓":
      detailledDeck.sort((a, b) => a.world - b.world)
      break
    case "World ↑":
      detailledDeck.sort((a, b) => a.world + b.world)
      break
    default:
      console.log("error on sort")
  }
  const classNameDeck =
    "-mb-[4.5rem] -ml-60 w-full flex justify-center items-center z-10"
  console.log(detailledCollection)
  return (
    <div className="w-full grid grid-rows-[1fr_auto] absolute top-0 h-full">
      <SortAndFilterBox
        classNameProps={classNameCollections}
        setActualSort={setActualSort}
        actualSort={actualSort}
        setActualFilter={setActualFilter}
        actualFilter={actualFilter}
      />
      <ScrollContainer className="grow overflow-y-scroll pt-2 scrollbar-hide flex justify-center">
        <div className="grid grid-cols-3 gap-4">
          {detailledCollection.map((card, index) => (
            <div className="w-full flex justify-center" key={index}>
              <DeckCard cardId={card.id} />
            </div>
          ))}
        </div>
      </ScrollContainer>
      <SortAndFilterBox
        classNameProps={classNameDeck}
        setActualSort={setActualSortDeck}
        actualSort={actualSortDeck}
      />
      <div className="w-full flex justify-center relative overflow-hidden mb-2 mt-4">
        <Box width={650} height={210} rarity="legendary">
          <div
            className="absolute w-full h-full top-0 left-0 blur-sm"
            style={{
              backgroundImage: "url(/silver.jpeg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <ScrollContainer horizontal={true} vertical={false}>
            <div className="flex gap-4 relative pt-[6px] pl-[6px] pb-[8px]">
              {detailledDeck.map((cardId, index) => (
                <div
                  className="w-full flex justify-center overflow-visible"
                  key={cardId.id || `index_${index}`}
                >
                  <div className="w-[102px] h-[142px] relative rounded-md box-content">
                    <div className="w-full h-full bg-slate-900 opacity-20 absolute" />
                    <InnerBord size={1}>
                      <></>
                    </InnerBord>
                    {cardId.id !== null && (
                      <div className="absolute top-0 left-0">
                        <DeckCard cardId={cardId.id} isHand />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollContainer>
        </Box>
      </div>
      <ShowStat detailledDeck={detailledDeck} />
    </div>
  )
}

interface DeckCardProps {
  cardId: number
  isHand?: boolean
  unaddble?: boolean
}

function DeckCard({ cardId, isHand, unaddble: addable }: DeckCardProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const { card, removeCardFromDeck, addCardToDeck, isDeckFull } =
    usePlayerStore((state) => ({
      card: state.getCompleteInfo(cardId),
      removeCardFromDeck: state.removeCardFromDeck,
      addCardToDeck: state.addCardToDeck,
      isDeckFull: state.isDeckFull(),
    }))
  return (
    <>
      {isDescriptionOpen && (
        <CardModal
          cardId={card.id}
          closeModal={() => setIsDescriptionOpen(false)}
        />
      )}
      <div className="relative select-none h-min">
        <div className="" onClick={() => setIsDescriptionOpen(true)}>
          <CardBorder rarity={card.rarity} size={isHand ? 1.6 : 2}>
            <div className="w-full h-full flex flex-col relative">
              <CardContentIllustartion card={card} size={isHand ? 1.6 : 2} />
              <div className="absolute top-0 right-0">
                <svg
                  className="h-full absolute left-0 -translate-x-full"
                  viewBox="0 0 32 32"
                >
                  <polygon points="0,0 32,32 32,0" fill="black" />
                </svg>
                <div className=" bg-black text-white text-sm font-[stylised] leading-3 px-2 pl-1 py-[2px]">
                  {card.level}
                </div>
              </div>
            </div>
          </CardBorder>
          <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 scale-[65%]">
            <ManaBall mana={card.cost} />
          </div>
        </div>
        {!addable && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4">
            {card.isInDeck ? (
              <Button
                action={() => removeCardFromDeck(card.id)}
                small
                className="px-4 py-0"
              >
                <img
                  src="/icons/minus.svg"
                  alt="remove"
                  className="w-4 h-4 m-1 my-2"
                />
              </Button>
            ) : (
              <Button
                action={preventDefault(() => addCardToDeck(card.id))}
                small
                className="px-4 py-0"
                disabled={isDeckFull}
              >
                <img
                  src="/icons/plus.svg"
                  alt="add"
                  className="w-4 h-4 m-1 my-2"
                />
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
