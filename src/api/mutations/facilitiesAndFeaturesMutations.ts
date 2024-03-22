"use server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type formDataType = {
  homeId: number;
  newFacilities: string[];
  facilitiesToDelete: string[];
};

type returnedDataType = Array<{
  id: number;
}>;

export async function addOrUpdateFacilitiesAndFeatures(formData: formDataType) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  if (formData.newFacilities.length > 0) {
    const { data, error } = await supabase
      .from("home_facilities_and_features")
      .insert(
        formData.newFacilities.map((id) => {
          return { facility_and_feature_id: id, home_id: formData.homeId };
        })
      )
      .select()
      .returns<returnedDataType>();

    if (error || !data) {
      console.log(
        "Error while allocating facilities and features to home of ID: " +
          formData.homeId +
          error.message
      );
    }
    if (data) {
      console.log(
        "Facilities and features were successfully allocated to home of ID: " +
          formData.homeId
      );
    }
  }

  if (formData.facilitiesToDelete.length > 0) {
    await supabase
      .from("home_facilities_and_features")
      .delete()
      .eq("home_id", formData.homeId)
      .in("facility_and_feature_id", formData.facilitiesToDelete);
  }
}
