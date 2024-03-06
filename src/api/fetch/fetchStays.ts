import { SupabaseClient } from "@supabase/supabase-js";

type returnedStaysType = Array<{
  id: number;
  check_in_date: Date;
  duration: number;
  status:
    | "checked-in"
    | "awaiting-approval"
    | "request-denied"
    | "booked"
    | "checked-out"
    | "cancelled";
  user_profile: {
    user_id: string;
  };
  homes: {
    title: string;
    home_photos: {
      cover_photo: string;
    };
  };
}>;
type staysType = Array<{
  id: number;
  title: string;
  coverPhoto: string;
  checkInDate: Date;
  duration: number;
  status:
    | "checked-in"
    | "awaiting-approval"
    | "request-denied"
    | "booked"
    | "checked-out"
    | "cancelled";
}>;
export default async function getListOfStays(supabase: SupabaseClient) {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { data, error } = await supabase
    .from("stays")
    .select(
      "id, " +
        "check_in_date, " +
        "duration, " +
        "status, " +
        "user_profile!inner(user_id), " +
        "homes(title, home_photos(cover_photo))"
    )
    .eq("user_profile.user_id", userId)
    .order("check_in_date", { ascending: false })
    .returns<returnedStaysType>();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data: " + error.message);
  }

  let stays: staysType = [];

  data.map((returnedData) => {
    const stay = {
      id: returnedData.id,
      title: returnedData.homes.title,
      coverPhoto: returnedData.homes.home_photos.cover_photo,
      checkInDate: returnedData.check_in_date,
      duration: returnedData.duration,
      status: returnedData.status,
    };
    stays.push(stay);
  });
  return stays;
}
