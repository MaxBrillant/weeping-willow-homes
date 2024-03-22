"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type returnedDefaultValuesType = Array<{
  home_fees: {
    id: number;
    currency: "usd" | "kes";
    monthly_fee: number;
    first_time_fee: number | null;
    first_time_fee_description: string | null;
    booking_option: "instant" | "request";
  } | null;
}>;

type defaultValuesType = {
  feesId: number;
  currency: "usd" | "kes";
  monthlyFee: number;
  firstTimeFee: number | null;
  firstTimeFeeDescription: string | null;
  bookingOption: "instant" | "request";
};
export default async function getFeesDefaultValues(homeId: number) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  const { data, error } = await supabase
    .from("homes")
    .select(
      "id, " +
        "home_fees(id, currency, monthly_fee, first_time_fee, first_time_fee_description, booking_option), " +
        "user_profile!inner(user_id)"
    )
    .eq("user_profile.user_id", userId)
    .eq("id", homeId)
    .limit(1)
    .returns<returnedDefaultValuesType>();

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data: " + error.message);
  }

  if (data.length === 0) {
    return null;
  }
  if (!data[0].home_fees) {
    return null;
  }
  const defaultValues: defaultValuesType = {
    feesId: data[0].home_fees.id,
    currency: data[0].home_fees.currency,
    monthlyFee: data[0].home_fees.monthly_fee,
    firstTimeFee: data[0].home_fees.first_time_fee,
    firstTimeFeeDescription: data[0].home_fees.first_time_fee_description,
    bookingOption: data[0].home_fees.booking_option,
  };
  return defaultValues;
}
