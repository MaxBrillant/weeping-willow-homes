"use client";
import { useEffect } from "react";
import BackButton from "../components/backButton";
import HomeInformationForm from "../homeForm/homeInformationForm";
import { Progress } from "@/components/ui/progress";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import UserHasProfile from "@/api/fetch/checkIfUserHasProfile";

export default function BecomeAHost() {
  const { push } = useRouter();

  const supabase = createClientComponentClient();
  const handleSignedOutUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      push(`/login?redirect-to=${location}`);
    } else {
      const userHasProfile = await UserHasProfile();
      if (!userHasProfile) {
        push(
          `/users/create-profile?redirect-to=${location
            .toString()
            .replaceAll("&", "!")}`
        );
      }
    }
  };

  useEffect(() => {
    handleSignedOutUser();
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50 w-full bg-white py-2">
        <div className="flex flex-row gap-5 py-3 border-b-2">
          <BackButton />
          <p className="font-bold text-xl">
            Turn Your Property into a Weeping Willow Home
          </p>
        </div>
        <Progress
          value={(1 * 100) / 7}
          className="w-full h-3 rounded-md bg-slate-300"
        />
      </div>
      <div className="flex-grow flex flex-col items-center sm:px-10">
        <div id="step-1">
          <div
            id="step-1"
            className="flex flex-col w-full border border-black mt-10"
          >
            <p className="bg-gray-200 p-3 font-medium">
              Provide essential details about your property by specifying the
              type of property, crafting a compelling title, and providing a
              detailed yet succinct description.
            </p>
            <HomeInformationForm submitFunctions={[]} homeId={null} />
          </div>
          <div className="m-auto h-10 w-1 bg-slate-500"></div>
        </div>
      </div>
    </div>
  );
}
