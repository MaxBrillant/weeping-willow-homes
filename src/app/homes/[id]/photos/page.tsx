import { getHomePhotos } from "@/api/fetch/fetchHomeDetails";
import BackButton from "@/app/components/backButton";
import Image from "next/image";
import Link from "next/link";

export default async function PhotoGallery({
  params,
}: {
  params: { id: number };
}) {
  const photos = await getHomePhotos(params.id);

  console.log(photos);

  if (photos == undefined) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-row gap-5 py-3 border-b-2">
          <BackButton />
          <p className="font-bold text-3xl">Photo gallery</p>
        </div>
        <p className="text-2xl font-medium">
          This home's photos are currently unavailable.
        </p>
      </div>
    );
  }

  const categories = [
    {
      name: "Living space",
      photos: photos.livingSpace,
    },
    {
      name: "Sleeping space",
      photos: photos.sleepingSpace,
    },
    {
      name: "Bathrooms",
      photos: photos.bathrooms,
    },
    {
      name: "Kitchen area",
      photos: photos.kitchen,
    },
    {
      name: "Building",
      photos: photos.building,
    },
    {
      name: "Outdoors",
      photos: photos.outdoors,
    },
    {
      name: "Additional photos",
      photos: photos.additional,
    },
  ];

  const getLastUrlSegment = (urlString: string): string => {
    const url = new URL(urlString, "https://example.com"); // Adding a dummy base URL for parsing
    const pathSegments = url.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment;
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row gap-5 py-3 border-b-2">
        <BackButton />
        <p className="font-bold text-3xl">Photo gallery</p>
      </div>
      <div className="flex flex-col gap-10 px-3 py-5">
        {categories.map((category, index) => {
          return (
            <div key={index} className="w-full space-y-1">
              <p className="font-semibold text-xl">{category.name}</p>
              <div className="grid grid-cols-3 gap-2 p-1">
                {!category.photos ? (
                  <p>No photos</p>
                ) : category.photos.length === 0 ? (
                  <p>No photos</p>
                ) : (
                  category.photos.map((photo, index) => {
                    return (
                      <Link
                        key={index}
                        href={
                          "/homes/" +
                          params.id +
                          "/photos/" +
                          getLastUrlSegment(photo)
                        }
                      >
                        <Image
                          className="w-full aspect-square object-cover rounded-sm"
                          src={photo}
                          width={500}
                          height={500}
                          alt="image"
                          loading="lazy"
                        />
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
