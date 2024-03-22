"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type returnedDefaultValuesType = Array<{
  id: number;
  title: string;
  type_of_property: "house" | "apartment";
  description: string;
  property_size: number | null;
}>;

type defaultValuesType = {
  id: number;
  title: string;
  typeOfProperty: "house" | "apartment";
  description: string;
  propertySize: number | null;
};
export default async function getHomeInformationDefaultValues(homeId: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  const { data, error } = await supabase
    .from("homes")
    .select(
      "id, " +
        "title, " +
        "user_profile!inner(user_id), " +
        "type_of_property, " +
        "description, " +
        "property_size"
    )
    .eq("user_profile.user_id", userId)
    .eq("id", homeId)
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
    id: data[0].id,
    title: data[0].title,
    typeOfProperty: data[0].type_of_property,
    description: data[0].description,
    propertySize: data[0].property_size,
  };
  return defaultValues;
}
