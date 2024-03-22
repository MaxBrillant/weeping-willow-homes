"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type returnedHostHomeDetailsType = Array<{
  id: number;
  title: string;
  description: string;
  type_of_property: "house" | "apartment";
  property_size: number | null;
  status: "in-progress" | "completed" | "verified";
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
  home_location: {
    city: "Nairobi, Kenya" | "Mombasa, Kenya";
    longitude: number;
    latitude: number;
  };
  home_fees: {
    currency: "usd" | "kes";
    monthly_fee: number;
    first_time_fee: number | null;
    first_time_fee_description: string | null;
    booking_option: "instant" | "request";
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
  house_rules_and_information: {
    events_allowed: boolean | null;
    pets_allowed: boolean | null;
    smoking_allowed: boolean | null;
    start_of_quiet_hours: string | null;
    end_of_quiet_hours: string | null;
    additional_rules: string | null;
    house_information: string | null;
  };
}>;

export type homeDetailsType = {
  id: number;
  title: string;
  description: string;
  propertySize: number | null;
  city: "Nairobi, Kenya" | "Mombasa, Kenya";
  longitude: number;
  latitude: number;
  typeOfProperty: "house" | "apartment";
  numberOfGuests: number;
  numberOfBedrooms: number;
  numberOfBeds: number;
  numberOfPrivateBathrooms: number;
  numberOfSharedBathrooms: number;
  currency: "usd" | "kes";
  monthlyFee: number;
  firstTimeFee: number | null;
  firstTimeFeeDescription: string | null;
  bookingOption: "instant" | "request";
  photos: string[];
  facilities: {
    id: number;
    title: string;
    iconUrl: string;
  }[];
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

export default async function getHostHomeDetails(homeId: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { data, error } = await supabase
    .from("homes")
    .select(
      "id, " +
        "title, " +
        "type_of_property, " +
        "description, " +
        "property_size, " +
        "status, " +
        "accommodation_information(guests, bedrooms, beds, private_bathrooms, shared_bathrooms), " +
        "home_photos(id, cover_photo, sleeping_space, living_space, kitchen, bathrooms, building), " +
        "home_facilities_and_features(id, facilities_and_features(title, icon_url)), " +
        "home_location(city, longitude, latitude), " +
        "home_fees(currency, monthly_fee, first_time_fee, first_time_fee_description, booking_option), " +
        "user_profile!inner(user_id), " +
        "house_rules_and_information(events_allowed, pets_allowed, smoking_allowed, start_of_quiet_hours, end_of_quiet_hours, additional_rules, house_information))"
    )
    .eq("user_profile.user_id", userId)
    .eq("id", homeId)
    .limit(1)
    .returns<returnedHostHomeDetailsType>();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data: " + error.message);
  }

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
    propertySize: data[0].property_size,
    city: data[0].home_location.city,
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
    bookingOption: data[0].home_fees.booking_option,
    photos: photos,
    facilities: data[0].home_facilities_and_features.map((facility) => ({
      id: facility.id,
      title: facility.facilities_and_features.title,
      iconUrl: facility.facilities_and_features.icon_url,
    })),
    houseRules: {
      eventsAllowed: data[0].house_rules_and_information.events_allowed,
      petsAllowed: data[0].house_rules_and_information.pets_allowed,
      smokingAllowed: data[0].house_rules_and_information.smoking_allowed,
      startOfQuietHours:
        data[0].house_rules_and_information.start_of_quiet_hours,
      endOfQuietHours: data[0].house_rules_and_information.end_of_quiet_hours,
      additionalRules: data[0].house_rules_and_information.additional_rules,
      houseInformation: data[0].house_rules_and_information.house_information,
    },
  };

  return homeDetails;
}
