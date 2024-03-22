"use server";
import {
  SupabaseClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type formDataType = {
  id: number | null;
  title: string;
  description: string;
  typeOfProperty: "house" | "apartment";
  propertySize: number | null;
};

type returnedDataType = Array<{
  id: number;
  title: string;
  description: string;
  type_of_property: "house" | "apartment";
  property_size: number | null;
}>;

export async function createOrUpdateHome(formData: formDataType) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  if (!formData.id) {
    const userId = (await supabase.auth.getUser()).data.user?.id;

    const userProfileId = await getUserProfileId(userId as string, supabase);

    const { data, error } = await supabase
      .from("homes")
      .insert({
        title: formData.title,
        type_of_property: formData.typeOfProperty,
        description: formData.description,
        property_size: formData.propertySize,
        host_id: userProfileId,
        status: "in-progress",
      })
      .select()
      .returns<returnedDataType>();

    if (error || !data) {
      console.log("Error while creating new home: " + error.message);
    }
    if (data) {
      console.log("Home of ID: " + data[0].id + " was successfully created");
      return data[0].id;
    }
  } else {
    const { error } = await supabase
      .from("homes")
      .update({
        title: formData.title,
        type_of_property: formData.typeOfProperty,
        description: formData.description,
        property_size: formData.propertySize,
      })
      .eq("id", formData.id);

    if (error) {
      console.log("Error while updating home: " + error.message);
    }
    console.log("Home of ID: " + formData.id + " was successfully updated");
  }
}

type userProfileIdType = Array<{
  id: number;
}>;
async function getUserProfileId(userId: string, supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("user_profile")
    .select("id, user_id")
    .eq("user_id", userId)
    .limit(1)
    .returns<userProfileIdType>();

  if (error || !data) {
    console.log("Error while fetching user profile: " + error.message);
  } else {
    return data[0].id;
  }
}
