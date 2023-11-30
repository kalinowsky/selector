import React from "react"

import { PreviewStage } from "./PreviewStage"
import { MainStage } from "./MainStage"
import { Shelf } from "./types"

import { useSelector } from "./useSelector"

type SelectorProps = {
  imageUrl: string
  shelves?: Shelf[]
  onChange: (shelves: Shelf[]) => void
}

export const Selector: React.FC<SelectorProps> = ({ imageUrl, shelves: initialShelves, onChange }) => {
  const {
    pointer,
    newShelf,
    shelves,
    activeShelf,
    activePointId,
    activePoint,
    onActivate,
    handleStart,
    handleMove,
    handleEnd,
    setActivePointId,
    setShelves,
    setActiveShelf,
  } = useSelector({
    initialShelves,
    onChange,
  })
  return (
    <>
      <MainStage
        imageUrl={imageUrl}
        newShelf={newShelf}
        shelves={shelves}
        activeShelf={activeShelf}
        handleStart={handleStart}
        handleMove={handleMove}
        handleEnd={handleEnd}
        activePointId={activePointId}
        setActivePointId={setActivePointId}
        setShelves={setShelves}
        setActiveShelf={setActiveShelf}
        onActivate={onActivate}
        activePoint={activePoint}
      />
      <div style={{ position: "absolute", top: "0", left: "0" }}>
        {pointer && activeShelf && (
          <PreviewStage
            pointer={pointer}
            imageUrl={imageUrl}
            newShelf={newShelf}
            shelves={shelves}
            activeShelf={activeShelf}
          />
        )}
      </div>
    </>
  )
}
