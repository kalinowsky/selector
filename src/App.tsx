import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import ShelvesSelector from "./components/ShelvesSelector"
import ShelvesSelector2 from "./components/ShelvesSelector2"

function App() {
  return (
    // <ShelvesSelector imageUrl="https://hips.hearstapps.com/hmg-prod/images/beautiful-smooth-haired-red-cat-lies-on-the-sofa-royalty-free-image-1678488026.jpg?crop=0.88847xw:1xh;center,top&resize=1200:*" />
    <ShelvesSelector2 imageUrl="https://hips.hearstapps.com/hmg-prod/images/beautiful-smooth-haired-red-cat-lies-on-the-sofa-royalty-free-image-1678488026.jpg?crop=0.88847xw:1xh;center,top&resize=1200:*" />
  )
}

export default App
