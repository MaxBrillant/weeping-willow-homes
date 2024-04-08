"use server";
import {
  SupabaseClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type formDataType = {
  locationId: number | null;
  homeId: number;
  city:
    | "Nairobi, Kenya"
    | "Mombasa, Kenya"
    | "Kisumu, Kenya"
    | "Nakuru, Kenya"
    | "Nanyuki, Kenya"
    | "Naivasha, Kenya"
    | "Eldoret, Kenya"
    | "Malindi, Kenya"
    | "Tsavo, Kenya"
    | "Watamu, Kenya"
    | "Maasai Mara, Kenya";
  longitude: number;
  latitude: number;
  streetAddress: string;
  buildingName: string;
};

type returnedDataType = Array<{
  id: number;
  city:
    | "Nairobi, Kenya"
    | "Mombasa, Kenya"
    | "Kisumu, Kenya"
    | "Nakuru, Kenya"
    | "Nanyuki, Kenya"
    | "Naivasha, Kenya"
    | "Eldoret, Kenya"
    | "Malindi, Kenya"
    | "Tsavo, Kenya"
    | "Watamu, Kenya"
    | "Maasai Mara, Kenya";
  longitude: number;
  latitude: number;
  street_address: string;
  building_name: string;
}>;

export async function addOrUpdateLocationInformation(formData: formDataType) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  if (!formData.locationId) {
    const { data, error } = await supabase
      .from("home_location")
      .insert({
        city: formData.city,
        longitude: formData.longitude,
        latitude: formData.latitude,
        street_address: formData.streetAddress,
        building_name: formData.buildingName,
      })
      .select()
      .returns<returnedDataType>();

    if (error || !data) {
      console.log("Error while adding location information: " + error.message);
    }
    if (data) {
      console.log(
        "Location information of ID: " +
          data[0].id +
          " was successfully created"
      );

      addLocationInformationToHome(data[0].id, formData.homeId, supabase);
    }
  } else {
    const { error } = await supabase
      .from("home_location")
      .update({
        city: formData.city,
        longitude: formData.longitude,
        latitude: formData.latitude,
        street_address: formData.streetAddress,
        building_name: formData.buildingName,
      })
      .eq("id", formData.locationId);

    if (error) {
      console.log(
        "Error while updating location information: " + error.message
      );
    }
    console.log(
      "Location information of ID: " +
        formData.locationId +
        " was successfully updated"
    );
  }
}

async function addLocationInformationToHome(
  locationId: number,
  homeId: number,
  supabase: SupabaseClient
) {
  const { error } = await supabase
    .from("homes")
    .update({
      location_id: locationId,
    })
    .eq("id", homeId);

  if (error) {
    console.log(
      "Error while adding location information to the home: " + error.message
    );
  }
  console.log(
    "Location information of ID: " +
      locationId +
      " was successfully added to the home of ID: " +
      homeId
  );
}
