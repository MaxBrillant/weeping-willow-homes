"use server";
import {
  SupabaseClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type formDataType = {
  houseRulesAndInformationId: number | null;
  homeId: number;
  eventsAllowed: boolean | null;
  petsAllowed: boolean | null;
  smokingAllowed: boolean | null;
  startOfQuietHours: string | null;
  endOfQuietHours: string | null;
  additionalRules: string | null;
  houseInformation: string | null;
};

type returnedDataType = Array<{
  id: number;
}>;

export async function addOrUpdateHouseRulesAndInformation(
  formData: formDataType
) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  if (!formData.houseRulesAndInformationId) {
    const { data, error } = await supabase
      .from("house_rules_and_information")
      .insert({
        events_allowed: formData.eventsAllowed,
        pets_allowed: formData.petsAllowed,
        smoking_allowed: formData.smokingAllowed,
        start_of_quiet_hours: formData.startOfQuietHours,
        end_of_quiet_hours: formData.endOfQuietHours,
        additional_rules: formData.additionalRules,
        house_information: formData.houseInformation,
      })
      .select()
      .returns<returnedDataType>();

    if (error || !data) {
      console.log(
        "Error while adding house rules and information: " + error.message
      );
    }
    if (data) {
      console.log(
        "House rules and information of ID: " +
          data[0].id +
          " was successfully created"
      );

      addHouseRulesAndInformationToHome(data[0].id, formData.homeId, supabase);
    }
  } else {
    const { error } = await supabase
      .from("house_rules_and_information")
      .update({
        events_allowed: formData.eventsAllowed,
        pets_allowed: formData.petsAllowed,
        smoking_allowed: formData.smokingAllowed,
        start_of_quiet_hours: formData.startOfQuietHours,
        end_of_quiet_hours: formData.endOfQuietHours,
        additional_rules: formData.additionalRules,
        house_information: formData.houseInformation,
      })
      .eq("id", formData.houseRulesAndInformationId);

    if (error) {
      console.log(
        "Error while updating house rules and information: " + error.message
      );
    }
    console.log(
      "House rules and information of ID: " +
        formData.houseRulesAndInformationId +
        " was successfully updated"
    );
  }
}

async function addHouseRulesAndInformationToHome(
  houseRulesAndInformationId: number,
  homeId: number,
  supabase: SupabaseClient
) {
  const { error } = await supabase
    .from("homes")
    .update({
      house_rules_and_information_id: houseRulesAndInformationId,
    })
    .eq("id", homeId);

  if (error) {
    console.log(
      "Error while adding house rules and information to the home: " +
        error.message
    );
  }
  console.log(
    "House rules and information of ID: " +
      houseRulesAndInformationId +
      " was successfully added to the home of ID: " +
      homeId
  );
}
