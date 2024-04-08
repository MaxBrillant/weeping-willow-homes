"use client";
import { useEffect, useState } from "react";
import BackButton from "../components/backButton";
import HomeInformationForm from "../homeForm/homeInformationForm";
import { Progress } from "@/components/ui/progress";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import UserHasProfile from "@/api/fetch/checkIfUserHasProfile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GoHomeFill } from "react-icons/go";
import { Separator } from "@/components/ui/separator";
import { IoBed } from "react-icons/io5";
import { FaLocationDot, FaMoneyBillWave, FaMoneyBills } from "react-icons/fa6";
import { IoMdPhotos } from "react-icons/io";
import { HiSparkles } from "react-icons/hi2";
import { FaMoneyBillWaveAlt } from "react-icons/fa";
import { MdOutlineRule } from "react-icons/md";
import { Button } from "@/components/ui/button";

export default function BecomeAHost() {
  const { push } = useRouter();

  const [open, setOpen] = useState(true);

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
      <div className="sticky top-0 z-20 w-full bg-white py-2">
        <div className="flex flex-row gap-5 py-3 border-b-2 items-center">
          <BackButton />
          <p className="font-bold text-xl">
            Turn Your Property into a Willow Home
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
            className="flex flex-col w-full border border-black mt-10 rounded-2xl"
          >
            <p className="bg-slate-200 p-5 font-medium border-b border-black rounded-t-2xl">
              Provide essential details about your property by specifying the
              type of property, crafting a compelling title, and providing a
              detailed yet succinct description.
            </p>
            <HomeInformationForm submitFunctions={[]} homeId={null} />
          </div>
          <div className="m-auto h-10 w-1 bg-slate-500"></div>
        </div>
      </div>
      <Dialog open={open}>
        <DialogContent className="w-full h-full overflow-auto">
          <div className="flex flex-col gap-5 p-5">
            <p className="text-2xl font-bold text-center">
              {`Here is a quick guide on how to setup your home`}
            </p>
            <p className="font-medium text-md">
              {`You have to go through 7 steps and provide various information about your home in order to complete the setup. You can always quit and come back later, your changes will be saved as long as you have clicked on the "Save and exit" button.`}
            </p>
            <div className="relative flex flex-col">
              <p className="absolute right-5 font-black top-20 text-5xl opacity-15">
                7 steps
              </p>
              <div className="flex flex-row gap-2 w-fit pr-3 items-center">
                <div className="flex flex-col items-center bg-black w-8 h-8 p-2 rounded-full">
                  <GoHomeFill className="w-8 h-8 fill-white" />
                </div>
                <p className="font-medium">Property details</p>
              </div>
              <Separator
                orientation="vertical"
                className="bg-black w-1 h-2 ml-[0.85rem]"
              />
              <div className="flex flex-row gap-2 w-fit pr-3 items-center">
                <div className="flex flex-col items-center bg-black w-8 h-8 p-2 rounded-full">
                  <IoBed className="w-8 h-8 fill-white" />
                </div>
                <p className="font-medium">Accommodation</p>
              </div>
              <Separator
                orientation="vertical"
                className="bg-black w-1 h-2 ml-[0.85rem]"
              />
              <div className="flex flex-row gap-2 w-fit pr-3 items-center">
                <div className="flex flex-col items-center bg-black w-8 h-8 p-2 rounded-full">
                  <FaLocationDot className="w-8 h-8 fill-white" />
                </div>
                <p className="font-medium">Location</p>
              </div>
              <Separator
                orientation="vertical"
                className="bg-black w-1 h-2 ml-[0.85rem]"
              />
              <div className="flex flex-row gap-2 w-fit pr-3 items-center">
                <div className="flex flex-col items-center bg-black w-8 h-8 p-2 rounded-full">
                  <IoMdPhotos className="w-8 h-8 fill-white" />
                </div>
                <p className="font-medium">Photos</p>
              </div>
              <Separator
                orientation="vertical"
                className="bg-black w-1 h-2 ml-[0.85rem]"
              />
              <div className="flex flex-row gap-2 w-fit pr-3 items-center">
                <div className="flex flex-col items-center bg-black w-8 h-8 p-2 rounded-full">
                  <HiSparkles className="w-8 h-8 fill-white" />
                </div>
                <p className="font-medium">Facilities and Features</p>
              </div>
              <Separator
                orientation="vertical"
                className="bg-black w-1 h-2 ml-[0.85rem]"
              />
              <div className="flex flex-row gap-2 w-fit pr-3 items-center">
                <div className="flex flex-col items-center bg-black w-8 h-8 p-2 rounded-full">
                  <FaMoneyBillWave className="w-8 h-8 fill-white" />
                </div>
                <p className="font-medium">Fees and booking information</p>
              </div>
              <Separator
                orientation="vertical"
                className="bg-black w-1 h-2 ml-[0.85rem]"
              />
              <div className="flex flex-row gap-2 w-fit pr-3 items-center">
                <div className="flex flex-col items-center bg-black w-8 h-8 p-2 rounded-full">
                  <MdOutlineRule className="w-8 h-8 fill-white" />
                </div>
                <p className="font-medium">House rules and information</p>
              </div>
            </div>
            <Button onClick={() => setOpen(false)}>Start the setup</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
