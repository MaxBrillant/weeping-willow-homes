"use server";
import {
  SupabaseClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { randomUUID } from "crypto";
import { cookies, headers } from "next/headers";

type formDataType = {
  photosId: number | null;
  homeId: number;
  coverPhoto: string;
  sleepingSpace: string[];
  livingSpace: string[];
  bathrooms: string[];
  kitchen: string[];
  building: string[];
  outdoors: string[];
  additional: string[];
  newPhotosFiles: FormData;
  newPhotosPaths: string[];
  photosToDelete: string[];
};

type returnedDataType = Array<{
  id: number;
  cover_photo: string;
  sleeping_space: string[];
  living_space: string[];
  bathrooms: string[];
  kitchen: string[];
  building: string[];
  outdoors: string[];
  additional: string[];
}>;

export async function addOrUpdatePhotos(formData: formDataType) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const files = formData.newPhotosFiles.getAll("files") as File[];
  const uploadPromises = await Promise.all(
    files.map(async (file, index) => {
      const fileToStorage = file;
      console.log(fileToStorage);

      const newFileName = randomUUID();
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

      const { data } = supabase.storage
        .from("home_photos")
        .getPublicUrl("public/" + newFileName);

      const fileUrl = data.publicUrl;

      formData.coverPhoto =
        formData.coverPhoto === formData.newPhotosPaths[index]
          ? fileUrl
          : formData.coverPhoto;
      formData.sleepingSpace = formData.sleepingSpace.map((photo) =>
        photo === formData.newPhotosPaths[index] ? fileUrl : photo
      );
      formData.livingSpace = formData.livingSpace.map((photo) =>
        photo === formData.newPhotosPaths[index] ? fileUrl : photo
      );
      formData.bathrooms = formData.bathrooms.map((photo) =>
        photo === formData.newPhotosPaths[index] ? fileUrl : photo
      );
      formData.kitchen = formData.kitchen.map((photo) =>
        photo === formData.newPhotosPaths[index] ? fileUrl : photo
      );
      formData.building = formData.building.map((photo) =>
        photo === formData.newPhotosPaths[index] ? fileUrl : photo
      );
      formData.outdoors = formData.outdoors.map((photo) =>
        photo === formData.newPhotosPaths[index] ? fileUrl : photo
      );
      formData.additional = formData.additional.map((photo) =>
        photo === formData.newPhotosPaths[index] ? fileUrl : photo
      );
    })
  );

  if (!formData.photosId) {
    const { data, error } = await supabase
      .from("home_photos")
      .insert({
        cover_photo: formData.coverPhoto,
        sleeping_space: formData.sleepingSpace,
        living_space: formData.livingSpace,
        bathrooms: formData.bathrooms,
        kitchen: formData.kitchen,
        building: formData.building,
        outdoors: formData.outdoors,
        additional: formData.additional,
      })
      .select()
      .returns<returnedDataType>();
    if (error || !data) {
      console.log("Error while adding photos: " + error.message);
    }
    if (data) {
      console.log("Photos of ID: " + data[0].id + " was successfully created");
      addPhotosInformationToHome(data[0].id, formData.homeId, supabase);
    }
  } else {
    const { error } = await supabase
      .from("home_photos")
      .update({
        cover_photo: formData.coverPhoto,
        sleeping_space: formData.sleepingSpace,
        living_space: formData.livingSpace,
        bathrooms: formData.bathrooms,
        kitchen: formData.kitchen,
        building: formData.building,
        outdoors: formData.outdoors,
        additional: formData.additional,
      })
      .eq("id", formData.photosId);
    if (error) {
      console.log("Error while updating photos: " + error.message);
    }
    console.log(
      "Photos of ID: " + formData.photosId + " was successfully updated"
    );
  }

  if (formData.photosToDelete.length > 0) {
    const { error } = await supabase.storage
      .from("home_photos")
      .remove(
        formData.photosToDelete.map(
          (photo) => "public/" + photo.split("/").pop()
        )
      );
    if (error) {
      console.log(error);
    }
  }
}

async function addPhotosInformationToHome(
  photosId: number,
  homeId: number,
  supabase: SupabaseClient
) {
  const { error } = await supabase
    .from("homes")
    .update({
      photos_id: photosId,
    })
    .eq("id", homeId);

  if (error) {
    console.log("Error while adding photos to the home: " + error.message);
  }
  console.log(
    "Photos of ID: " +
      photosId +
      " was successfully added to the home of ID: " +
      homeId
  );
}
