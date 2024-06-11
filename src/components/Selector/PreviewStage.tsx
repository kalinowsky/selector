import { Stage, Layer, Rect, Shape, Circle } from "react-konva"
import { NewPoint, Point, Shelf } from "./types"
import { Img } from "../Img"
import { getColorForIndex } from "../../helpers/utils"
import { drawShape } from "../../helpers/draw"

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
            sceneFunc={(context, shape) => drawShape(context, shape, value.position)}
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
            sceneFunc={(context, shape) => drawShape(context, shape, activeShelf.position)}
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
