import { useCallback, useEffect, useRef } from "react"

import { Vector2d } from "konva/lib/types"
import { Point, Shelf, NewPoint, FourPoints, StageEvent } from "./types"
import { debounce } from "../../helpers.ts/debounce"
import { ensureSufficientSize, getTsId } from "../../helpers.ts/utils"
import { useDeltaState } from "../../hooks/useDeltaState"

type UseSelectorArgs = {
  initialShelves?: Shelf[]
  onChange: (shelves: Shelf[]) => void
}

type State = {
  pointer: Point | null
  shelves: Shelf[]
  activeShelf: Shelf | null
  newShelf: NewPoint | null
  activePointId: string | null
  timer: null | number
}

const getInitialData = (initialShelves: Shelf[] | undefined): State => ({
  pointer: null,
  shelves: initialShelves || [],
  activeShelf: null,
  newShelf: null,
  activePointId: null,
  timer: null,
})

export const useSelector = ({ initialShelves, onChange }: UseSelectorArgs) => {
  const { state, setDelta, getSetState } = useDeltaState<State>(getInitialData(initialShelves))
  const { pointer, shelves, activeShelf, newShelf, activePointId, timer } = state

  const activePoint = useRef<boolean>(false)
  const debouncedOnChange = useCallback(debounce(onChange, 200), [onChange])

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        event.preventDefault()
        if (activeShelf) setDelta({ activeShelf: null })
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

  const handleStart = (event: StageEvent) => {
    if (activePoint.current) {
      setDelta({ newShelf: null })
      return
    }
    if (!newShelf) {
      const stage = event.target.getStage()
      if (!stage) return

      const { x, y } = stage.getPointerPosition() as Vector2d
      const time = new Date().getTime()
      setDelta({ newShelf: { x, y, xd: 0, yd: 0 }, timer: time })
    }
  }

  const handleEnd = (event: StageEvent) => {
    if (timer === null || newShelf === null) return
    activePoint.current = false
    const now = new Date().getTime()
    const diff = now - (timer || 0)

    if (diff < 200) {
      setDelta({ timer: null, newShelf: null })
      return
    }

    const sx = newShelf.x
    const sy = newShelf.y

    const stage = event.target.getStage()
    if (!stage) return

    const { x, y } = stage.getPointerPosition() as Vector2d

    const isSufficientSize = ensureSufficientSize(x, sx, y, sy)
    if (!isSufficientSize) {
      setDelta({ timer: null, newShelf: null })
      return
    }

    const shelfToAdd: Shelf = {
      position: [
        { x, y, id: "1" },
        { x, y: sy, id: "2" },
        { x: sx, y: sy, id: "3" },
        { x: sx, y, id: "4" },
      ],
      id: getTsId(),
    }
    setDelta({ newShelf: null, shelves: [...shelves, shelfToAdd] })
  }

  const handleMove = (event: StageEvent) => {
    activePoint.current = false
    const stage = event.target.getStage()
    if (!stage) return

    if (activePointId) {
      const { x, y } = stage.getPointerPosition() as Vector2d
      setDelta({ pointer: { x, y, id: "" } })
      if (activeShelf) {
        const activeShelfToSet = {
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
        }
        setDelta({ activeShelf: activeShelfToSet })
        return
      }
    }
    if (newShelf) {
      const sx = newShelf.x
      const sy = newShelf.y
      const { x, y } = stage.getPointerPosition() as Vector2d
      setDelta({
        newShelf: {
          x: sx,
          y: sy,
          xd: x - sx,
          yd: y - sy,
        },
      })
    }
  }
  const setShelves = getSetState("shelves")
  const setActivePointId = getSetState("activePointId")
  const setActiveShelf = getSetState("activeShelf")

  const onActivate = (shelfId: string) => {
    const newActiveShelf = shelves.find((s) => s.id === shelfId)
    if (!newActiveShelf) return
    if (activeShelf && activeShelf.id !== newActiveShelf.id) {
      setShelves((shelves) => [...shelves, activeShelf])
    }
    setDelta((state) => ({ activeShelf: newActiveShelf, shelves: state.shelves.filter((s) => s.id !== shelfId) }))
  }

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
