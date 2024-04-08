"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

export default function CityShowcase() {
  const cities = [
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Maasai Mara",
    "Nanyuki",
    "Naivasha",
    "Eldoret",
    "Malindi",
    "Tsavo",
    "Watamu",
  ];

  const plugin = useRef(Autoplay({ duration: 1000 }));

  return (
    <Carousel
      plugins={[plugin.current]}
      orientation="vertical"
      opts={{
        align: "start",
        loop: true,
        watchDrag: false,
      }}
      className="overflow-clip"
    >
      <CarouselContent className="mt-1 sm:mt-3 h-20 sm:h-24 flex items-center text-center">
        {cities.map((city) => {
          return (
            <CarouselItem
              key={city}
              className="basis-full font-bold text-4xl sm:text-5xl"
            >
              {city}
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
