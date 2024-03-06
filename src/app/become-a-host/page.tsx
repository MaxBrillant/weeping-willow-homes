"use client";
import { useEffect, useState } from "react";
import BackButton from "../components/backButton";
import HomeInformationForm from "../homeForm/homeInformationForm";
import AccommodationForm from "../homeForm/accommodationForm";
import { Progress } from "@/components/ui/progress";
import LocationForm from "../homeForm/locationForm";
import PhotosForm from "../homeForm/photosForm";
import FacilitiesAndFeaturesForm from "../homeForm/facilitiesAndFeaturesForm";
import FeesForm from "../homeForm/feesForm";
import HouseRulesAndInformation from "../homeForm/houseRulesAndInformationForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function BecomeAHost() {
  const [step, setStep] = useState<number>(6);
  const { push } = useRouter();

  const handleSignedOutUser = async () => {
    const supabase = createClientComponentClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      push("/login");
    }
  };

  useEffect(() => {
    handleSignedOutUser();
  }, []);

  //   const step1 = document.querySelector("#step-1");
  //   const step2 = document.querySelector("#step-2");
  //   const scrollToStep1 = () => step1?.scrollIntoView({ behavior: "smooth" });
  //   const scrollToStep2 = () => step2?.scrollIntoView({ behavior: "smooth" });
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
                  () => setStep(5),
                  () => scrollTo({ top: 10, behavior: "smooth" }),
                ]}
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
                  // () => setStep(5),
                  () => scrollTo({ top: 10, behavior: "smooth" }),
                ]}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
