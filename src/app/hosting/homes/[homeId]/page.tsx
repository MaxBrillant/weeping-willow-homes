"use server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import EditPopup from "@/app/components/editHomeDialog";
import AccommodationForm from "@/app/homeForm/accommodationForm";
import HomeInformationForm from "@/app/homeForm/homeInformationForm";
import PhotosForm from "@/app/homeForm/photosForm";
import FacilitiesAndFeaturesForm from "@/app/homeForm/facilitiesAndFeaturesForm";
import FeesForm from "@/app/homeForm/feesForm";
import LocationForm from "@/app/homeForm/locationForm";
import HouseRulesAndInformation from "@/app/homeForm/houseRulesAndInformationForm";
import UserHasProfile from "@/api/fetch/checkIfUserHasProfile";
import { Separator } from "@/components/ui/separator";
import SeeMoreDialog from "@/app/components/seeMore";
import Map, { ExpandMap } from "@/app/components/map";
import BackButton from "@/app/components/backButton";
import getHostHomeDetails from "@/api/fetch/fetchHostHomeDetails";
import { cookies, headers } from "next/headers";
import { FormatCurrency } from "@/formatCurrency";

export default async function HomeInformation({
  params,
}: {
  params: { homeId: number };
}) {
  const homeId = params.homeId;

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headersList = headers();
  if (!session) {
    redirect(`/login?redirect-to=${headersList.get("x-pathname")}`);
  } else {
    const userHasProfile = await UserHasProfile();
    if (!userHasProfile) {
      redirect(
        `/users/create-profile?redirect-to=${headersList
          .get("x-pathname")
          ?.replaceAll("&", "!")}`
      );
    }
  }

  const hostHomeDetails = await getHostHomeDetails(homeId);

  console.log(hostHomeDetails);

  if (hostHomeDetails == undefined) {
    return (
      <div className="flex flex-col gap-5 p-10 items-center">
        <p className="font-medium text-lg">
          {`You don't have access to this home.`}
        </p>
        <Link href={"/hosting"}>
          <Button>See all your homes</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row gap-5 py-3 border-b-2">
        <BackButton goTo="/hosting" />
        <p className="font-bold text-3xl">Home overview</p>
      </div>
      <div className="w-full flex flex-col gap-7 p-7">
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-50 border border-slate-300">
          <div className="flex flex-row justify-between items-center">
            <p className="font-bold text-xl">Property details</p>
            <EditPopup
              title="Property details"
              form={
                <HomeInformationForm
                  submitFunctions={[]}
                  homeId={params.homeId}
                ></HomeInformationForm>
              }
            ></EditPopup>
          </div>
          <div className="flex flex-col gap-5 p-3">
            <div>
              <p>Title</p>
              <p className="font-semibold text-lg">{hostHomeDetails.title}</p>
            </div>
            <Separator />
            <div>
              <p>Type of property</p>
              <p className="font-semibold text-lg">
                {hostHomeDetails.typeOfProperty}
              </p>
            </div>
            <Separator />
            <div>
              <p>Description</p>
              <p className="font-semibold text-lg">
                {hostHomeDetails.description}
              </p>
            </div>
            <Separator />
            <div>
              <p>Property size</p>
              {hostHomeDetails.propertySize ? (
                <p className="font-semibold text-lg">
                  {hostHomeDetails.propertySize} square meters
                </p>
              ) : (
                <p className="font-semibold text-lg">Not provided.</p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-50 border border-slate-300">
          <div className="flex flex-row justify-between items-center">
            <p className="font-bold text-xl">Accommodation</p>
            <EditPopup
              title="Accommodation"
              form={
                <AccommodationForm
                  backFunctions={[]}
                  submitFunctions={[]}
                  homeId={params.homeId}
                  saveAndExit={false}
                ></AccommodationForm>
              }
            ></EditPopup>
          </div>
          <div className="flex flex-col gap-5 p-3">
            <div>
              <p>Number of guests</p>
              <p className="font-semibold text-xl">
                {hostHomeDetails.numberOfGuests}
              </p>
            </div>
            <Separator />
            <div>
              <p>Number of bedrooms</p>
              <p className="font-semibold text-xl">
                {hostHomeDetails.numberOfBedrooms}
              </p>
            </div>
            <Separator />
            <div>
              <p>Number of beds</p>
              <p className="font-semibold text-xl">
                {hostHomeDetails.numberOfBeds}
              </p>
            </div>
            <Separator />
            <div>
              <p>Number of bathrooms</p>
              <p className="font-semibold text-lg">
                {hostHomeDetails.numberOfPrivateBathrooms} private
              </p>
              <p className="font-semibold text-lg">
                {hostHomeDetails.numberOfSharedBathrooms} shared
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-50 border border-slate-300">
          <div className="flex flex-row justify-between items-center">
            <p className="font-bold text-xl">Photos</p>
            <EditPopup
              title="Photos"
              form={
                <PhotosForm
                  backFunctions={[]}
                  submitFunctions={[]}
                  homeId={params.homeId}
                  saveAndExit={false}
                ></PhotosForm>
              }
            ></EditPopup>
          </div>
          <div className="flex flex-col gap-5 p-3">
            <div className="grid grid-cols-3 items-center gap-2">
              {hostHomeDetails.photos.map((photo, index) => {
                return (
                  <Image
                    key={index}
                    className="w-full aspect-[3/2] object-cover rounded-md"
                    src={photo}
                    width={200}
                    height={200}
                    alt="image"
                  />
                );
              })}
            </div>
            <Link href={"/homes/" + hostHomeDetails.id + "/photos"}>
              <Button variant={"secondary"} className="w-full">
                See all photos
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-50 border border-slate-300">
          <div className="flex flex-row justify-between items-center">
            <p className="font-bold text-xl">Facilities and Features</p>
            <EditPopup
              title="Facilities and features"
              form={
                <FacilitiesAndFeaturesForm
                  backFunctions={[]}
                  submitFunctions={[]}
                  homeId={params.homeId}
                  saveAndExit={false}
                ></FacilitiesAndFeaturesForm>
              }
            ></EditPopup>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col divide-y-2 divide-slate-200">
              {hostHomeDetails.facilities
                .filter((facility) => facility.type === "facility")
                .map(
                  (facility, index) =>
                    index < 5 && (
                      <div
                        key={facility.id}
                        className="flex flex-row gap-3 p-3 items-center"
                      >
                        <Image
                          src={facility.iconUrl}
                          width={30}
                          height={30}
                          alt={facility.title}
                          className="w-[28px] aspect-square object-cover"
                        />
                        <p>{facility.title}</p>
                      </div>
                    )
                )}
            </div>
            <SeeMoreDialog
              title="All Facilities and Features"
              button={
                <Button variant={"secondary"}>
                  See all Facilities and Features
                </Button>
              }
              body={
                <div className="p-3 space-y-7">
                  {[1, 2, 3].map((index) => {
                    return (
                      <div key={index}>
                        <p className="font-semibold text-lg">
                          {index === 1
                            ? `Facilities`
                            : index === 2
                            ? `Safety facilities`
                            : `Features`}
                        </p>
                        <div className="flex flex-col divide-y-2 divide-slate-200">
                          {hostHomeDetails.facilities
                            .filter(
                              (facility) =>
                                (index === 1 && facility.type === "facility") ||
                                (index === 2 && facility.type === "safety") ||
                                (index === 3 && facility.type === "feature")
                            )
                            .map((facility) => (
                              <div
                                key={facility.id}
                                className="flex flex-row gap-3 p-3 items-center"
                              >
                                <Image
                                  src={facility.iconUrl}
                                  width={30}
                                  height={30}
                                  alt={facility.title}
                                  className="w-[28px] aspect-square object-cover"
                                />
                                <p>{facility.title}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-50 border border-slate-300">
          <div className="flex flex-row justify-between items-center">
            <p className="font-bold text-xl">Fees and booking information</p>
            <EditPopup
              title="Fees information"
              form={
                <FeesForm
                  backFunctions={[]}
                  submitFunctions={[]}
                  homeId={params.homeId}
                  saveAndExit={false}
                ></FeesForm>
              }
            ></EditPopup>
          </div>
          <div className="flex flex-col gap-5 p-3">
            <div>
              <p>Currency</p>
              <p className="font-semibold text-lg">
                {hostHomeDetails.currency.toUpperCase()}
              </p>
            </div>
            <Separator />
            <div>
              <p>Monthly Rental Fee</p>
              <p className="font-semibold text-lg">
                {hostHomeDetails.currency === "usd" ? "$" : "KES "}
                {FormatCurrency(hostHomeDetails.monthlyFee)}
              </p>
            </div>
            <Separator />
            <div>
              <p>Initial Setup Fee</p>
              {hostHomeDetails.firstTimeFee ? (
                <p className="font-semibold text-lg">
                  {hostHomeDetails.currency === "usd" ? "$" : "KES "}
                  {FormatCurrency(hostHomeDetails.firstTimeFee)}
                </p>
              ) : (
                <p className="font-semibold text-lg">Not provided.</p>
              )}
            </div>
            <Separator />
            <div>
              <p>Initial Setup Fee description</p>
              {hostHomeDetails.firstTimeFee &&
              hostHomeDetails.firstTimeFeeDescription ? (
                <p className="font-semibold text-lg">
                  {hostHomeDetails.firstTimeFeeDescription}
                </p>
              ) : (
                <p className="font-semibold text-lg">No description.</p>
              )}
            </div>
            <Separator />
            <div>
              <p>Booking option</p>
              {hostHomeDetails.bookingOption === "request" ? (
                <p className="font-semibold text-lg">
                  Accept or deny booking requests
                </p>
              ) : (
                <p className="font-semibold text-lg">Instant booking</p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-50 border border-slate-300">
          <div className="flex flex-row justify-between items-center">
            <p className="font-bold text-xl">Location</p>
            <EditPopup
              title="Location"
              form={
                <LocationForm
                  backFunctions={[]}
                  submitFunctions={[]}
                  homeId={params.homeId}
                  saveAndExit={false}
                ></LocationForm>
              }
            ></EditPopup>
          </div>
          <p>{hostHomeDetails.city}</p>
          <div className="flex flex-col gap-5 p-3 aspect-[4/3]">
            <Map
              long={hostHomeDetails.longitude}
              lat={hostHomeDetails.latitude}
              scrollToZoom={false}
            />
            <ExpandMap
              longitude={hostHomeDetails.longitude}
              latitude={hostHomeDetails.latitude}
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-50 border border-slate-300">
          <div className="flex flex-row justify-between items-center">
            <p className="font-bold text-xl">House rules and information</p>
            <EditPopup
              title="House rules and information"
              form={
                <HouseRulesAndInformation
                  backFunctions={[]}
                  submitFunctions={[]}
                  homeId={params.homeId}
                  saveAndExit={false}
                ></HouseRulesAndInformation>
              }
            ></EditPopup>
          </div>
          <div className="flex flex-col gap-5 p-3">
            <div>
              <p>Events and parties</p>
              {hostHomeDetails.houseRules.eventsAllowed === null ? (
                <p className="font-semibold text-lg">Not specified.</p>
              ) : !hostHomeDetails.houseRules.eventsAllowed ? (
                <p className="font-semibold text-lg">Not allowed</p>
              ) : (
                <p className="font-semibold text-lg">Allowed</p>
              )}
            </div>
            <Separator />
            <div>
              <p>Pets</p>
              {hostHomeDetails.houseRules.petsAllowed === null ? (
                <p className="font-semibold text-lg">Not specified.</p>
              ) : !hostHomeDetails.houseRules.petsAllowed ? (
                <p className="font-semibold text-lg">Not allowed</p>
              ) : (
                <p className="font-semibold text-lg">Allowed</p>
              )}
            </div>
            <Separator />
            <div>
              <p>Smoking</p>
              {hostHomeDetails.houseRules.smokingAllowed === null ? (
                <p className="font-semibold text-lg">Not specified.</p>
              ) : !hostHomeDetails.houseRules.smokingAllowed ? (
                <p className="font-semibold text-lg">Not allowed</p>
              ) : (
                <p className="font-semibold text-lg">Allowed</p>
              )}
            </div>
            <Separator />
            <div>
              <p>Quiet hours</p>
              {hostHomeDetails.houseRules.startOfQuietHours !== null &&
              hostHomeDetails.houseRules.endOfQuietHours !== null ? (
                <p className="font-semibold text-lg">
                  From {hostHomeDetails.houseRules.startOfQuietHours} to{" "}
                  {hostHomeDetails.houseRules.endOfQuietHours}.
                </p>
              ) : (
                <p className="font-semibold text-lg">Not set.</p>
              )}
            </div>
            <Separator />
            <div>
              <p>Additional rules</p>
              <p className="font-semibold text-lg">
                {hostHomeDetails.houseRules.additionalRules
                  ? hostHomeDetails.houseRules.additionalRules
                  : "No rules were set."}
              </p>
            </div>
            <Separator />
            <div>
              <p>House information</p>
              <p className="font-semibold text-lg">
                {hostHomeDetails.houseRules.houseInformation
                  ? hostHomeDetails.houseRules.houseInformation
                  : "No information was given."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
