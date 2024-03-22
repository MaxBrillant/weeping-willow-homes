"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type returnedHostHomesType = Array<{
  id: number;
  title: string;
  home_location: {
    city: "Nairobi, Kenya" | "Mombasa, Kenya";
  } | null;
  home_photos: {
    cover_photo: string;
  } | null;
  status: "in-progress" | "completed" | "verified";
  accommodation_id: number | null;
  location_id: number | null;
  photos_id: number | null;
  home_facilities_and_features: Array<{ id: number }>;
  fees_id: number | null;
  house_rules_and_information_id: number | null;
}>;

type hostHomesType = Array<{
  id: number;
  title: string;
  city: "Nairobi, Kenya" | "Mombasa, Kenya" | null;
  coverPhotoUrl: string | null;
  status: "in-progress" | "completed" | "verified";
  creationProgress: number;
}>;
export default async function getAllHostHomes() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { data, error } = await supabase
    .from("homes")
    .select(
      "id, " +
        "title, " +
        "user_profile!inner(user_id), " +
        "home_location(city), " +
        "home_photos(cover_photo), " +
        "status, " +
        "accommodation_id, " +
        "location_id, " +
        "photos_id, " +
        "home_facilities_and_features(id), " +
        "fees_id, " +
        "house_rules_and_information_id"
    )
    .eq("user_profile.user_id", userId)
    .returns<returnedHostHomesType>();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data: " + error.message);
  }

  let hostHomes: hostHomesType = [];
  data.map((hostHome) => {
    let creationProgress: number = 6;

    if (!hostHome.house_rules_and_information_id) {
      creationProgress = 6;
    }
    if (!hostHome.fees_id) {
      creationProgress = 5;
    }
    if (hostHome.home_facilities_and_features.length === 0) {
      creationProgress = 4;
    }
    if (!hostHome.photos_id) {
      creationProgress = 3;
    }
    if (!hostHome.location_id) {
      creationProgress = 2;
    }
    if (!hostHome.accommodation_id) {
      creationProgress = 1;
    }

    const newHostHome = {
      id: hostHome.id,
      title: hostHome.title,
      city: hostHome.home_location ? hostHome.home_location.city : null,
      coverPhotoUrl: hostHome.home_photos
        ? hostHome.home_photos.cover_photo
        : null,
      status: hostHome.status,
      creationProgress: creationProgress,
    };

    hostHomes.push(newHostHome);
  });
  return hostHomes;
}
