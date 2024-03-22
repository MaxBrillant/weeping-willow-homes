"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type returnedDefaultValuesType = Array<{
  house_rules_and_information: {
    id: number;
    events_allowed: boolean | null;
    pets_allowed: boolean | null;
    smoking_allowed: boolean | null;
    start_of_quiet_hours: string | null;
    end_of_quiet_hours: string | null;
    additional_rules: string | null;
    house_information: string | null;
  } | null;
}>;

type defaultValuesType = {
  houseRulesAndInformationId: number;
  eventsAllowed: boolean | null;
  petsAllowed: boolean | null;
  smokingAllowed: boolean | null;
  startOfQuietHours: string | null;
  endOfQuietHours: string | null;
  additionalRules: string | null;
  houseInformation: string | null;
};
export default async function getHouseRulesAndInformationDefaultValues(
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
        "house_rules_and_information(id, events_allowed, pets_allowed, smoking_allowed, start_of_quiet_hours, end_of_quiet_hours, additional_rules, house_information), " +
        "user_profile!inner(user_id)"
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

  if (!data[0].house_rules_and_information) {
    return null;
  }
  const defaultValues: defaultValuesType = {
    houseRulesAndInformationId: data[0].house_rules_and_information.id,
    eventsAllowed: data[0].house_rules_and_information.events_allowed,
    petsAllowed: data[0].house_rules_and_information.pets_allowed,
    smokingAllowed: data[0].house_rules_and_information.smoking_allowed,
    startOfQuietHours: data[0].house_rules_and_information.start_of_quiet_hours,
    endOfQuietHours: data[0].house_rules_and_information.end_of_quiet_hours,
    additionalRules: data[0].house_rules_and_information.additional_rules,
    houseInformation: data[0].house_rules_and_information.house_information,
  };
  return defaultValues;
}
