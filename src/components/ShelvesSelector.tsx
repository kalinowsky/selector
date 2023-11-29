import React, { useEffect, useRef, useState } from "react"

type Shelf = {
  x1: number
  x2: number
  y1: number
  y2: number
}

const drawShelf = (context: CanvasRenderingContext2D, s: Shelf) => {
  context.strokeStyle = "rgba(0, 0, 0, 0.7)"
  context.fillStyle = "rgba(0, 0, 0, 0.7)"
  context.setLineDash([5])
  context.lineDashOffset = 0
  // console.log("draw", s.x1, s.y1, s.x2 - s.x1, s.y2 - s.y1)
  // console.log("DRAW", { s, calculated: { w: s.x2 - s.x1, y: s.y2 - s.y1 } })
  context.strokeRect(s.x1, s.y1, s.x2 - s.x1, s.y2 - s.y1)
  // context.fillRect(s.x1, s.y1, s.x2 - s.x1, s.y2 - s.y1)
}

// draw polygon
// var ctx = canvas.getContext('2d');
// ctx.fillStyle = '#f00';
// ctx.beginPath();
// ctx.moveTo(0, 0);
// ctx.lineTo(100,50);
// ctx.lineTo(50, 100);
// ctx.lineTo(0, 90);
// ctx.closePath();
// ctx.fill();

const drawShelves = (context: CanvasRenderingContext2D, shelves: Shelf[]) => {
  context.strokeStyle = "red"
  context.setLineDash([5])
  context.lineDashOffset = 0
  shelves.forEach((s) => drawShelf(context, s))
}

const ShelvesSelector: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef<boolean>(false)
  const startXRef = useRef<number>(0)
  const startYRef = useRef<number>(0)
  const [shelves, setShelves] = useState<Shelf[]>([])
  console.log({ shelves })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    const image = new Image()
    image.src = imageUrl

    image.onload = () => {
      canvas.width = image.width
      canvas.height = image.height
      context.drawImage(image, 0, 0)
      drawShelves(context, shelves)
    }

    const handleMouseDown = (e: MouseEvent) => {
      isDrawingRef.current = true
      startXRef.current = e.clientX - (canvas.offsetLeft || 0)
      startYRef.current = e.clientY - (canvas.offsetTop || 0)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawingRef.current) return

      const currentX = e.clientX - (canvas.offsetLeft || 0)
      const currentY = e.clientY - (canvas.offsetTop || 0)

      const width = currentX - startXRef.current
      const height = currentY - startYRef.current

      // console.log({ currentX, currentY, width, height, startXRef, startYRef })

      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height)

        context.drawImage(image, 0, 0)
        drawShelves(context, shelves)
        context.strokeRect(startXRef.current, startYRef.current, width, height)
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      const currentX = e.clientX - (canvas.offsetLeft || 0)
      const currentY = e.clientY - (canvas.offsetTop || 0)

      const newShelf: Shelf = {
        x1: startXRef.current,
        y1: startYRef.current,
        x2: currentX,
        y2: currentY,
      }
      setShelves((shelves) => [...shelves, newShelf])
      isDrawingRef.current = false

      // if up < 100ms it was a click
      // if it was a click we can check collisions
      // if collision detected we can make shelf active to edit
      // if collision not detect we can inactivate selected shelf
      //
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseup", handleMouseUp)
    }
  }, [imageUrl, shelves])

  return <canvas ref={canvasRef} />
}

export default ShelvesSelector
