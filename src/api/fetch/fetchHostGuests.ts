import { SupabaseClient } from "@supabase/supabase-js";

type returnedHostGuestsType = Array<{
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
    full_name: string;
  };
  homes: {
    title: string;
    home_photos: {
      cover_photo: string;
    };
  };
}>;

type hostGuestsType = Array<{
  id: number;
  title: string;
  coverPhoto: string;
  checkInDate: Date;
  duration: number;
  guestFullName: string;
  status:
    | "checked-in"
    | "awaiting-approval"
    | "request-denied"
    | "booked"
    | "checked-out"
    | "cancelled";
}>;
export default async function getAllHostguests(supabase: SupabaseClient) {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { data, error } = await supabase
    .from("stays")
    .select(
      "id, " +
        "check_in_date, " +
        "duration, " +
        "status, " +
        "user_profile!inner(full_name), " +
        "homes!inner(title, user_profile!inner(user_id, full_name), home_photos(cover_photo))"
    )
    .eq("homes.user_profile.user_id", userId)
    .order("check_in_date", { ascending: false })
    .returns<returnedHostGuestsType>();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data: " + error.message);
  }

  let guests: hostGuestsType = [];

  data.map((returnedData) => {
    const guest = {
      id: returnedData.id,
      title: returnedData.homes.title,
      coverPhoto: returnedData.homes.home_photos.cover_photo,
      checkInDate: new Date(returnedData.check_in_date),
      duration: returnedData.duration,
      guestFullName: returnedData.user_profile.full_name,
      status: returnedData.status,
    };
    guests.push(guest);
  });
  return guests;
}
