import { useCallback, useEffect, useRef, useState } from "react"

import { Vector2d } from "konva/lib/types"
import { Point, Shelf, NewPoint, FourPoints, StageEvent } from "./types"
import { debounce } from "../../helpers.ts/debounce"
import { ensureSufficientSize, getTsId } from "../../helpers.ts/utils"

type UseSelectorArgs = {
  initialShelves?: Shelf[]
  onChange: (shelves: Shelf[]) => void
}

export const useSelector = ({ initialShelves, onChange }: UseSelectorArgs) => {
  const [pointer, setPointer] = useState<Point | null>(null)
  const [shelves, setShelves] = useState<Shelf[]>(() => initialShelves || [])
  const [activeShelf, setActiveShelf] = useState<Shelf | null>(null)
  const [newShelf, setNewShelf] = useState<NewPoint | null>(null)
  const [activePointId, setActivePointId] = useState<string | null>(null)
  const timer = useRef<number | null>(null)
  const activePoint = useRef<boolean>(false)
  const debouncedOnChange = useCallback(debounce(onChange, 200), [onChange])

  const handleStart = (event: StageEvent) => {
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

  const handleEnd = (event: StageEvent) => {
    if (timer.current === null || newShelf === null) return
    activePoint.current = false
    const now = new Date().getTime()
    const diff = now - timer.current

    if (diff < 200) {
      timer.current = null
      setNewShelf(null)
      return
    }

    const sx = newShelf.x
    const sy = newShelf.y

    const stage = event.target.getStage()
    if (!stage) return

    const { x, y } = stage.getPointerPosition() as Vector2d

    const isSufficientSize = ensureSufficientSize(x, sx, y, sy)
    if (!isSufficientSize) {
      timer.current = null
      setNewShelf(null)
      return
    }

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

  const handleMove = (event: StageEvent) => {
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

  return {
    pointer,
    onActivate,
    handleStart,
    handleMove,
    handleEnd,
    newShelf,
    shelves,
    setShelves,
    activeShelf,
    activePointId,
    setActivePointId,
    setActiveShelf,
    activePoint,
  }
}
