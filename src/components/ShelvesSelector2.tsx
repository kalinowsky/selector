import React, { useEffect, useRef, useState } from "react"
import ShelvesSelector from "./ShelvesSelector"
import { Circle, Image, Layer, Rect, Shape, Stage } from "react-konva"
import Konva from "konva"
import useImage from "use-image"

type Point = {
  x: number
  y: number
}

type Shelf = {
  position: [Point, Point, Point, Point]
  id: string
}

const Img = ({ url }: { url: string }) => {
  const [image] = useImage(url)
  return <Image image={image} />
}

const ShelvesSelector2: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const [annotations, setAnnotations] = useState<Shelf[]>([])
  const [newAnnotation, setNewAnnotation] = useState([])
  const timer = useRef<number | null>(null)

  const handleMouseDown = (event: MouseEvent) => {
    if (newAnnotation.length === 0) {
      const { x, y } = event.target.getStage().getPointerPosition()
      setNewAnnotation([{ x, y, width: 0, height: 0, key: "0" }])
      timer.current = new Date().getTime()
    }
  }

  const handleMouseUp = (event: MouseEvent) => {
    if (timer.current === null) return
    const now = new Date().getTime()
    const diff = now - timer.current
    if (diff < 300) {
      timer.current = null
      setNewAnnotation([])
      return
    }
    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x
      const sy = newAnnotation[0].y
      console.log({ sx, sy })
      const { x, y } = event.target.getStage().getPointerPosition() as Point
      const annotationToAdd: Shelf = {
        position: [
          { x, y },
          { x, y: sy },
          { x: sx, y: sy },
          { x: sx, y },
        ],
        id: `${new Date().getTime()}`,
      }
      annotations.push(annotationToAdd)
      setNewAnnotation([])
      setAnnotations(annotations)
    }
  }

  console.log({ annotations })

  const handleMouseMove = (event) => {
    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x
      const sy = newAnnotation[0].y
      const { x, y } = event.target.getStage().getPointerPosition()
      setNewAnnotation([
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          key: "0",
        },
      ])
    }
  }

  const annotationsToDraw = [...annotations, ...newAnnotation]
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
        {newAnnotation.map((value) => (
          <Rect
            x={value.x}
            y={value.y}
            width={value.width}
            height={value.height}
            fill="transparent"
            stroke="black"
            onMouseDown={() => {
              console.log("clicked rect")
            }}
          />
        ))}
        {annotations.map((value) => {
          return (
            <Shape
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
