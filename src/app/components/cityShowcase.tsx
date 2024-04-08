"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

export default function CityShowcase() {
  const [api, setApi] = useState<CarouselApi>();

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

  useEffect(() => {
    console.log("done");
    const interval = setInterval(() => {
      api?.scrollNext();
    }, 3000); // Adjust the delay as needed

    return () => clearInterval(interval);
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
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
