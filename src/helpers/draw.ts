import { Context } from "konva/lib/Context"
import { ShapeConfig, Shape as ShapeType } from "konva/lib/Shape"
import { FourPoints } from "../components/Selector/types"

export const drawShape = (context: Context, shape: ShapeType<ShapeConfig>, position: FourPoints) => {
  context.beginPath()
  const [first, ...positions] = position
  context.moveTo(first.x, first.y)
  positions.forEach((position) => context.lineTo(position.x, position.y))
  context.closePath()
  context.fillStrokeShape(shape)
}
