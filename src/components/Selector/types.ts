export type Point = {
  x: number
  y: number
  id: string
}

export type NewPoint = {
  x: number
  y: number
  xd: number
  yd: number
}

export type FourPoints = [Point, Point, Point, Point]

export type Shelf = {
  position: FourPoints
  id: string
}

export type KonvaExtendedMouseEvent = MouseEvent & {
  target: {
    getStage: () => {
      getPointerPosition: () => Point
    }
  }
}
