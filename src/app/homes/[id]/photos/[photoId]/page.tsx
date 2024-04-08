"use client";
import { useEffect, useState } from "react";
import { CarouselApi } from "@/components/ui/carousel";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import BackButton from "@/app/components/backButton";
import { getHomePhotos, homePhotosType } from "@/api/fetch/fetchHomeDetails";

export default function PhotoCarousel({
  params,
}: {
  params: { id: number; photoId: string };
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [photoData, setPhotoData] = useState<homePhotosType | undefined>(); // Initialize state for photo data

  useEffect(() => {
    // Fetch data inside useEffect
    const fetchData = async () => {
      const data = await getHomePhotos(params.id);
      setPhotoData(data); // Update state with fetched data
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (photoData == undefined) {
    return (
      <div className="flex flex-row gap-5 py-3 border-b-2">
        <BackButton />
        <p>This photo is currently unavailable.</p>
      </div>
    );
  }

  const getLastUrlSegment = (urlString: string): string => {
    const url = new URL(urlString, "https://example.com"); // Adding a dummy base URL for parsing
    const pathSegments = url.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment;
  };

  let photos: string[] = [];
  if (photoData.livingSpace) {
    photos = [...photos, ...photoData.livingSpace];
  }
  if (photoData.sleepingSpace) {
    photos = [...photos, ...photoData.sleepingSpace];
  }
  if (photoData.bathrooms) {
    photos = [...photos, ...photoData.bathrooms];
  }
  if (photoData.kitchen) {
    photos = [...photos, ...photoData.kitchen];
  }
  if (photoData.building) {
    photos = [...photos, ...photoData.building];
  }
  if (photoData.outdoors) {
    photos = [...photos, ...photoData.outdoors];
  }
  if (photoData.additional) {
    photos = [...photos, ...photoData.additional];
  }

  console.log(photos);

  return (
    <div className="flex flex-col h-screen border">
      <div className="py-3 border-b-2">
        <BackButton />
        <p className="absolute w-full top-4 font-semibold text-lg text-center">
          {current} / {photos.length}
        </p>
      </div>
      <Carousel
        setApi={setApi}
        opts={{
          startIndex: photos.findIndex(
            (photo) => getLastUrlSegment(photo) === params.photoId
          ),
        }}
        className="rounded-2xl overflow-clip"
      >
        <CarouselContent className="items-center">
          {photos.map((photo, index) => {
            return (
              <CarouselItem key={index}>
                <div className="flex h-[80vh]">
                  {
                    <Image
                      className="object-contain bg-gray-100 justify-center items-center"
                      src={photo}
                      alt="Listing image"
                      width={1000}
                      height={1000}
                      loading="lazy"
                    />
                  }
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-0 shadow-md shadow-gray-700" />
        <CarouselNext className="right-0 shadow-md shadow-gray-700" />
      </Carousel>
    </div>
  );
}
