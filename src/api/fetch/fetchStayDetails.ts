"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type returnedStayDetailsType = Array<{
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
  user_profile: { user_id: number };
  homes: {
    id: number;
    title: string;
    home_photos: { cover_photo: string };
    user_profile: {
      id: number;
      full_name: string;
      profile_picture: string;
      phone_number: string;
      email_address: string;
    };
    home_location: { longitude: number; latitude: number };
    house_rules_and_information: {
      events_allowed: boolean | null;
      pets_allowed: boolean | null;
      smoking_allowed: boolean | null;
      start_of_quiet_hours: string | null;
      end_of_quiet_hours: string | null;
      additional_rules: string | null;
      house_information: string | null;
    };
  };
}>;

type stayDetailsType = {
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
  home: { id: number; title: string; coverPhotoUrl: string };
  host: {
    id: number;
    fullName: string;
    profilePicture: string;
    phoneNumber: string;
    emailAddress: string;
  };
  location: {
    longitude: number;
    latitude: number;
  };
  houseRules: {
    eventsAllowed: boolean | null;
    petsAllowed: boolean | null;
    smokingAllowed: boolean | null;
    startOfQuietHours: string | null;
    endOfQuietHours: string | null;
    additionalRules: string | null;
    houseInformation: string | null;
  };
};
export default async function getStayDetails(stayId: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  const { data, error } = await supabase
    .from("stays")
    .select(
      "id, " +
        "check_in_date, " +
        "duration, " +
        "check_out_date, " +
        "guests, " +
        "status, " +
        "user_profile!inner(user_id), " +
        "homes(id, " +
        "title, " +
        "home_photos(cover_photo), " +
        "user_profile(id, full_name, profile_picture, phone_number, email_address), " +
        "home_location(longitude, latitude), " +
        "house_rules_and_information(events_allowed, pets_allowed, smoking_allowed, start_of_quiet_hours, end_of_quiet_hours, additional_rules, house_information))"
    )
    .eq("user_profile.user_id", userId)
    .eq("id", stayId)
    .returns<returnedStayDetailsType>();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data: " + error.message);
  }

  if (data.length === 0) {
    return undefined;
  }

  const stayDetails: stayDetailsType = {
    id: data[0].id,
    checkInDate: new Date(data[0].check_in_date),
    duration: data[0].duration,
    guests: data[0].guests,
    status: data[0].status,
    home: {
      id: data[0].homes.id,
      title: data[0].homes.title,
      coverPhotoUrl: data[0].homes.home_photos.cover_photo,
    },
    host: {
      id: data[0].homes.user_profile.id,
      fullName: data[0].homes.user_profile.full_name,
      profilePicture: data[0].homes.user_profile.profile_picture,
      phoneNumber: data[0].homes.user_profile.phone_number,
      emailAddress: data[0].homes.user_profile.email_address,
    },
    location: {
      longitude: data[0].homes.home_location.longitude,
      latitude: data[0].homes.home_location.latitude,
    },
    houseRules: {
      eventsAllowed: data[0].homes.house_rules_and_information.events_allowed,
      petsAllowed: data[0].homes.house_rules_and_information.pets_allowed,
      smokingAllowed: data[0].homes.house_rules_and_information.smoking_allowed,
      startOfQuietHours:
        data[0].homes.house_rules_and_information.start_of_quiet_hours,
      endOfQuietHours:
        data[0].homes.house_rules_and_information.end_of_quiet_hours,
      additionalRules:
        data[0].homes.house_rules_and_information.additional_rules,
      houseInformation:
        data[0].homes.house_rules_and_information.house_information,
    },
  };
  return stayDetails;
}
