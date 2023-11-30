import React, { useCallback, useEffect, useRef, useState } from "react"

import { PreviewStage } from "./PreviewStage"
import { KonvaEventObject } from "konva/lib/Node"
import { MainStage } from "./MainStage"
import { Vector2d } from "konva/lib/types"
import { Point, Shelf, NewPoint, FourPoints } from "./types"
import { debounce } from "../../helpers.ts/debounce"
import { getTsId } from "../../helpers.ts/utils"

type SelectorProps = {
  imageUrl: string
  shelves?: Shelf[]
  onChange: (shelves: Shelf[]) => void
}

export const Selector: React.FC<SelectorProps> = ({ imageUrl, shelves: initialShelves, onChange }) => {
  const [pointer, setPointer] = useState<Point | null>(null)
  const [shelves, setShelves] = useState<Shelf[]>(() => initialShelves || [])
  const [activeShelf, setActiveShelf] = useState<Shelf | null>(null)
  const [newShelf, setNewShelf] = useState<NewPoint | null>(null)
  const [activePointId, setActivePointId] = useState<string | null>(null)
  const timer = useRef<number | null>(null)
  const activePoint = useRef<boolean>(false)
  const debouncedOnChange = useCallback(debounce(onChange, 200), [onChange])

  const handleMouseDown = (event: KonvaEventObject<MouseEvent>) => {
    if (activePoint.current) {
      setNewShelf(null)
      return
    }
    if (!newShelf) {
      const stage = event.target.getStage()
      if (!stage) return

      const { x, y } = stage.getPointerPosition() as Vector2d
      setNewShelf({ x, y, xd: 0, yd: 0 })
      timer.current = new Date().getTime()
    }
  }

  const handleMouseUp = (event: KonvaEventObject<MouseEvent>) => {
    if (timer.current === null) return
    activePoint.current = false
    const now = new Date().getTime()
    const diff = now - timer.current
    if (diff < 200) {
      timer.current = null
      setNewShelf(null)
      return
    }
    if (activePointId) {
      setActivePointId(null)
      return
    }
    if (newShelf) {
      const sx = newShelf.x
      const sy = newShelf.y
      const stage = event.target.getStage()
      if (!stage) return
      const { x, y } = stage.getPointerPosition() as Vector2d
      const annotationToAdd: Shelf = {
        position: [
          { x, y, id: "1" },
          { x, y: sy, id: "2" },
          { x: sx, y: sy, id: "3" },
          { x: sx, y, id: "4" },
        ],
        id: getTsId(),
      }
      shelves.push(annotationToAdd)
      setNewShelf(null)
      setShelves(shelves)
    }
  }

  const handleMouseMove = (event: KonvaEventObject<MouseEvent>) => {
    activePoint.current = false
    const stage = event.target.getStage()
    if (!stage) return

    if (activePointId) {
      const { x, y } = stage.getPointerPosition() as Vector2d
      setPointer({ x, y, id: "" })
      if (activeShelf) {
        setActiveShelf({
          ...activeShelf,
          position: activeShelf.position.map((point) =>
            activePointId === point.id
              ? {
                  x,
                  y,
                  id: point.id,
                }
              : point
          ) as FourPoints,
        })
        return
      }
    }
    if (newShelf) {
      const sx = newShelf.x
      const sy = newShelf.y
      const { x, y } = stage.getPointerPosition() as Vector2d
      setNewShelf({
        x: sx,
        y: sy,
        xd: x - sx,
        yd: y - sy,
      })
    }
  }

  const onActivate = (shelfId: string) => {
    const newActiveShelf = shelves.find((s) => s.id === shelfId)
    if (!newActiveShelf) return
    if (activeShelf && activeShelf.id !== newActiveShelf.id) {
      setShelves((shelves) => [...shelves, activeShelf])
    }
    setShelves((shelves) => shelves.filter((s) => s.id !== shelfId))
    setActiveShelf(newActiveShelf)
  }

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        event.preventDefault()
        if (activeShelf) setActiveShelf(null)
      }
    }

    document.addEventListener("keydown", keyDownHandler)

    return () => {
      document.removeEventListener("keydown", keyDownHandler)
    }
  }, [activeShelf])

  useEffect(() => {
    debouncedOnChange(activeShelf ? [...shelves, activeShelf] : shelves)
  }, [shelves.length, activeShelf])

  return (
    <>
      <MainStage
        imageUrl={imageUrl}
        newShelf={newShelf}
        shelves={shelves}
        activeShelf={activeShelf}
        handleMouseDown={handleMouseDown}
        handleMouseUp={handleMouseUp}
        handleMouseMove={handleMouseMove}
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
