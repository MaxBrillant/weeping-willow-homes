"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type returnedHomesTypes = Array<{
  id: number;
  title: string;
  type_of_property:
    | "penthouse"
    | "townhouse"
    | "condominium"
    | "bungalow"
    | "apartment";
  status: "verified";
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
  accommodation_information: {
    guests: number;
    beds: number;
    bedrooms: number;
  };
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
  };
  home_fees: {
    currency: "usd" | "kes";
    monthly_fee: number;
  };
  home_photos: {
    id: number;
    kitchen: string[];
    building: string[];
    outdoors: string[];
    bathrooms: string[];
    cover_photo: string;
    living_space: string[];
    sleeping_space: string[];
  };
}>;

export type homesType = Array<{
  id: number;
  title: string;
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
  typeOfProperty:
    | "penthouse"
    | "townhouse"
    | "condominium"
    | "bungalow"
    | "apartment";
  numberOfGuests: number;
  numberOfBedrooms: number;
  numberOfBeds: number;
  checkInDate: Date;
  duration: number;
  currency: "usd" | "kes";
  monthlyFee: number;
  photos: string[];
  facilities: {
    id: number;
    title: string;
    iconUrl: string;
  }[];
}>;

type filtersType = {
  city: string | undefined;
  date: string | undefined;
  duration: number;
  currency: string | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  guests: number | undefined;
  bedrooms: number | undefined;
  beds: number | undefined;
  privateBathrooms: number | undefined;
  sharedBathrooms: number | undefined;
};
export async function getListOfHomes(filters: filtersType, pageNumber: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  let query = supabase
    .from("homes")
    .select(
      "id, " +
        "title, " +
        "type_of_property, " +
        "accommodation_information!inner(guests, bedrooms, beds), " +
        "home_location!inner(city), " +
        "home_fees!inner(currency, monthly_fee), " +
        "home_facilities_and_features(id, facilities_and_features(title, icon_url)), " +
        "home_photos(id, cover_photo, sleeping_space, living_space, kitchen, bathrooms, building, outdoors), " +
        "stays!left(check_out_date, status), " +
        "status"
    )
    .limit(5, { referencedTable: "home_facilities_and_features" })
    .order("check_out_date", { referencedTable: "stays", ascending: false })
    .limit(1, { referencedTable: "stays" })
    .neq("stays.status", "cancelled")
    .neq("stays.status", "awaiting-approval")
    .neq("stays.status", "request-denied")
    .neq("stays.status", "checked-out")
    .eq("status", "verified");

  if (filters.city != undefined) {
    query = query.eq("home_location.city", filters.city);
  }
  if (filters.date != undefined) {
    query = query.gte("stays.check_out_date", filters.date);
  }
  if (filters.currency != undefined) {
    query = query.eq("home_fees.currency", filters.currency);
  }
  if (filters.minPrice != undefined) {
    query = query.gte("home_fees.monthly_fee", filters.minPrice);
  }
  if (filters.maxPrice != undefined) {
    query = query.lte("home_fees.monthly_fee", filters.maxPrice);
  }
  if (filters.guests != undefined) {
    query = query
      .gte("accommodation_information.guests", filters.guests)
      .order("guests", {
        referencedTable: "accommodation_information",
        ascending: true,
      });
  }
  if (filters.bedrooms != undefined) {
    query = query
      .gte("accommodation_information.bedrooms", filters.bedrooms)
      .order("bedrooms", {
        referencedTable: "accommodation_information",
        ascending: true,
      });
  }
  if (filters.beds != undefined) {
    query = query
      .gte("accommodation_information.beds", filters.beds)
      .order("beds", {
        referencedTable: "accommodation_information",
        ascending: true,
      });
  }
  if (filters.privateBathrooms != undefined) {
    query = query
      .gte(
        "accommodation_information.private_bathrooms",
        filters.privateBathrooms
      )
      .order("private_bathrooms", {
        referencedTable: "accommodation_information",
        ascending: true,
      });
  }
  if (filters.sharedBathrooms != undefined) {
    query = query
      .gte(
        "accommodation_information.shared_bathrooms",
        filters.sharedBathrooms
      )
      .order("shared_bathrooms", {
        referencedTable: "accommodation_information",
        ascending: true,
      });
  }

  const pageSize = 10;
  const startIndex = pageNumber * pageSize;

  const { data, error } = await query
    .range(startIndex, startIndex + pageSize - 1)

    .returns<returnedHomesTypes>();

  console.log(data);

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data: " + error.message);
  }

  let homes: homesType = [];
  data.map((home) => {
    const photos = [];
    photos.push(home.home_photos.cover_photo);
    home.home_photos.sleeping_space[0] !== home.home_photos.cover_photo &&
      photos.push(home.home_photos.sleeping_space[0]);
    home.home_photos.living_space[0] !== home.home_photos.cover_photo &&
      photos.push(home.home_photos.living_space[0]);
    home.home_photos.kitchen[0] !== home.home_photos.cover_photo &&
      photos.push(home.home_photos.kitchen[0]);
    home.home_photos.bathrooms[0] !== home.home_photos.cover_photo &&
      photos.push(home.home_photos.bathrooms[0]);
    home.home_photos.building[0] !== home.home_photos.cover_photo &&
      photos.push(home.home_photos.building[0]);
    home.home_photos.outdoors[0] !== home.home_photos.cover_photo &&
      photos.push(home.home_photos.outdoors[0]);

    let checkInDate = new Date();

    if (filters.date != undefined) {
      if (home.stays[0] != undefined && home.stays[0].check_out_date) {
        checkInDate = home.stays[0].check_out_date;
      } else {
        checkInDate = new Date(filters.date);
      }
    }
    const newHome = {
      id: home.id,
      title: home.title,
      city: home.home_location.city,
      typeOfProperty: home.type_of_property,
      numberOfGuests: home.accommodation_information.guests,
      numberOfBedrooms: home.accommodation_information.bedrooms,
      numberOfBeds: home.accommodation_information.beds,
      checkInDate: checkInDate,
      duration: filters.duration,
      currency: home.home_fees.currency,
      monthlyFee: home.home_fees.monthly_fee,
      photos: photos,
      facilities: home.home_facilities_and_features.map((facility) => ({
        id: facility.id,
        title: facility.facilities_and_features.title,
        iconUrl: facility.facilities_and_features.icon_url,
      })),
    };

    homes.push(newHome);
  });

  return homes.sort((a, b) => {
    const aDate = new Date(a.checkInDate);
    const bDate = new Date(b.checkInDate);
    return aDate.getTime() - bDate.getTime();
  });
}
