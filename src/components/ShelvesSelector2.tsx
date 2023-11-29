import React, { useEffect, useRef, useState } from "react"
import ShelvesSelector from "./ShelvesSelector"
import { Circle, Image, Layer, Rect, Shape, Stage } from "react-konva"
import Konva from "konva"
import useImage from "use-image"

type Point = {
  x: number
  y: number
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

const ShelvesSelector2: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const [shelves, setShelves] = useState<Shelf[]>([])
  const [newShelf, setNewShelf] = useState<NewPoint | null>(null)
  const timer = useRef<number | null>(null)

  const handleMouseDown = (event: KonvaExtendedMouseEvent) => {
    if (!newShelf) {
      const { x, y } = event.target.getStage().getPointerPosition()
      setNewShelf({ x, y, xd: 0, yd: 0 })
      timer.current = new Date().getTime()
    }
  }

  const handleMouseUp = (event: KonvaExtendedMouseEvent) => {
    if (timer.current === null) return
    const now = new Date().getTime()
    const diff = now - timer.current
    if (diff < 300) {
      timer.current = null
      setNewShelf(null)
      return
    }
    if (newShelf) {
      const sx = newShelf.x
      const sy = newShelf.y
      console.log({ sx, sy })
      const { x, y } = event.target.getStage().getPointerPosition()
      const annotationToAdd: Shelf = {
        position: [
          { x, y },
          { x, y: sy },
          { x: sx, y: sy },
          { x: sx, y },
        ],
        id: `${new Date().getTime()}`,
      }
      shelves.push(annotationToAdd)
      setNewShelf(null)
      setShelves(shelves)
    }
  }

  console.log({ annotations: shelves })

  const handleMouseMove = (event: KonvaExtendedMouseEvent) => {
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

  return (
    <Stage
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      width={900}
      height={700}
    >
      <Layer>
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
                console.log(`myszka tu ${value.id}`)
              }}
            />
          )
        })}
      </Layer>
    </Stage>
  )
}

export default ShelvesSelector2
