import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhotosFormSchema } from "@/validation/newHomeValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type schema = z.infer<typeof PhotosFormSchema>;

type formProps = {
  backFunctions: (() => void | undefined)[];
  submitFunctions: (() => void | undefined)[];
};
export default function PhotosForm(form: formProps) {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<schema>({
    resolver: zodResolver(PhotosFormSchema),
    mode: "onChange",
  });

  // const[sleepingSpacePhotos, setSleepingSpacePhotos] = useState<string[]>([])

  const sleepingSpaceInputRef = useRef<HTMLInputElement>(null);
  const livingSpaceInputRef = useRef<HTMLInputElement>(null);
  const bathroomInputRef = useRef<HTMLInputElement>(null);
  const kitchenInputRef = useRef<HTMLInputElement>(null);
  const buildingInputRef = useRef<HTMLInputElement>(null);
  const outddorsInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);

  type tCategory = {
    title: string;
    description: string;
    validationString:
      | "sleepingSpacePhotos"
      | "livingSpacePhotos"
      | "bathroomPhotos"
      | "kitchenPhotos"
      | "buildingPhotos"
      | "outdoorsPhotos"
      | "additionalPhotos";
    ref: React.RefObject<HTMLInputElement>;
    min: number;
    max: number;
  };
  let photoCategories: tCategory[] = [
    {
      title: "Sleeping space",
      description: "Upload images that showcase the bedrooms within your home.",
      validationString: "sleepingSpacePhotos",
      ref: sleepingSpaceInputRef,
      min: 2,
      max: 5,
    },
    {
      title: "Living space",
      description:
        "Share images that highlight the living room or common areas within your accommodation.",
      validationString: "livingSpacePhotos",
      ref: livingSpaceInputRef,
      min: 2,
      max: 5,
    },
    {
      title: "Bathroom",
      description:
        "Include images that depict the bathrooms in your property. Guests are interested in the cleanliness, amenities, and layout of the bathrooms.",
      validationString: "bathroomPhotos",
      ref: bathroomInputRef,
      min: 2,
      max: 5,
    },
    {
      title: "Kitchen",
      description:
        "Display pictures of the kitchen space. Show the layout, appliances, and amenities available for cooking and food preparation.",
      validationString: "kitchenPhotos",
      ref: kitchenInputRef,
      min: 2,
      max: 5,
    },
    {
      title: "Building",
      description:
        "Upload pictures of the exterior and common areas of the building or complex where your accommodation is located.",
      validationString: "buildingPhotos",
      ref: buildingInputRef,
      min: 1,
      max: 5,
    },
    {
      title: "Outdoors",
      description:
        "Share images of the outdoor spaces associated with your property. This may include gardens, balconies, rooftops, or other outdoor areas where guests can relax or enjoy the surroundings.",
      validationString: "outdoorsPhotos",
      ref: outddorsInputRef,
      min: 1,
      max: 5,
    },
    {
      title: "Additional photos",
      description:
        "For any additional spaces or unique features that don't fall into the above categories, use this section to provide images that highlight these specific areas.",
      validationString: "additionalPhotos",
      ref: additionalInputRef,
      min: 0,
      max: 5,
    },
  ];

  useEffect(() => {
    photoCategories.map((category) => {
      setValue(category.validationString, []);
    });
  }),
    [photoCategories];

  const onSubmit = (data: schema) => {
    //MAKE SURE THE COVER pPHOTO IS THERE. ADD ITS FUNCTIONALITY
    console.log(data);
    form.submitFunctions.map((submitFunction: () => void) => {
      submitFunction();
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-10 p-5"
    >
      {photoCategories.map((category) => {
        return (
          <div className="flex flex-col">
            <p className="font-semibold text-lg">{category.title}</p>
            <p>{category.description}</p>
            <div className="flex flex-wrap gap-2">
              {watch(category.validationString)?.map((photo, index) => {
                return (
                  <div id={String(index)} className="relative">
                    <Image
                      src={photo}
                      height={100}
                      width={100}
                      alt="photo"
                      className="aspect-square object-cover border border-black rounded-xl"
                    />
                    <Button
                      variant={"secondary"}
                      size={"icon"}
                      className="absolute top-1 right-1 w-6 h-6 opacity-90 rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        setValue("coverPhoto", "/home1.webp");
                        setValue(
                          category.validationString,
                          watch(category.validationString).filter(
                            (photos) => photos !== photo
                          )
                        );
                      }}
                    >
                      X
                    </Button>
                  </div>
                );
              })}
              <Input
                ref={category.ref}
                className="hidden"
                type="file"
                accept=".jpg,.jpeg,.png"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const filePaths = Array.from(e.target.files).map((file) =>
                      URL.createObjectURL(file)
                    );
                    watch(category.validationString) != undefined
                      ? setValue(category.validationString, [
                          ...watch(category.validationString),
                          ...filePaths,
                        ])
                      : setValue(category.validationString, [...filePaths]);
                  }
                }}
              />
              <Button
                variant={"secondary"}
                className=" border-2 border-black border-dashed font-bold text-3xl w-[100px] h-[100px]"
                disabled={
                  watch(category.validationString)?.length > category.max
                }
                onClick={(e) => {
                  e.preventDefault();
                  if (category.ref.current) {
                    category.ref.current.click();
                  }
                }}
              >
                +
              </Button>
            </div>
            <p>
              Min: {category.min} photos, Max: {category.max} photos
            </p>
            {category.validationString === "sleepingSpacePhotos" &&
              errors.sleepingSpacePhotos && (
                <p className="text-red-500 font-semibold">
                  {errors.sleepingSpacePhotos.message}
                </p>
              )}
            {category.validationString === "livingSpacePhotos" &&
              errors.livingSpacePhotos && (
                <p className="text-red-500 font-semibold">
                  {errors.livingSpacePhotos.message}
                </p>
              )}
            {category.validationString === "bathroomPhotos" &&
              errors.bathroomPhotos && (
                <p className="text-red-500 font-semibold">
                  {errors.bathroomPhotos.message}
                </p>
              )}
            {category.validationString === "kitchenPhotos" &&
              errors.kitchenPhotos && (
                <p className="text-red-500 font-semibold">
                  {errors.kitchenPhotos.message}
                </p>
              )}
            {category.validationString === "buildingPhotos" &&
              errors.buildingPhotos && (
                <p className="text-red-500 font-semibold">
                  {errors.buildingPhotos.message}
                </p>
              )}
            {category.validationString === "outdoorsPhotos" &&
              errors.outdoorsPhotos && (
                <p className="text-red-500 font-semibold">
                  {errors.outdoorsPhotos.message}
                </p>
              )}
            {category.validationString === "additionalPhotos" &&
              errors.additionalPhotos && (
                <p className="text-red-500 font-semibold">
                  {errors.additionalPhotos.message}
                </p>
              )}
          </div>
        );
      })}
      <div className="w-full flex flex-row gap-3 justify-end p-3">
        <Button
          variant={"outline"}
          onClick={() =>
            form.backFunctions.map((backFunction: () => void) => {
              backFunction();
            })
          }
        >
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
