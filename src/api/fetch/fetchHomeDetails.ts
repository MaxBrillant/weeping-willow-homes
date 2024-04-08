"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type returnedHomeDetailsType = Array<{
  id: number;
  title: string;
  description: string;
  type_of_property:
    | "penthouse"
    | "townhouse"
    | "condominium"
    | "bungalow"
    | "apartment";
  status: "verified";
  accommodation_information: {
    guests: number;
    beds: number;
    bedrooms: number;
    private_bathrooms: number;
    shared_bathrooms: number;
  };
  home_facilities_and_features: [
    {
      id: number;
      facilities_and_features: {
        title: string;
        icon_url: string;
      };
    }
  ];
  stays:
    | [
        {
          status:
            | "checked-in"
            | "awaiting-approval"
            | "request-denied"
            | "booked"
            | "checked-out"
            | "cancelled";
          check_out_date: Date;
        }
      ];
  home_location: {
    city:
      | "Nairobi, Kenya"
      | "Mombasa, Kenya"
      | "Kisumu, Kenya"
      | "Nakuru, Kenya"
      | "Nanyuki, Kenya"
      | "Naivasha, Kenya"
      | "Eldoret, Kenya"
      | "Malindi, Kenya"
      | "Tsavo, Kenya"
      | "Watamu, Kenya"
      | "Maasai Mara, Kenya";
    longitude: number;
    latitude: number;
  };
  home_fees: {
    currency: "usd" | "kes";
    monthly_fee: number;
    first_time_fee: number | null;
    first_time_fee_description: string | null;
  };
  home_photos: {
    id: number;
    kitchen: string[];
    building: string[];
    bathrooms: string[];
    cover_photo: string;
    living_space: string[];
    sleeping_space: string[];
  };
  user_profile: {
    id: number;
    bio: string;
    full_name: string;
    profile_picture: string;
    languages: string[];
    city_address: string;
    is_identity_verified: boolean;
  };
  house_rules_and_information: {
    events_allowed: boolean | null;
    pets_allowed: boolean | null;
    smoking_allowed: boolean | null;
    start_of_quiet_hours: string | null;
    end_of_quiet_hours: string | null;
    additional_rules: string | null;
  };
}>;

export type homeDetailsType = {
  id: number;
  title: string;
  description: string;
  city:
    | "Nairobi, Kenya"
    | "Mombasa, Kenya"
    | "Kisumu, Kenya"
    | "Nakuru, Kenya"
    | "Nanyuki, Kenya"
    | "Naivasha, Kenya"
    | "Eldoret, Kenya"
    | "Malindi, Kenya"
    | "Tsavo, Kenya"
    | "Watamu, Kenya"
    | "Maasai Mara, Kenya";
  checkOutDate: Date;
  longitude: number;
  latitude: number;
  typeOfProperty:
    | "penthouse"
    | "townhouse"
    | "condominium"
    | "bungalow"
    | "apartment";
  numberOfGuests: number;
  numberOfBedrooms: number;
  numberOfBeds: number;
  numberOfPrivateBathrooms: number;
  numberOfSharedBathrooms: number;
  currency: "usd" | "kes";
  monthlyFee: number;
  firstTimeFee: number | null;
  firstTimeFeeDescription: string | null;
  photos: string[];
  facilities: {
    id: number;
    title: string;
    iconUrl: string;
  }[];
  userProfile: {
    id: number;
    bio: string;
    fullName: string;
    profilePicture: string;
    languages: string[];
    cityAddress: string;
    isIdentityVerified: boolean;
  };
  houseRules: {
    eventsAllowed: boolean | null;
    petsAllowed: boolean | null;
    smokingAllowed: boolean | null;
    startOfQuietHours: string | null;
    endOfQuietHours: string | null;
    additionalRules: string | null;
  };
};

