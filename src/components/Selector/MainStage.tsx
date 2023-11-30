import { Stage, Layer, Rect, Shape, Circle } from "react-konva"
import { Img } from "./Selector"
import { NewPoint, Shelf } from "./types"
import { KonvaEventObject } from "konva/lib/Node"

type MainStageProps = {
  imageUrl: string
  newShelf: NewPoint | null
  shelves: Shelf[]
  activeShelf: Shelf | null
  handleMouseDown: (evt: KonvaEventObject<MouseEvent>) => void
  handleMouseUp: (evt: KonvaEventObject<MouseEvent>) => void
  handleMouseMove: (evt: KonvaEventObject<MouseEvent>) => void
  activePointId: string | null
  setActivePointId: React.Dispatch<React.SetStateAction<string | null>>
  setShelves: React.Dispatch<React.SetStateAction<Shelf[]>>
  setActiveShelf: React.Dispatch<React.SetStateAction<Shelf | null>>
  onActivate: (shelfId: string) => void
  activePoint: React.MutableRefObject<boolean>
}

export const MainStage: React.FC<MainStageProps> = ({
  imageUrl,
  newShelf,
  shelves,
  activeShelf,
  handleMouseDown,
  handleMouseUp,
  handleMouseMove,
  activePointId,
  setActivePointId,
  setShelves,
  setActiveShelf,
  onActivate,
  activePoint,
}) => (
  <Stage
    onMouseDown={handleMouseDown}
    onMouseUp={handleMouseUp}
    onMouseMove={handleMouseMove}
    width={1000}
    height={1000}
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
