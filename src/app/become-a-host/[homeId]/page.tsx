"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import HomeInformationForm from "@/app/homeForm/homeInformationForm";
import AccommodationForm from "@/app/homeForm/accommodationForm";
import LocationForm from "@/app/homeForm/locationForm";
import PhotosForm from "@/app/homeForm/photosForm";
import FacilitiesAndFeaturesForm from "@/app/homeForm/facilitiesAndFeaturesForm";
import FeesForm from "@/app/homeForm/feesForm";
import HouseRulesAndInformation from "@/app/homeForm/houseRulesAndInformationForm";
import userIsAllowedToCreateHome from "@/api/defaultValues/checkAbilityToCreateHome";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserHasProfile from "@/api/fetch/checkIfUserHasProfile";
import Image from "next/image";
import Loading from "@/app/loading";

export default function BecomeAHost({
  params,
}: {
  params: { homeId: number };
}) {
  const [step, setStep] = useState<number>(1);
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const [isCompleted, setIsCompleted] = useState(false);

  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleSignedOutUserAndCheckForUserAccess = async () => {
    setIsLoading(true);

    if (searchParams != undefined && searchParams) {
      if (!isNaN(Number(searchParams.get("step")))) {
        const selectedStep = searchParams.get("step");
        if (Number(selectedStep) > 6) {
          push("/become-a-host/" + params.homeId);
        } else {
          setStep(Number(selectedStep));
        }
      } else {
        push("/become-a-host/" + params.homeId);
      }
    }

    const supabase = createClientComponentClient();
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
    const userHasAccess = await userIsAllowedToCreateHome(
      params.homeId as number
    );
    setHasAccess(userHasAccess);
    setIsLoading(false);
  };

  useEffect(() => {
    handleSignedOutUserAndCheckForUserAccess();
  }, []);

  useEffect(() => {
    push("/become-a-host/" + params.homeId + "?step=" + step);
  }, [step]);

  if (!hasAccess && !isLoading) {
    return <p>{`You don't have access.`}</p>;
  }

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50 w-full bg-white py-2">
        <div className="flex flex-row p-3 border-b-2">
          <p className="font-bold text-xl">
            Turn Your Property into a Willow Home
          </p>
        </div>
        <Progress
          value={((step + 1) * 100) / 7}
          className="w-full h-3 rounded-md bg-slate-300"
        />
      </div>
      <div className="flex-grow flex flex-col items-center px-5 sm:px-10">
        {step === 0 && (
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
              <HomeInformationForm
                submitFunctions={[
                  () => setStep(1),
                  () => scrollTo({ top: 10, behavior: "smooth" }),
                ]}
                homeId={params.homeId}
              />
            </div>
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
          </div>
        )}
        {step === 1 && (
          <div id="step-2">
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
            <div className="flex flex-col w-full border border-black rounded-2xl">
              <p className="bg-slate-200 p-5 font-medium border-b border-black rounded-t-2xl">
                Provide details about the specifics of your accommodation. Clear
                and accurate accommodation information helps guests assess
                suitability and plan their stay accordingly.
              </p>
              <AccommodationForm
                backFunctions={[
                  () => setStep(0),
                  () => scrollTo({ top: 10, behavior: "smooth" }),
                ]}
                submitFunctions={[
                  () => setStep(2),
                  () => scrollTo({ top: 10, behavior: "smooth" }),
                ]}
                homeId={params.homeId}
              />
            </div>
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
          </div>
        )}
        {step === 2 && (
          <div id="step-3">
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
            <div className="flex flex-col w-full border border-black rounded-2xl">
              <p className="bg-slate-200 p-5 font-medium border-b border-black rounded-t-2xl">
                Provide details about the specifics of your accommodation. Clear
                and accurate accommodation information helps guests assess
                suitability and plan their stay accordingly.
              </p>
              <LocationForm
                backFunctions={[
                  () => setStep(1),
                  () => scrollTo({ top: 10, behavior: "smooth" }),
                ]}
                submitFunctions={[
                  () => setStep(3),
                  () => scrollTo({ top: 10, behavior: "smooth" }),
                ]}
                homeId={params.homeId}
              />
            </div>
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
          </div>
        )}
        {step === 3 && (
          <div id="step-4">
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
            <div className="flex flex-col w-full border border-black rounded-2xl">
              <p className="bg-slate-200 p-5 font-medium border-b border-black rounded-t-2xl">
                Upload some images of your home by category.
              </p>
              <PhotosForm
                backFunctions={[
                  () => setStep(2),
                  () => scrollTo({ top: 10, behavior: "smooth" }),
                ]}
                submitFunctions={[
                  () => setStep(4),
                  () => scrollTo({ top: 10, behavior: "smooth" }),
                ]}
                homeId={params.homeId}
              />
            </div>
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
          </div>
        )}
        {step === 4 && (
          <div id="step-5">
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
            <div className="flex flex-col w-full border border-black rounded-2xl">
              <p className="bg-slate-200 p-5 font-medium border-b border-black rounded-t-2xl">
                List the Facilities and Features that make your property unique
                and desirable.
              </p>
              <FacilitiesAndFeaturesForm
                backFunctions={[
                  () => setStep(3),
                  () => scrollTo({ top: 10, behavior: "smooth" }),
                ]}
                submitFunctions={[
                  () => setStep(5),
                  () => scrollTo({ top: 10, behavior: "smooth" }),
                ]}
                homeId={params.homeId}
              />
            </div>
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
          </div>
        )}
        {step === 5 && (
          <div id="step-6">
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
            <div className="flex flex-col w-full border border-black rounded-2xl">
              <p className="bg-slate-200 p-5 font-medium border-b border-black rounded-t-2xl">
                Outline the financial aspects of renting your property.
              </p>
              <FeesForm
                backFunctions={[
                  () => setStep(4),
                  () => scrollTo({ top: 10, behavior: "smooth" }),
                ]}
                submitFunctions={[
                  () => setStep(6),
                  () => scrollTo({ top: 10, behavior: "smooth" }),
                ]}
                homeId={params.homeId}
              />
            </div>
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
          </div>
        )}
        {step === 6 && (
          <div id="step-7">
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
            <div className="flex flex-col w-full border border-black rounded-2xl">
              <p className="bg-slate-200 p-5 font-medium border-b border-black rounded-t-2xl">
                Outline the guidelines and expectations for guests during their
                stay at your property. Establishing clear house rules helps
                ensure a comfortable and harmonious experience for all.
              </p>
              <HouseRulesAndInformation
                backFunctions={[
                  () => setStep(5),
                  () => scrollTo({ top: 10, behavior: "smooth" }),
                ]}
                submitFunctions={[
                  () => setIsCompleted(true),
                  () => scrollTo({ top: 10, behavior: "smooth" }),
                ]}
                homeId={params.homeId}
              />
            </div>
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
          </div>
        )}
        <Dialog open={isCompleted}>
          <DialogContent className="w-full h-full overflow-auto">
            <div className="flex flex-col gap-5 p-5 items-center justify-center">
              <div className="grid grid-cols-2">
                <Image
                  src="/confetti-1.png"
                  alt="confetti"
                  width={300}
                  height={300}
                  priority
                  loading="eager"
                  className="w-full aspect-square object-cover"
                />
                <Image
                  src="/confetti-2.png"
                  alt="confetti"
                  width={300}
                  height={300}
                  priority
                  loading="eager"
                  className="w-full aspect-square object-cover"
                />
              </div>
              <p className="text-5xl font-bold text-center">Welcome on board</p>
              <p className="font-medium text-lg">
                {`You've just taken a significant step towards making your
                property a cherished part of someone's journey. Here's to the
                next chapter of your home's story!`}
              </p>
              <p className="text-2xl font-bold">{`What's next?`}</p>
              <p className="font-medium text-lg">
                {`We will reach out to you via phone or email to begin the verification process of your property. Our goal is to guarantee a secure and opulent experience for your future guests, which is why your property will only be available for booking following our verification.`}
              </p>
              <Link href={"/hosting"}>
                <Button>Go to Hosting</Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
