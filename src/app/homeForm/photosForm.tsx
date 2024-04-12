"use client";
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
import { Separator } from "@/components/ui/separator";
import { PhotosFormSchema } from "@/validation/newHomeValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { FiMoreVertical } from "react-icons/fi";
import Loading from "../loading";
import Compressor from "compressorjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { randomUUID } from "crypto";

type schema = z.infer<typeof PhotosFormSchema>;

type formProps = {
  backFunctions: (() => void | undefined)[];
  submitFunctions: (() => void | undefined)[];
  homeId: number | null;
  saveAndExit?: boolean;
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
    trigger,
    formState: { errors },
  } = useForm<schema>({
    resolver: zodResolver(PhotosFormSchema),
    mode: "onChange",
  });

  const { push } = useRouter();

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

  function compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6, // Adjust the desired image quality (0.0 - 1.0)
        // maxWidth: 700, // Adjust the maximum width of the compressed image
        // maxHeight: 700, // Adjust the maximum height of the compressed image
        success: (result) => {
          resolve(new File([result], file.name, { type: result.type }));
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  async function compressFiles(files: File[]): Promise<File[]> {
    const compressedFiles: File[] = [];
    for (const file of files) {
      const compressedFile = await compressImage(file);
      compressedFiles.push(compressedFile);
    }
    return compressedFiles;
  }

  const onSubmit = async (data: schema) => {
    setIsSubmitting(true);
    const supabase = createClientComponentClient();
    const { files, paths } = newPhotos;

    console.log(photosToDelete);
    const formData = new FormData();
    const uploadFiles = await Promise.all(
      files.map(async (file, index) => {
        const { v4: uuidv4 } = require("uuid");
        const newFileName = uuidv4();

        const fileToStorage = file;
        console.log(fileToStorage);

        // Upload the file to Supabase Storage
        const { error } = await supabase.storage
          .from("home_photos")
          .upload("public/" + newFileName, fileToStorage, {
            contentType: fileToStorage.type, // Adjust based on the file type
            cacheControl: "36000",
          });

        if (error) {
          console.log(
            "Error while uploading photo " +
              fileToStorage.name +
              ": " +
              error.message
          );
        }

        const fileUrl =
          "https://dxtymkfjqltlvlpxcmia.supabase.co/storage/v1/object/public/home_photos/public/" +
          newFileName;

        data.coverPhoto =
          data.coverPhoto === paths[index] ? fileUrl : data.coverPhoto;
        data.sleepingSpacePhotos = data.sleepingSpacePhotos.map((photo) =>
          photo === paths[index] ? fileUrl : photo
        );
        data.livingSpacePhotos = data.livingSpacePhotos.map((photo) =>
          photo === paths[index] ? fileUrl : photo
        );
        data.bathroomPhotos = data.bathroomPhotos.map((photo) =>
          photo === paths[index] ? fileUrl : photo
        );
        data.kitchenPhotos = data.kitchenPhotos.map((photo) =>
          photo === paths[index] ? fileUrl : photo
        );
        data.buildingPhotos = data.buildingPhotos.map((photo) =>
          photo === paths[index] ? fileUrl : photo
        );
        data.outdoorsPhotos = data.outdoorsPhotos.map((photo) =>
          photo === paths[index] ? fileUrl : photo
        );
        data.additionalPhotos = data.additionalPhotos.map((photo) =>
          photo === paths[index] ? fileUrl : photo
        );
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
        photosToDelete: photosToDelete,
      });
    }
    form.submitFunctions.map((submitFunction: () => void) => {
      submitFunction();
    });
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 p-7">
      <p className="font-medium text-center bg-yellow-100 border border-yellow-600 p-3 rounded-2xl">
        Only JPG, PNG and WEBP image formats are supported
      </p>
      {photoCategories.map((category, index) => {
        return (
          <div key={index} className="flex flex-col gap-3">
            <p className="font-bold text-lg">{category.title}</p>
            <p className="font-normal text-sm">{category.description}</p>
            <div className="grid grid-cols-3 gap-2 items-center">
              {watch(category.validationString)?.map((photo, index) => {
                return (
                  <div key={index} id={String(index)} className="relative">
                    <Image
                      src={photo}
                      height={100}
                      width={100}
                      alt="photo"
                      loading="lazy"
                      className="w-full aspect-[4/3] object-cover rounded-xl"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger className="absolute top-1 right-1 ">
                        <button className="flex flex-col p-1 items-center justify-center bg-white opacity-90 rounded-full border border-slate-500">
                          <FiMoreVertical className="w-4 h-4 items-center" />
                        </button>
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
                          className="focus:bg-red-400 focus:font-semibold"
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
                    const acceptedFiles = Array.from(e.target.files).filter(
                      (file) => {
                        // Check if the file type is an image
                        return (
                          file.type === "image/jpeg" ||
                          file.type === "image/jpg" ||
                          file.type === "image/png" ||
                          file.type === "image/webp"
                        );
                      }
                    );
                    const handleCompress = async () => {
                      const compressedFiles = await compressFiles(
                        acceptedFiles as File[]
                      );

                      console.log(watch(category.validationString));
                      const filePaths = compressedFiles.map((file) =>
                        URL.createObjectURL(file)
                      );
                      watch(category.validationString) != undefined
                        ? setValue(category.validationString, [
                            ...(watch(category.validationString) as string[]),
                            ...filePaths,
                          ])
                        : setValue(category.validationString, [...filePaths]);

                      const newFiles = [...newPhotos.files, ...compressedFiles];
                      const newPaths = [...newPhotos.paths, ...filePaths];
                      setNewPhotos({ files: newFiles, paths: newPaths });
                    };

                    if (acceptedFiles.length > 0) {
                      handleCompress();
                    } else {
                      alert(
                        "Image format not supported. Select JPG, PNG or WEBP images."
                      );
                    }
                  }
                }}
              />
              <Button
                variant={
                  watch(category.validationString)?.length > 0
                    ? "secondary"
                    : "default"
                }
                size={
                  watch(category.validationString)?.length > 0
                    ? "icon"
                    : "default"
                }
                className={
                  watch(category.validationString)?.length > 0
                    ? "border border-black font-light text-5xl w-20 h-20"
                    : "w-fit"
                }
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
                {watch(category.validationString)?.length > 0 ? (
                  <p>+</p>
                ) : (
                  <p>Add photos</p>
                )}
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
            {index < photoCategories.length - 1 && (
              <Separator className="mt-7" />
            )}
          </div>
        );
      })}
      {errors.coverPhoto && (
        <p className="text-red-500 font-semibold">
          {errors.coverPhoto.message}: To select a cover photo, click on the
          top-right (three dots) of a photo, then click on{" "}
          {`"Make cover photo"`}
        </p>
      )}
      <div className="w-full flex flex-wrap gap-3 justify-end p-3">
        {(form.saveAndExit || form.saveAndExit == undefined) && (
          <Button
            variant={"outline"}
            disabled={isSubmitting}
            onClick={async () => {
              const isFormValid = await trigger();
              if (isFormValid) {
                setTimeout(() => {
                  push("/hosting");
                }, 100);
              }
            }}
          >
            Save & exit
          </Button>
        )}
        {form.backFunctions.length > 0 && (
          <Button
            variant={"link"}
            onClick={() =>
              form.backFunctions.map((backFunction: () => void) => {
                backFunction();
              })
            }
          >
            Back
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          Save and continue
        </Button>
      </div>
      {Object.keys(errors).length > 0 && (
        <p className="text-red-500 font-medium animate-pulse mt-[-2rem] mx-auto">
          Provide all the required photos to proceed
        </p>
      )}
    </form>
  );
}
