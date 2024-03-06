import { SupabaseClient } from "@supabase/supabase-js";

type returnedHostHomesType = Array<{
  id: number;
  title: string;
  home_location: {
    city: "Nairobi, Kenya" | "Mombasa, Kenya";
  };
  home_photos: {
    cover_photo: string;
  };
  status: "in-progress" | "completed" | "verified";
}>;

type hostHomesType = Array<{
  id: number;
  title: string;
  city: "Nairobi, Kenya" | "Mombasa, Kenya";
  coverPhotoUrl: string;
  status: "in-progress" | "completed" | "verified";
}>;
export default async function getAllHostHomes(supabase: SupabaseClient) {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { data, error } = await supabase
    .from("homes")
    .select(
      "id, " +
        "title, " +
        "user_profile!inner(user_id), " +
        "home_location(city), " +
        "home_photos(cover_photo), " +
        "status"
    )
    .eq("user_profile.user_id", userId)
    .returns<returnedHostHomesType>();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data: " + error.message);
  }

  let hostHomes: hostHomesType = [];
  data.map((hostHome) => {
    const newHostHome = {
      id: hostHome.id,
      title: hostHome.title,
      city: hostHome.home_location.city,
      coverPhotoUrl: hostHome.home_photos.cover_photo,
      status: hostHome.status,
    };

    hostHomes.push(newHostHome);
  });
  return hostHomes;
}