export async function getHomeDetails(id: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data, error } = await supabase
    .from("homes")
    .select(
      "id, " +
        "title, " +
        "type_of_property, " +
        "description, " +
        "status, " +
        "accommodation_information(guests, bedrooms, beds, private_bathrooms, shared_bathrooms), " +
        "home_photos(id, cover_photo, sleeping_space, living_space, kitchen, bathrooms, building), " +
        "home_facilities_and_features(id, facilities_and_features(title, icon_url)), " +
        "stays!left(check_out_date, status), " +
        "home_location(city, longitude, latitude), " +
        "home_fees(currency, monthly_fee, first_time_fee, first_time_fee_description), " +
        "user_profile(id, full_name, profile_picture, bio, city_address, languages, is_identity_verified), " +
        "house_rules_and_information(events_allowed, pets_allowed, smoking_allowed, start_of_quiet_hours, end_of_quiet_hours, additional_rules))"
    )
    .eq("id", id)
    .eq("status", "verified")
    .order("check_out_date", { referencedTable: "stays", ascending: false })
    .limit(1, { referencedTable: "stays" })
    .neq("stays.status", "cancelled")
    .neq("stays.status", "request-denied")
    .neq("stays.status", "checked-out")
    .limit(1)
    .returns<returnedHomeDetailsType>();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data: " + error.message);
  }

  console.log(data);

  if (data.length === 0) {
    return undefined;
  }

  const photos = [];
  photos.push(data[0].home_photos.cover_photo);
  data[0].home_photos.sleeping_space[0] !== data[0].home_photos.cover_photo &&
    photos.push(data[0].home_photos.sleeping_space[0]);
  data[0].home_photos.living_space[0] !== data[0].home_photos.cover_photo &&
    photos.push(data[0].home_photos.living_space[0]);
  data[0].home_photos.kitchen[0] !== data[0].home_photos.cover_photo &&
    photos.push(data[0].home_photos.kitchen[0]);
  data[0].home_photos.bathrooms[0] !== data[0].home_photos.cover_photo &&
    photos.push(data[0].home_photos.bathrooms[0]);
  data[0].home_photos.building[0] !== data[0].home_photos.cover_photo &&
    photos.push(data[0].home_photos.building[0]);

  const homeDetails: homeDetailsType = {
    id: data[0].id,
    title: data[0].title,
    description: data[0].description,
    city: data[0].home_location.city,
    checkOutDate:
      data[0].stays.length > 0
        ? new Date(data[0].stays[0].check_out_date)
        : new Date(),
    longitude: data[0].home_location.longitude,
    latitude: data[0].home_location.latitude,
    typeOfProperty: data[0].type_of_property,
    numberOfGuests: data[0].accommodation_information.guests,
    numberOfBedrooms: data[0].accommodation_information.bedrooms,
    numberOfBeds: data[0].accommodation_information.beds,
    numberOfPrivateBathrooms:
      data[0].accommodation_information.private_bathrooms,
    numberOfSharedBathrooms: data[0].accommodation_information.shared_bathrooms,
    currency: data[0].home_fees.currency,
    monthlyFee: data[0].home_fees.monthly_fee,
    firstTimeFee: data[0].home_fees.first_time_fee,
    firstTimeFeeDescription: data[0].home_fees.first_time_fee_description,
    photos: photos,
    facilities: data[0].home_facilities_and_features.map((facility) => ({
      id: facility.id,
      title: facility.facilities_and_features.title,
      iconUrl: facility.facilities_and_features.icon_url,
    })),
    userProfile: {
      id: data[0].user_profile.id,
      bio: data[0].user_profile.bio,
      fullName: data[0].user_profile.full_name,
      profilePicture: data[0].user_profile.profile_picture,
      languages: data[0].user_profile.languages,
      cityAddress: data[0].user_profile.city_address,
      isIdentityVerified: data[0].user_profile.is_identity_verified,
    },
    houseRules: {
      eventsAllowed: data[0].house_rules_and_information.events_allowed,
      petsAllowed: data[0].house_rules_and_information.pets_allowed,
      smokingAllowed: data[0].house_rules_and_information.smoking_allowed,
      startOfQuietHours:
        data[0].house_rules_and_information.start_of_quiet_hours,
      endOfQuietHours: data[0].house_rules_and_information.end_of_quiet_hours,
      additionalRules: data[0].house_rules_and_information.additional_rules,
    },
  };

  return homeDetails;
}

type returnedHomePhotos = Array<{
  home_photos: {
    sleeping_space: string[];
    living_space: string[];
    bathrooms: string[];
    kitchen: string[];
    building: string[];
    outdoors: string[];
    additional: string[];
  };
}>;
export type homePhotosType = {
  sleepingSpace: string[];
  livingSpace: string[];
  bathrooms: string[];
  kitchen: string[];
  building: string[];
  outdoors: string[];
  additional: string[];
};
export async function getHomePhotos(id: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data, error } = await supabase
    .from("homes")
    .select(
      "id, " +
        "status, " +
        "home_photos(sleeping_space, living_space, kitchen, bathrooms, building, outdoors, additional)"
    )
    .eq("id", id)
    .neq("status", "in-progress")
    .limit(1)
    .returns<returnedHomePhotos>();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data: " + error.message);
  }

  if (data.length === 0) {
    return undefined;
  }

  return {
    sleepingSpace: data[0].home_photos.sleeping_space,
    livingSpace: data[0].home_photos.living_space,
    bathrooms: data[0].home_photos.bathrooms,
    kitchen: data[0].home_photos.kitchen,
    building: data[0].home_photos.building,
    outdoors: data[0].home_photos.outdoors,
    additional: data[0].home_photos.additional,
  };
}
