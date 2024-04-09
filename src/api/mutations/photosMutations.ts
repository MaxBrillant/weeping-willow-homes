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
