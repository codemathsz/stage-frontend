import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Photo1, Photo2, Photo3, Photo4, Photo5 } from "@/assets/carousel"
import Autoplay from "embla-carousel-autoplay"

export function CarouselComponent() {
  const [api, setApi] = React.useState<CarouselApi>()
  const photos = [
    {name: 'photo 1', url: Photo1},
    {name: 'photo 2', url: Photo2},
    {name: 'photo 3', url: Photo3},
    {name: 'photo 4', url: Photo4},
    {name: 'photo 5', url: Photo5},
  ]

  React.useEffect(() => {
    if (!api) {
      return
    }
 
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )
  return (
    <div className="w-full h-[28rem]">
      <Carousel plugins={[plugin.current]} opts={{loop: true}} className="w-full h-auto max-h-[36rem]">
        <CarouselContent className="w-full h-auto max-h-[36rem]">
          {photos.map((photo, index) => (
            <CarouselItem key={index}>
              <div className="w-full p-1">
                <Card className="w-full h-[32rem]">
                  <CardContent className="w-full h-auto max-h-[36rem] flex items-center justify-center !p-0">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
