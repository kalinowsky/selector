export const getTsId = () => `${new Date().getTime()}`

const COLORS = ["#1ABAF0", "#8BF01A", "#F0871A", "#D21AF0", "#45859B"]
const MIN_CHANGE_DIFF = 30

export const getColorForIndex = (index: number) => {
  return COLORS[index % 5]
}

export const ensureSufficientSize = (x1: number, x2: number, y1: number, y2: number) => {
  const diffX = Math.abs(x1 - x2)
  const diffY = Math.abs(y1 - y2)
  return diffX > MIN_CHANGE_DIFF && diffY > MIN_CHANGE_DIFF
}
