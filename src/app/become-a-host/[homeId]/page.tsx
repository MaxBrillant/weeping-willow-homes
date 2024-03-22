"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import BackButton from "@/app/components/backButton";
import { Progress } from "@/components/ui/progress";
import HomeInformationForm from "@/app/homeForm/homeInformationForm";
import AccommodationForm from "@/app/homeForm/accommodationForm";
import LocationForm from "@/app/homeForm/locationForm";
import PhotosForm from "@/app/homeForm/photosForm";
import FacilitiesAndFeaturesForm from "@/app/homeForm/facilitiesAndFeaturesForm";
import FeesForm from "@/app/homeForm/feesForm";
import HouseRulesAndInformation from "@/app/homeForm/houseRulesAndInformationForm";
import userIsAllowedToCreateHome from "@/api/defaultValues/checkAbilityToCreateHome";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  if (!hasAccess && !isLoading) {
    return <p>{`You don't have access.`}</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }
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
          value={((step + 1) * 100) / 7}
          className="w-full h-3 rounded-md bg-slate-300"
        />
      </div>
      <div className="flex-grow flex flex-col items-center sm:px-10">
        {step === 0 && (
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
            <div className="flex flex-col w-full border border-black">
              <p className="bg-gray-200 p-3 font-medium">
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
          </div>
        )}
        {step === 2 && (
          <div id="step-3">
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
            <div className="flex flex-col w-full border border-black">
              <p className="bg-gray-200 p-3 font-medium">
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
          </div>
        )}
        {step === 3 && (
          <div id="step-4">
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
            <div className="flex flex-col w-full border border-black">
              <p className="bg-gray-200 p-3 font-medium">
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
          </div>
        )}
        {step === 4 && (
          <div id="step-5">
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
            <div className="flex flex-col w-full border border-black">
              <p className="bg-gray-200 p-3 font-medium">
                List the Features and Facilities that make your property unique
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
          </div>
        )}
        {step === 5 && (
          <div id="step-6">
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
            <div className="flex flex-col w-full border border-black">
              <p className="bg-gray-200 p-3 font-medium">
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
          </div>
        )}
        {step === 6 && (
          <div id="step-7">
            <div className="m-auto h-10 w-1 bg-slate-500"></div>
            <div className="flex flex-col w-full border border-black">
              <p className="bg-gray-200 p-3 font-medium">
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
          </div>
        )}
        <Dialog open={isCompleted}>
          <DialogContent className="sm:max-w-[425px] max-h-[500px] overflow-auto">
            <div className="flex flex-col gap-5 p-5 items-center justify-center">
              <p>Welcome on board</p>
              <p>You have successfully completed the creation of this home.</p>
              <p>{`What's next?`}</p>
              <p>
                {`We will get in touch with you via call or email, and initiate
                the verification process of your home. We want to ensure a safe
                and luxurious experience to your future guests, and that's why
                your home will only be available for booking after being
                verified by us.`}
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
