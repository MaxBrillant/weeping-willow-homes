"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type returnedDefaultValuesType = Array<{
  home_photos: {
    id: number;
    cover_photo: string;
    sleeping_space: string[];
    living_space: string[];
    bathrooms: string[];
    kitchen: string[];
    building: string[];
    outdoors: string[];
    additional: string[];
  };
}>;

type defaultValuesType = {
  photosId: number;
  coverPhotoUrl: string;
  sleepingSpace: string[];
  livingSpace: string[];
  bathrooms: string[];
  kitchen: string[];
  building: string[];
  outdoors: string[];
  additional: string[];
};
export default async function getPhotosDefaultValues(homeId: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  const { data, error } = await supabase
    .from("homes")
    .select(
      "id, " +
        "home_photos(id, cover_photo, sleeping_space, living_space, kitchen, bathrooms, building, outdoors, additional), " +
        "user_profile!inner(user_id)"
    )
    .eq("user_profile.user_id", userId)
    .eq("id", homeId)
    .limit(1)
    .returns<returnedDefaultValuesType>();

  if (error) {
    throw new Error("Failed to fetch data: " + error.message);
  }

  if (data.length === 0) {
    return null;
  }
  if (!data[0].home_photos) {
    return null;
  }
  const defaultValues: defaultValuesType = {
    photosId: data[0].home_photos.id,
    coverPhotoUrl: data[0].home_photos.cover_photo,
    sleepingSpace: data[0].home_photos.sleeping_space,
    livingSpace: data[0].home_photos.living_space,
    bathrooms: data[0].home_photos.bathrooms,
    kitchen: data[0].home_photos.kitchen,
    building: data[0].home_photos.building,
    outdoors: data[0].home_photos.outdoors,
    additional: data[0].home_photos.additional,
  };
  return defaultValues;
}
