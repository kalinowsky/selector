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

export type Shelf = {
  position: [Point, Point, Point, Point]
  id: string
}

export type KonvaExtendedMouseEvent = MouseEvent & {
  target: {
    getStage: () => {
      getPointerPosition: () => Point
    }
  }
}
