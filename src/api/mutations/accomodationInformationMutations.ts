"use server";
import {
  SupabaseClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type formDataType = {
  accommodationId: number | null;
  homeId: number;
  guests: number;
  bedrooms: number;
  beds: number;
  privateBathrooms: number;
  sharedBathrooms: number;
};

type returnedDataType = Array<{
  id: number;
  guests: number;
  beds: number;
  bedrooms: number;
  private_bathrooms: number;
  shared_bathrooms: number;
}>;

export async function addOrUpdateAccommodationInformation(
  formData: formDataType
) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  if (!formData.accommodationId) {
    const { data, error } = await supabase
      .from("accommodation_information")
      .insert({
        guests: formData.guests,
        beds: formData.beds,
        bedrooms: formData.bedrooms,
        private_bathrooms: formData.privateBathrooms,
        shared_bathrooms: formData.sharedBathrooms,
      })
      .select()
      .returns<returnedDataType>();

    if (error || !data) {
      console.log(
        "Error while adding accommodation information: " + error.message
      );
    }
    if (data) {
      console.log(
        "Accommodation information of ID: " +
          data[0].id +
          " was successfully created"
      );

      addAccommodationInformationToHome(data[0].id, formData.homeId, supabase);
    }
  } else {
    const { error } = await supabase
      .from("accommodation_information")
      .update({
        guests: formData.guests,
        beds: formData.beds,
        bedrooms: formData.bedrooms,
        private_bathrooms: formData.privateBathrooms,
        shared_bathrooms: formData.sharedBathrooms,
      })
      .eq("id", formData.accommodationId);

    if (error) {
      console.log(
        "Error while updating accommodation information: " + error.message
      );
    }
    console.log(
      "Accommodation information of ID: " +
        formData.accommodationId +
        " was successfully updated"
    );
  }
}

async function addAccommodationInformationToHome(
  accommodationId: number,
  homeId: number,
  supabase: SupabaseClient
) {
  const { error } = await supabase
    .from("homes")
    .update({
      accommodation_id: accommodationId,
    })
    .eq("id", homeId);

  if (error) {
    console.log(
      "Error while adding accommodation information to the home: " +
        error.message
    );
  }
  console.log(
    "Accommodation information of ID: " +
      accommodationId +
      " was successfully added to the home of ID: " +
      homeId
  );
}
