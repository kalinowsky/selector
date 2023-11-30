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
  const { pointer, ...stageProps } = useSelector({
    initialShelves,
    onChange,
  })
  return (
    <>
      <MainStage imageUrl={imageUrl} {...stageProps} />
      <div style={{ position: "absolute", top: "0", left: "0" }}>
        {pointer && stageProps.activeShelf && <PreviewStage imageUrl={imageUrl} {...stageProps} pointer={pointer} />}
      </div>
    </>
  )
}
