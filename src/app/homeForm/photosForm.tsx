import getPhotosDefaultValues from "@/api/defaultValues/photosForm";
import { addOrUpdatePhotos } from "@/api/mutations/photosMutations";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  homeId: number | null;
};

type defaultValuesType = {
  photosId: number;
};
export default function PhotosForm(form: formProps) {
  const [defaultValues, setDefaultValues] = useState<
    defaultValuesType | undefined
  >();
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<schema>({
    resolver: zodResolver(PhotosFormSchema),
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValue("additionalPhotos", []);
    const getDefaultValues = async () => {
      if (form.homeId) {
        setIsLoading(true);
        const values = await getPhotosDefaultValues(form.homeId);
        if (values) {
          setDefaultValues({
            photosId: values.photosId,
          });
          setValue("coverPhoto", values.coverPhotoUrl);
          setValue("sleepingSpacePhotos", values.sleepingSpace);
          setValue("livingSpacePhotos", values.livingSpace);
          setValue("bathroomPhotos", values.bathrooms);
          setValue("kitchenPhotos", values.kitchen);
          setValue("buildingPhotos", values.building);
          setValue("outdoorsPhotos", values.outdoors);
          setValue("additionalPhotos", values.additional);
        } else {
          setDefaultValues(undefined);
        }
        setIsLoading(false);
      } else {
        setDefaultValues(undefined);
        setIsLoading(false);
      }
    };
    getDefaultValues();
  }, [form.homeId]);

  const sleepingSpaceInputRef = useRef<HTMLInputElement>(null);
  const livingSpaceInputRef = useRef<HTMLInputElement>(null);
  const bathroomInputRef = useRef<HTMLInputElement>(null);
  const kitchenInputRef = useRef<HTMLInputElement>(null);
  const buildingInputRef = useRef<HTMLInputElement>(null);
  const outddorsInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);
  type newPhotosType = {
    files: File[];
    paths: string[];
  };
  const [newPhotos, setNewPhotos] = useState<newPhotosType>({
    files: [],
    paths: [],
  });
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);

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

  const onSubmit = async (data: schema) => {
    setIsSubmitting(true);
    const { files, paths } = newPhotos;

    console.log(photosToDelete);
    const formData = new FormData();
    const appendAllFiles = await Promise.all(
      files.map(async (file) => {
        formData.append("files", file);
      })
    );

    if (defaultValues == undefined) {
      await addOrUpdatePhotos({
        photosId: null,
        homeId: form.homeId as number,
        coverPhoto: data.coverPhoto,
        sleepingSpace: data.sleepingSpacePhotos,
        livingSpace: data.livingSpacePhotos,
        bathrooms: data.bathroomPhotos,
        kitchen: data.kitchenPhotos,
        building: data.buildingPhotos,
        outdoors: data.outdoorsPhotos,
        additional:
          data.additionalPhotos != undefined ? data.additionalPhotos : [],
        newPhotosFiles: formData,
        newPhotosPaths: paths,
        photosToDelete: photosToDelete,
      });
    } else {
      await addOrUpdatePhotos({
        photosId: defaultValues.photosId,
        homeId: form.homeId as number,
        coverPhoto: data.coverPhoto,
        sleepingSpace: data.sleepingSpacePhotos,
        livingSpace: data.livingSpacePhotos,
        bathrooms: data.bathroomPhotos,
        kitchen: data.kitchenPhotos,
        building: data.buildingPhotos,
        outdoors: data.outdoorsPhotos,
        additional:
          data.additionalPhotos != undefined ? data.additionalPhotos : [],
        newPhotosFiles: formData,
        newPhotosPaths: paths,
        photosToDelete: photosToDelete,
      });
    }
    form.submitFunctions.map((submitFunction: () => void) => {
      submitFunction();
    });
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-10 p-5"
    >
      {photoCategories.map((category, index) => {
        return (
          <div key={index} className="flex flex-col">
            <p className="font-semibold text-lg">{category.title}</p>
            <p>{category.description}</p>
            <div className="flex flex-wrap gap-2">
              {watch(category.validationString)?.map((photo, index) => {
                return (
                  <div key={index} id={String(index)} className="relative">
                    <Image
                      src={photo}
                      height={100}
                      width={100}
                      alt="photo"
                      loading="lazy"
                      className="aspect-square object-cover border border-black rounded-xl"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger className="absolute top-1 right-1 ">
                        <Button
                          variant={"secondary"}
                          size={"icon"}
                          className="w-6 h-6 opacity-90 rounded-full"
                        >
                          ...
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {index > 0 && (
                          <DropdownMenuItem
                            onClick={() => {
                              const newItems = [
                                ...watch(category.validationString),
                              ];
                              const item = newItems[index];
                              newItems[index] = newItems[index - 1];
                              newItems[index - 1] = item;
                              setValue(category.validationString, newItems);
                            }}
                          >
                            Move up
                          </DropdownMenuItem>
                        )}
                        {index <
                          watch(category.validationString)?.length - 1 && (
                          <DropdownMenuItem
                            onClick={() => {
                              const newItems = [
                                ...watch(category.validationString),
                              ];
                              const item = newItems[index];
                              newItems[index] = newItems[index + 1];
                              newItems[index + 1] = item;
                              setValue(category.validationString, newItems);
                            }}
                          >
                            Move down
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {photo !== watch("coverPhoto") && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              setValue("coverPhoto", photo);
                            }}
                          >
                            Make cover photo
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            watch("coverPhoto") === photo &&
                              setValue("coverPhoto", "");
                            setValue(
                              category.validationString,
                              watch(category.validationString)?.filter(
                                (photos) => photos !== photo
                              )
                            );

                            setNewPhotos((prevState) => ({
                              ...prevState,
                              files: prevState.files.filter(
                                (file, index) =>
                                  prevState.paths[index] !== photo
                              ),
                              paths: prevState.paths.filter(
                                (path) => path !== photo
                              ),
                            }));

                            if (photo.includes("supabase")) {
                              setPhotosToDelete(photosToDelete.concat(photo));
                            }
                          }}
                        >
                          Remove photo
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {photo === watch("coverPhoto") && (
                      <div className="absolute left-1 bottom-1 px-1 rounded-2xl bg-white opacity-90">
                        <p>Cover</p>
                      </div>
                    )}
                  </div>
                );
              })}
              <Input
                ref={category.ref}
                className="hidden"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    console.log(watch(category.validationString));
                    const filePaths = Array.from(e.target.files).map((file) =>
                      URL.createObjectURL(file)
                    );
                    watch(category.validationString) != undefined
                      ? setValue(category.validationString, [
                          ...(watch(category.validationString) as string[]),
                          ...filePaths,
                        ])
                      : setValue(category.validationString, [...filePaths]);

                    const files = Array.from(e.target.files).map(
                      (file) => file
                    );
                    const newFiles = [...newPhotos.files, ...files];
                    const newPaths = [...newPhotos.paths, ...filePaths];
                    setNewPhotos({ files: newFiles, paths: newPaths });
                  }
                }}
              />
              <Button
                variant={"secondary"}
                className=" border-2 border-black border-dashed font-bold text-3xl w-[100px] h-[100px]"
                disabled={
                  watch(category.validationString)?.length >= category.max
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
      {errors.coverPhoto && (
        <p className="text-red-500 font-semibold">
          {errors.coverPhoto.message}
        </p>
      )}
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
        <Button type="submit" disabled={isSubmitting}>
          Next
        </Button>
      </div>
    </form>
  );
}
