"use server";
import {
  SupabaseClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type formDataType = {
  feesId: number | null;
  homeId: number;
  currency: "usd" | "kes";
  monthlyFees: number;
  firstTimeFees: number | null;
  firstTimeFeesDescription: string | null;
  bookingOption: "instant" | "request";
};

type returnedDataType = Array<{
  id: number;
}>;

export async function addOrUpdateFeesInformation(formData: formDataType) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  if (!formData.feesId) {
    const { data, error } = await supabase
      .from("home_fees")
      .insert({
        currency: formData.currency,
        monthly_fee: formData.monthlyFees,
        first_time_fee: formData.firstTimeFees,
        first_time_fee_description: formData.firstTimeFeesDescription,
        booking_option: formData.bookingOption,
      })
      .select()
      .returns<returnedDataType>();

    if (error || !data) {
      console.log("Error while adding fees information: " + error.message);
    }
    if (data) {
      console.log(
        "Fees information of ID: " + data[0].id + " was successfully created"
      );

      addFeesInformationToHome(data[0].id, formData.homeId, supabase);
    }
  } else {
    const { error } = await supabase
      .from("home_fees")
      .update({
        currency: formData.currency,
        monthly_fee: formData.monthlyFees,
        first_time_fee: formData.firstTimeFees,
        first_time_fee_description: formData.firstTimeFeesDescription,
        booking_option: formData.bookingOption,
      })
      .eq("id", formData.feesId);

    if (error) {
      console.log("Error while updating fees information: " + error.message);
    }
    console.log(
      "Fees information of ID: " + formData.feesId + " was successfully updated"
    );
  }
}

async function addFeesInformationToHome(
  feesId: number,
  homeId: number,
  supabase: SupabaseClient
) {
  const { error } = await supabase
    .from("homes")
    .update({
      fees_id: feesId,
    })
    .eq("id", homeId);

  if (error) {
    console.log(
      "Error while adding fees information to the home: " + error.message
    );
  }
  console.log(
    "Fees information of ID: " +
      feesId +
      " was successfully added to the home of ID: " +
      homeId
  );
}
