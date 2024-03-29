"use server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";

type formDataType = {
  fullName: string;
  cityAddress: string;
  phoneNumber: string;
  emailAddress: string;
  bio: string;
  languages: ("English" | "Swahili" | "French")[];
  profilePicture: string;
  newProfilePicture: FormData | undefined;
  profilePictureToDelete: string | null;
};

type returnedDataType = Array<{
  id: number;
}>;

export async function CreateOrUpdateUserProfile(formData: formDataType) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  if (formData.newProfilePicture != undefined) {
    const files = formData.newProfilePicture.getAll("files") as File[];
    const uploadPromises = await Promise.all(
      files.map(async (file, index) => {
        const fileToStorage = file;
        console.log(fileToStorage);

        const newFileName = randomUUID();
        // Upload the file to Supabase Storage
        const { error } = await supabase.storage
          .from("user_profile_pictures")
          .upload("public/" + newFileName, fileToStorage, {
            contentType: fileToStorage.type, // Adjust based on the file type
            cacheControl: "36000",
          });

        if (error) {
          console.log(
            "Error while uploading photo " +
              fileToStorage.name +
              ": " +
              error.message
          );
        }

        const { data } = supabase.storage
          .from("user_profile_pictures")
          .getPublicUrl("public/" + newFileName);

        const fileUrl = data.publicUrl;
        formData.profilePicture = fileUrl;
      })
    );
  }

  const userId = (await supabase.auth.getUser()).data.user?.id;

  const { data, error } = await supabase
    .from("user_profile")
    .upsert(
      {
        user_id: userId,
        full_name: formData.fullName,
        city_address: formData.cityAddress,
        phone_number: formData.phoneNumber,
        email_address: formData.emailAddress,
        bio: formData.bio,
        languages: formData.languages,
        profile_picture: formData.profilePicture,
        is_identity_verified: false,
      },
      { onConflict: "user_id" }
    )
    .select()
    .returns<returnedDataType>();

  if (error || !data) {
    console.log("Error while updating user profile: " + error.message);
  }
  if (data) {
    console.log(
      "User profile of ID: " + data[0].id + " was successfully updated"
    );
  }

  if (formData.profilePictureToDelete) {
    const { error } = await supabase.storage
      .from("user_profile_pictures")
      .remove(["public/" + formData.profilePictureToDelete.split("/").pop()]);
    if (error) {
      console.log(error);
    }
  }
}
