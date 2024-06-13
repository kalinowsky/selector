import React from "react"

import { PreviewStage } from "./PreviewStage"
import { MainStage } from "./MainStage"
import { Shelf } from "./types"

import { useSelector } from "./useSelector"
import { TrashIcon } from "../Trash"

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
      <div style={{ position: "fixed", top: "0", left: "0" }}>
        {pointer && stageProps.activeShelf && stageProps.activePointId && (
          <PreviewStage imageUrl={imageUrl} {...stageProps} pointer={pointer} />
        )}
      </div>
      {stageProps.activeShelf && !stageProps.activePointId && (
        <button
          style={{
            position: "fixed",
            top: "0",
            right: "0",
            width: "100px",
            height: "100px",
            backgroundColor: "#AA2222",
          }}
          onClick={() => stageProps.setActiveShelf(null)}
        >
          <TrashIcon />
        </button>
      )}
    </>
  )
}
