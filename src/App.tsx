import "./App.css"
import { Selector } from "./components/Selector"
import { Shelf } from "./components/Selector/types"

const IMAGE_URL =
  "https://hips.hearstapps.com/hmg-prod/images/beautiful-smooth-haired-red-cat-lies-on-the-sofa-royalty-free-image-1678488026.jpg?crop=0.88847xw:1xh;center,top&resize=1200:*"

const INITIAL_SHALVES: Shelf[] = [
  {
    id: "1",
    position: [
      { x: 10, y: 10, id: "1" },
      { x: 100, y: 10, id: "2" },
      { x: 100, y: 100, id: "3" },
      { x: 10, y: 100, id: "4" },
    ],
  },
  {
    id: "2",
    position: [
      { x: 300, y: 300, id: "1" },
      { x: 600, y: 250, id: "2" },
      { x: 550, y: 550, id: "3" },
      { x: 300, y: 500, id: "4" },
    ],
  },
]

const App = () => {
  return (
    <Selector
      imageUrl={IMAGE_URL}
      shelves={INITIAL_SHALVES}
      onChange={(onChangeValue) => {
        console.log({ onChangeValue })
      }}
    />
  )
}

export default App
