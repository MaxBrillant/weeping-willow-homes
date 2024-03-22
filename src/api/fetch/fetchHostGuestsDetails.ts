"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type returnedHostGuestsDetailsType = Array<{
  id: number;
  check_in_date: Date;
  duration: number;
  check_out_date: Date;
  guests: number;
  status:
    | "checked-in"
    | "awaiting-approval"
    | "request-denied"
    | "booked"
    | "checked-out"
    | "cancelled";
  user_profile: {
    id: number;
    full_name: string;
    profile_picture: string;
    phone_number: string;
    email_address: string;
  };
  homes: {
    id: number;
    title: string;
    home_photos: { cover_photo: string };
  };
}>;

type hostGuestsDetailsType = {
  id: number;
  checkInDate: Date;
  duration: number;
  guests: number;
  status:
    | "checked-in"
    | "awaiting-approval"
    | "request-denied"
    | "booked"
    | "checked-out"
    | "cancelled";
  guest: {
    id: number;
    fullName: string;
    profilePicture: string;
    phoneNumber: string;
    emailAddress: string;
  };
  home: { id: number; title: string; coverPhotoUrl: string };
};

export default async function getHostGuestsDetaills(stayId: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { data, error } = await supabase
    .from("stays")
    .select(
      "id, " +
        "check_in_date, " +
        "duration, " +
        "check_out_date, " +
        "guests, " +
        "status, " +
        "user_profile(id, full_name, profile_picture, phone_number, email_address), " +
        "homes!inner(id, " +
        "title, " +
        "home_photos(cover_photo), " +
        "user_profile!inner(user_id))"
    )
    .eq("homes.user_profile.user_id", userId)
    .eq("id", stayId)
    .returns<returnedHostGuestsDetailsType>();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data: " + error.message);
  }

  if (data.length === 0) {
    return undefined;
  }

  const hostGuestsDetails: hostGuestsDetailsType = {
    id: data[0].id,
    checkInDate: new Date(data[0].check_in_date),
    duration: data[0].duration,
    guests: data[0].guests,
    status: data[0].status,
    guest: {
      id: data[0].user_profile.id,
      fullName: data[0].user_profile.full_name,
      profilePicture: data[0].user_profile.profile_picture,
      phoneNumber: data[0].user_profile.phone_number,
      emailAddress: data[0].user_profile.email_address,
    },
    home: {
      id: data[0].homes.id,
      title: data[0].homes.title,
      coverPhotoUrl: data[0].homes.home_photos.cover_photo,
    },
  };
  return hostGuestsDetails;
}
