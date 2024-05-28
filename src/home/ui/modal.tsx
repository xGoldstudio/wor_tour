import { useEffect } from "react"
import { createPortal } from "react-dom"
import { Header } from "../Home"
import { stopPropagation } from "@/lib/eventUtils"

interface ModalProps {
  children: React.ReactNode
  closeModal: () => void
  title: string
}

export default function Modal({ children, closeModal, title }: ModalProps) {
  useEffect(() => {
    function keyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeModal()
      }
    }
    history.pushState({}, "_", `#${title}`)
    window.addEventListener("keydown", keyDown)
    window.addEventListener("popstate", closeModal)

    return () => {
      window.removeEventListener("keydown", keyDown)
      window.removeEventListener("popstate", closeModal)
      history.pushState(
        null,
        "",
        window.location.pathname + window.location.search
      )
    }
  })

  const home = document.getElementById("home")

  if (!home) return null

  return createPortal(
    <div className="absolute w-full h-full top-0 z-10">{children}</div>,
    home
  )
}

interface CoverModalProps {
  children: React.ReactNode
  closeModal: () => void
}

export function CoverModal({ children, closeModal }: CoverModalProps) {
  return (
    <>
      <div
        className="w-full h-full absolute brightness-75"
        style={{
          backgroundImage: "url('/homeBg.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="w-full h-full absolute bg-[linear-gradient(0deg,_rgba(226,232,240,0.2)_0%,_rgba(226,232,240,0)_100%),_linear-gradient(0deg,_rgba(226,232,240,0)_50%,_rgba(226,232,240,1)_70%)]" />
      </div>

      <div className="w-full h-full relative flex flex-col gap-4">
        <Header />
        <div className="relative w-full h-full px-8">
          <img
            src="/cross.svg"
            className="absolute top-0 right-8 w-8 h-8 cursor-pointer"
            onClick={closeModal}
          />
          {children}
        </div>
      </div>
    </>
  )
}

interface BackgroundModalProps {
  children: React.ReactNode
  closeModal: () => void
}

export function BackgroundModal({
  children,
  closeModal,
}: BackgroundModalProps) {
  return (
    <>
      <div className="w-full h-full absolute bg-slate-900 opacity-80" />
      <div className="w-full h-full absolute flex justify-center items-center gap-8 flex-col">
        <img
          src="/cross.svg"
          className="absolute top-16 right-8 w-8 h-8 cursor-pointer"
          onClick={stopPropagation(closeModal)}
        />
        {children}
      </div>
    </>
  )
}

interface SortModalProps {
  setActualSort: (sort: string) => void
  actualSort: string
  closeModal: () => void
}

export function SortModal({
  setActualSort,
  actualSort,
  closeModal,
}: SortModalProps) {
  const sortList = [
    "Cost ↓",
    "Cost ↑",
    "Rarity ↓",
    "Rarity ↑",
    "World ↓",
    "World ↑",
  ]

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setActualSort(event.target.value)
  }

  return (
    <div className="flex flex-col items-center justify-center w-44 h-20 bg-gray-500 absolute top-48 z-50">
      <label>Order cards by :</label>
      <select name="criteria" onChange={handleChange}>
        {sortList.map((sortCriteria, index) => (
          <option
            key={index}
            value={sortCriteria}
            selected={sortCriteria === actualSort}
            onClick={closeModal}
          >
            {sortCriteria}
          </option>
        ))}
      </select>
      <button onClick={closeModal}>Close</button>
    </div>
  )
}

interface FilterModalProps {
  setActualFilter: (filter: string) => void
  actualFilter: string
  closeModal: () => void
}

export function FilterModal({
  setActualFilter,
  actualFilter,
  closeModal,
}: FilterModalProps) {
  const filterList = [
    "None",
    "Level 1",
    "Level 2",
    "Level 3",
    "Common",
    "Rare",
    "Epic",
    "Legendary",
  ]

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setActualFilter(event.target.value)
  }

  return (
    <div className="flex flex-col items-center justify-center w-44 h-20 bg-gray-500 absolute top-48 z-50">
      <label>Filter cards by :</label>
      <select name="criteria" onChange={handleChange}>
        {filterList.map((sortFilter, index) => (
          <option
            key={index}
            value={sortFilter}
            selected={sortFilter === actualFilter}
            onClick={closeModal}
          >
            {sortFilter}
          </option>
        ))}
      </select>
      <button onClick={closeModal}>Close</button>
    </div>
  )
}
