import { Stage, Layer, Rect, Shape, Circle } from "react-konva"
import { NewPoint, Point, Shelf } from "./types"
import { Img } from "./Img"
import { getColorForIndex } from "../../helpers.ts/utils"

type PreviewStageProps = {
  pointer: Point
  imageUrl: string
  newShelf: NewPoint | null
  shelves: Shelf[]
  activeShelf: Shelf | null
}

export const PreviewStage: React.FC<PreviewStageProps> = ({ pointer, imageUrl, newShelf, shelves, activeShelf }) => (
  <Stage width={250} height={250} scaleX={2} scaleY={2} offsetX={pointer.x - 62} offsetY={pointer.y - 62}>
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
        />
      )}

      {shelves.map((value, index) => {
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
            fill={getColorForIndex(index)}
            opacity={0.5}
            stroke="black"
            strokeWidth={4}
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
            fill="#FFFFFF"
            opacity={0.7}
            stroke="black"
            strokeWidth={4}
          />
          {activeShelf.position.map((point) => (
            <Circle key={point.id} x={point.x} y={point.y} height={20} fill="#00D2FF" stroke="black" strokeWidth={4} />
          ))}
        </>
      )}
    </Layer>
  </Stage>
)
