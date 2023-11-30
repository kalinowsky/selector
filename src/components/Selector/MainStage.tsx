import { Stage, Layer, Rect, Shape, Circle } from "react-konva"
import { Img } from "./Img"
import { NewPoint, Shelf, StageEvent } from "./types"

type MainStageProps = {
  imageUrl: string
  newShelf: NewPoint | null
  shelves: Shelf[]
  activeShelf: Shelf | null
  handleStart: (evt: StageEvent) => void
  handleEnd: (evt: StageEvent) => void
  handleMove: (evt: StageEvent) => void
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
  handleStart,
  handleEnd,
  handleMove,
  activePointId,
  setActivePointId,
  setShelves,
  setActiveShelf,
  onActivate,
  activePoint,
}) => (
  <Stage
    onMouseDown={handleStart}
    onMouseMove={handleMove}
    onMouseUp={handleEnd}
    onTouchStart={handleStart}
    onTouchMove={handleMove}
    onTouchEnd={handleEnd}
    width={1000}
    height={1000}
  >
    <Layer
      onTap={() => {
        if (activePointId) {
          setActivePointId(null)
        } else {
          if (activeShelf) setShelves((shelves) => [...shelves, activeShelf])
          setActiveShelf(null)
          setActivePointId(null)
        }
      }}
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
            onTouchStart={() => {
              onActivate(value.id)
            }}
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
              onTouchStart={() => {
                setActivePointId(point.id)
                activePoint.current = true
              }}
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
