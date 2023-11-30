export const getTsId = () => `${new Date().getTime()}`

const COLORS = ["#1ABAF0", "#8BF01A", "#F0871A", "#D21AF0", "#45859B"]
export const getColorForIndex = (index: number) => {
  return COLORS[index % 5]
}
