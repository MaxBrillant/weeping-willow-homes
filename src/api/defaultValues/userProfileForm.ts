"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type returnedDefaultValuesType = Array<{
  full_name: string;
  city_address: string;
  phone_number: string;
  bio: string;
  languages: ("English" | "Swahili" | "French")[];
  profile_picture: string;
}>;

type defaultValuesType = {
  fullName: string;
  cityAddress: string;
  phoneNumber: string;
  bio: string;
  languages: ("English" | "Swahili" | "French")[];
  profilePicture: string;
};
export default async function getUserProfileDefaultValues() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  const { data, error } = await supabase
    .from("user_profile")
    .select(
      "id, " +
        "user_id, " +
        "full_name, " +
        "phone_number, " +
        "bio, " +
        "city_address, " +
        "languages, " +
        "profile_picture"
    )
    .eq("user_id", userId)
    .limit(1)
    .returns<returnedDefaultValuesType>();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data: " + error.message);
  }

  if (data.length === 0) {
    return null;
  }
  const defaultValues: defaultValuesType = {
    fullName: data[0].full_name,
    cityAddress: data[0].city_address,
    phoneNumber: data[0].phone_number,
    bio: data[0].bio,
    languages: data[0].languages,
    profilePicture: data[0].profile_picture,
  };
  return defaultValues;
}
