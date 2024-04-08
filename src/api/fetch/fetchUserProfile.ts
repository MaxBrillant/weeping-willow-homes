"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type returnedProfiletype = Array<{
  id: number;
  user_id: string;
  bio: string;
  full_name: string;
  profile_picture: string;
  languages: string[];
  city_address: string;
  is_identity_verified: boolean;
}>;

type profileType = {
  id: number;
  userId: string;
  fullName: string;
  bio: string;
  profilePicture: string;
  languages: string[];
  cityAddress: string;
  isIdentityVerified: boolean;
};
export default async function getUserProfile(userId: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data, error } = await supabase
    .from("user_profile")
    .select(
      "id, user_id, full_name, profile_picture, bio, city_address, languages, is_identity_verified)"
    )
    .eq("id", userId)
    .returns<returnedProfiletype>();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data: " + error.message);
  }

  if (data.length === 0) {
    return undefined;
  }

  const profile: profileType = {
    id: data[0].id,
    userId: data[0].user_id,
    fullName: data[0].full_name,
    bio: data[0].bio,
    profilePicture: data[0].profile_picture,
    languages: data[0].languages,
    cityAddress: data[0].city_address,
    isIdentityVerified: data[0].is_identity_verified,
  };
  return profile;
}

export async function getUserBasicInfo(userId: string) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  type returnedBasicInfo = Array<{
    id: number;
    full_name: string;
    profile_picture: string;
  }>;
  const { data, error } = await supabase
    .from("user_profile")
    .select("id, user_id, full_name, profile_picture)")
    .eq("user_id", userId)
    .returns<returnedBasicInfo>();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data: " + error.message);
  }

  if (data.length === 0) {
    return undefined;
  }

  type basicInfoType = {
    id: number;
    fullName: string;
    profilePicture: string;
  };
  const profile: basicInfoType = {
    id: data[0].id,
    fullName: data[0].full_name,
    profilePicture: data[0].profile_picture,
  };
  return profile;
}
