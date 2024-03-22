"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type returnedDefaultValuesType = Array<{
  home_location: {
    id: number;
    city: "Nairobi, Kenya" | "Mombasa, Kenya";
    longitude: number;
    latitude: number;
    street_address: string;
    building_name: string;
  } | null;
}>;

type defaultValuesType = {
  locationId: number;
  city: "Nairobi, Kenya" | "Mombasa, Kenya";
  longitude: number;
  latitude: number;
  streetAddress: string;
  buildingName: string;
};
export default async function getLocationInformationDefaultValues(
  homeId: number
) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  const { data, error } = await supabase
    .from("homes")
    .select(
      "id, " +
        "home_location(id, city, longitude, latitude, street_address, building_name), " +
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
  if (!data[0].home_location) {
    return null;
  }
  const defaultValues: defaultValuesType = {
    locationId: data[0].home_location.id,
    city: data[0].home_location.city,
    longitude: data[0].home_location.longitude,
    latitude: data[0].home_location.latitude,
    streetAddress: data[0].home_location.street_address,
    buildingName: data[0].home_location.building_name,
  };
  return defaultValues;
}
