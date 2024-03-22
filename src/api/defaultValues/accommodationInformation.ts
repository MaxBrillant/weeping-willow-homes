"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type returnedDefaultValuesType = Array<{
  accommodation_information: {
    id: number;
    guests: number;
    beds: number;
    bedrooms: number;
    private_bathrooms: number;
    shared_bathrooms: number;
  } | null;
}>;

type defaultValuesType = {
  accommodationId: number;
  numberOfGuests: number;
  numberOfBedrooms: number;
  numberOfBeds: number;
  numberOfPrivateBathrooms: number;
  numberOfSharedBathrooms: number;
};
export default async function getAccommodationInformationDefaultValues(
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
        "accommodation_information(id, guests, bedrooms, beds, private_bathrooms, shared_bathrooms), " +
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

  if (!data[0].accommodation_information) {
    return null;
  }

  const defaultValues: defaultValuesType = {
    accommodationId: data[0].accommodation_information.id,
    numberOfGuests: data[0].accommodation_information.guests,
    numberOfBedrooms: data[0].accommodation_information.bedrooms,
    numberOfBeds: data[0].accommodation_information.beds,
    numberOfPrivateBathrooms:
      data[0].accommodation_information.private_bathrooms,
    numberOfSharedBathrooms: data[0].accommodation_information.shared_bathrooms,
  };
  return defaultValues;
}
