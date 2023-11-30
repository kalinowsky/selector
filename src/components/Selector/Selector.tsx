import React, { useEffect, useRef, useState } from "react"
import { Circle, Image, Layer, Rect, Shape, Stage } from "react-konva"
import Konva from "konva"
import useImage from "use-image"

type Point = {
  x: number
  y: number
  id: string
}

type NewPoint = {
  x: number
  y: number
  xd: number
  yd: number
}

type Shelf = {
  position: [Point, Point, Point, Point]
  id: string
}

type KonvaExtendedMouseEvent = MouseEvent & {
  target: {
    getStage: () => {
      getPointerPosition: () => Point
    }
  }
}

const Img = ({ url }: { url: string }) => {
  const [image] = useImage(url)
  return <Image image={image} />
}

const getTsId = () => `${new Date().getTime()}`

export const Selector: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const [shelves, setShelves] = useState<Shelf[]>([])
  const [activeShelf, setActiveShelf] = useState<Shelf | null>(null)
  const [newShelf, setNewShelf] = useState<NewPoint | null>(null)
  const [activePointId, setActivePointId] = useState<string | null>(null)
  const timer = useRef<number | null>(null)
  const activePoint = useRef<boolean>(false)

  const handleMouseDown = (event: KonvaExtendedMouseEvent) => {
    if (activePoint.current) {
      setNewShelf(null)
      return
    }
    if (!newShelf) {
      const { x, y } = event.target.getStage().getPointerPosition()
      setNewShelf({ x, y, xd: 0, yd: 0 })
      timer.current = new Date().getTime()
    }
  }

  const handleMouseUp = (event: KonvaExtendedMouseEvent) => {
    if (timer.current === null) return
    activePoint.current = false
    const now = new Date().getTime()
    const diff = now - timer.current
    if (diff < 300) {
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
      const { x, y } = event.target.getStage().getPointerPosition()
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

  const handleMouseMove = (event: KonvaExtendedMouseEvent) => {
    activePoint.current = false
    if (activePointId) {
      const { x, y } = event.target.getStage().getPointerPosition()
      if (activeShelf) {
        setActiveShelf((shelf) => ({
          ...shelf,
          position: shelf?.position.map((point) =>
            activePointId === point.id
              ? {
                  x,
                  y,
                  id: point.id,
                }
              : point
          ),
        }))
        return
      }
    }
    if (newShelf) {
      const sx = newShelf.x
      const sy = newShelf.y
      const { x, y } = event.target.getStage().getPointerPosition()
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

  return (
    <Stage
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      width={900}
      height={700}
    >
      <Layer
        onClick={() => {
          if (activePointId) {
            setActivePointId(null)
          } else {
            if (activeShelf) setShelves((shelves) => [...shelves, activeShelf])
            setActiveShelf(null)
            setActivePointId(null)
          }
        }}
      >
        <Img url={imageUrl} />
        {newShelf && (
          <Rect
            x={newShelf.x}
            y={newShelf.y}
            width={newShelf.xd}
            height={newShelf.yd}
            fill="transparent"
            stroke="black"
            onMouseDown={() => {
              console.log("clicked rect")
            }}
          />
        )}

        {shelves.map((value) => {
          return (
            <Shape
              key={value.id}
              sceneFunc={(context, shape) => {
                context.beginPath()
                const [first, ...positions] = value.position
                context.moveTo(first.x, first.y)
                positions.forEach((position) => context.lineTo(position.x, position.y))
                context.closePath()
                context.fillStrokeShape(shape)
              }}
              fill="#00D2FF"
              opacity={0.5}
              stroke="black"
              strokeWidth={4}
              onMouseDown={() => {
                onActivate(value.id)
              }}
            />
          )
        })}
        {activeShelf && (
          <>
            <Shape
              key={activeShelf.id}
              sceneFunc={(context, shape) => {
                context.beginPath()
                const [first, ...positions] = activeShelf.position
                context.moveTo(first.x, first.y)
                positions.forEach((position) => context.lineTo(position.x, position.y))
                context.closePath()
                context.fillStrokeShape(shape)
              }}
              fill="#00D2FF"
              opacity={1}
              stroke="black"
              strokeWidth={4}
              onMouseDown={() => {
                // onActivate(value.id)
              }}
            />
            {activeShelf.position.map((point) => (
              <Circle
                key={point.id}
                x={point.x}
                y={point.y}
                height={20}
                fill="#00D2FF"
                stroke="black"
                strokeWidth={4}
                onMouseDown={() => {
                  setActivePointId(point.id)
                  activePoint.current = true
                }}
              />
            ))}
          </>
        )}
      </Layer>
    </Stage>
  )
}
