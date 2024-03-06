"use client";
import { CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type homeCarouselProps = {
  imageList: Array<string>;
};

export default function HomeCarousel(images: homeCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex flex-col max-w-[640px]">
      <Carousel
        setApi={setApi}
        className="w-full rounded-2xl overflow-clip border border-gray-300"
      >
        <CarouselContent>
          {Array.from({ length: images.imageList.length }).map((_, index) => (
            <CarouselItem key={index}>
              {
                <Image
                  className="w-full aspect-[3/2] object-cover bg-gray-500 justify-center items-center"
                  src={images.imageList[index]}
                  alt="Listing image"
                  width={200}
                  height={200}
                  loading="lazy"
                />
              }
            </CarouselItem>
          ))}

          <CarouselItem className="flex justify-center items-center">
            <Button variant={"secondary"} className="flex flex-col w-2/4 h-2/4">
              <Image src={"/search.svg"} width={70} height={70} alt="icon" />
              See all photos
            </Button>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="left-0 shadow-md shadow-gray-700" />
        <CarouselNext className="right-0 shadow-md shadow-gray-700" />
      </Carousel>
      <div className="text-center text-sm">
        {current}/{count}
      </div>
    </div>
  );
}
