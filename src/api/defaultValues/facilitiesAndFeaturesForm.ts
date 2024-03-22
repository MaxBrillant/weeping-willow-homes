"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type returnedDefaultValuesType = Array<{
  id: string;
  title: string;
  description: string | null;
  icon_url: string;
  type: "facility" | "safety" | "feature";
  home_facilities_and_features: [
    {
      id: number | null;
    }
  ];
}>;

type defaultValuesType = Array<{
  id: string;
  title: string;
  description: string | null;
  iconUrl: string;
  type: "facility" | "safety" | "feature";
  homeFacilityAndFeatureId: number | null;
}>;
export default async function getFacilitiesAndFeaturesDefaultValues(
  homeId: number
) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  const { data, error } = await supabase
    .from("facilities_and_features")
    .select(
      "id, " +
        "title, " +
        "description, " +
        "icon_url, " +
        "type, " +
        "home_facilities_and_features!left(id, " +
        "homes!inner(id, user_profile!inner(user_id)))"
    )
    .eq("home_facilities_and_features.homes.user_profile.user_id", userId)
    .eq("home_facilities_and_features.homes.id", homeId)
    .limit(1, { referencedTable: "home_facilities_and_features.homes" })
    .returns<returnedDefaultValuesType>();

  if (error) {
    throw new Error("Failed to fetch data: " + error.message);
  }

  if (data.length === 0) {
    return null;
  }

  const defaultValues: defaultValuesType = [];

  data.map((facility) => {
    const newFacility = {
      id: facility.id,
      title: facility.title,
      description: facility.description,
      iconUrl: facility.icon_url,
      type: facility.type,
      homeFacilityAndFeatureId:
        facility.home_facilities_and_features.length > 0
          ? facility.home_facilities_and_features[0].id
          : null,
    };
    defaultValues.push(newFacility);
  });
  return defaultValues;
}
