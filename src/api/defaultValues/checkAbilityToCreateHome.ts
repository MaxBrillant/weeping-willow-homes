"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function userIsAllowedToCreateHome(homeId: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  const { data, error } = await supabase
    .from("homes")
    .select("id, " + "user_profile!inner(user_id)")
    .eq("user_profile.user_id", userId)
    .eq("id", homeId)
    .limit(1);

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data: " + error.message);
  }

  if (data.length > 0) {
    return true;
  } else {
    return false;
  }
}
