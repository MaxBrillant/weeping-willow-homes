"use client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import HomeCarousel from "./homeCarousel";

export default function HomePhotos(props: { photos: string[] }) {
  const isDesktop = useMediaQuery("(min-width: 500px)");

  return !isDesktop ? (
    <HomeCarousel imageList={props.photos} />
  ) : (
    <div className="grid grid-cols-3 items-center gap-2">
      {props.photos.map((image, index) => {
        return (
          <Image
            key={index}
            className="w-full aspect-[3/2] object-cover rounded-md"
            src={image}
            width={200}
            height={200}
            alt="image"
          />
        );
      })}

      <Button variant={"secondary"} className="w-full h-full flex flex-col">
        <Image src={"/search.svg"} width={70} height={70} alt="icon" />
        See all photos
      </Button>
    </div>
  );
}
