import { Image } from "react-konva"
import useImage from "use-image"

export const Img = ({ url }: { url: string }) => {
  const [image] = useImage(url)
  return <Image image={image} />
}
