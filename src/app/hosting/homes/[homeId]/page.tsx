import { Button } from "@/components/ui/button";
import Link from "next/link";
import Map, { ExpandMap } from "@/app/components/map";
import BackButton from "@/app/components/backButton";
import getHostHomeDetails from "@/api/fetch/fetchHostHomeDetails";
import { cookies, headers } from "next/headers";
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

export default async function Home({ params }: { params: { homeId: number } }) {
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
      <div className="flex flex-col gap-5 p-3 items-center">
        <p>{`You don't have access to this home.`}</p>
        <Link href={"/become-a-host"}>
          <Button>Start hosting and earning</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row gap-5 py-3 border-b-2">
        <BackButton />
        <p className="font-bold text-3xl">Home overview</p>
      </div>
      <div className="w-full flex flex-col gap-7 p-5">
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-200">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-2xl">Property details</p>
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
              <p className="font-medium text-lg">Title</p>
              <p>{hostHomeDetails.title}</p>
            </div>
            <div>
              <p className="font-medium text-lg">Type of property</p>
              <p>{hostHomeDetails.typeOfProperty}</p>
            </div>
            <div>
              <p className="font-medium text-lg">Description</p>
              <p>{hostHomeDetails.description}</p>
            </div>
            <div>
              <p className="font-medium text-lg">Property size</p>
              {hostHomeDetails.propertySize ? (
                <p>{hostHomeDetails.propertySize} square meters</p>
              ) : (
                <p>Not provided.</p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-200">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-2xl">Accommodation</p>
            <EditPopup
              title="Accommodation"
              form={
                <AccommodationForm
                  backFunctions={[]}
                  submitFunctions={[]}
                  homeId={params.homeId}
                ></AccommodationForm>
              }
            ></EditPopup>
          </div>
          <div className="flex flex-col gap-5 p-3">
            <div>
              <p className="font-medium text-lg">Number of guests</p>
              <p>{hostHomeDetails.numberOfGuests} guests</p>
            </div>
            <div>
              <p className="font-medium text-lg">Number of bedrooms</p>
              <p>{hostHomeDetails.numberOfBedrooms} bedrooms</p>
            </div>
            <div>
              <p className="font-medium text-lg">Number of beds</p>
              <p>{hostHomeDetails.numberOfBeds} beds</p>
            </div>
            <div>
              <p className="font-medium text-lg">Number of bathrooms</p>
              <p>{hostHomeDetails.numberOfPrivateBathrooms} private bathroom</p>
              <p>{hostHomeDetails.numberOfSharedBathrooms} shared bathroom</p>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-200">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-2xl">Photos</p>
            <EditPopup
              title="Photos"
              form={
                <PhotosForm
                  backFunctions={[]}
                  submitFunctions={[]}
                  homeId={params.homeId}
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
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-200">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-2xl">Facilities and features</p>
            <EditPopup
              title="Facilities and features"
              form={
                <FacilitiesAndFeaturesForm
                  backFunctions={[]}
                  submitFunctions={[]}
                  homeId={params.homeId}
                ></FacilitiesAndFeaturesForm>
              }
            ></EditPopup>
          </div>
          <div className="flex flex-col gap-5 p-3">
            <div className="flex flex-col gap-5 p-3">
              {hostHomeDetails.facilities.map((facility) => (
                <div
                  key={facility.id}
                  className="flex flex-row gap-3 items-center"
                >
                  <Image
                    src={facility.iconUrl}
                    width={20}
                    height={20}
                    alt={facility.title}
                  />
                  <p>{facility.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-200">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-2xl">Fees information</p>
            <EditPopup
              title="Fees information"
              form={
                <FeesForm
                  backFunctions={[]}
                  submitFunctions={[]}
                  homeId={params.homeId}
                ></FeesForm>
              }
            ></EditPopup>
          </div>
          <div className="flex flex-col gap-5 p-3">
            <div>
              <p className="font-medium text-lg">Currency</p>
              <p>{hostHomeDetails.currency.toUpperCase()}</p>
            </div>
            <div>
              <p className="font-medium text-lg">Monthly fee</p>
              <p>
                {hostHomeDetails.currency.toUpperCase()}{" "}
                {hostHomeDetails.monthlyFee}
              </p>
            </div>
            <div>
              <p className="font-medium text-lg">First-time fee</p>
              {hostHomeDetails.firstTimeFee ? (
                <p>
                  {hostHomeDetails.currency.toUpperCase()}{" "}
                  {hostHomeDetails.firstTimeFee}
                </p>
              ) : (
                <p>Not provided.</p>
              )}
            </div>
            <div>
              <p className="font-medium text-lg">First-time fee description</p>
              {hostHomeDetails.firstTimeFeeDescription ? (
                <p>{hostHomeDetails.firstTimeFeeDescription}</p>
              ) : (
                <p>No description.</p>
              )}
            </div>
            <div>
              <p className="font-medium text-lg">Booking option</p>
              {hostHomeDetails.bookingOption === "request" ? (
                <p>Accept or deny booking requests</p>
              ) : (
                <p>Instant booking</p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-200">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-2xl">Location</p>
            <EditPopup
              title="Location"
              form={
                <LocationForm
                  backFunctions={[]}
                  submitFunctions={[]}
                  homeId={params.homeId}
                ></LocationForm>
              }
            ></EditPopup>
          </div>
          <p>{hostHomeDetails.city}</p>
          <div className="flex flex-col gap-5 p-3 aspect-[4/3]">
            <Map
              long={hostHomeDetails.longitude}
              lat={hostHomeDetails.latitude}
            />
            <ExpandMap
              longitude={hostHomeDetails.longitude}
              latitude={hostHomeDetails.latitude}
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-200">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-2xl">
              House rules and information
            </p>
            <EditPopup
              title="House rules and information"
              form={
                <HouseRulesAndInformation
                  backFunctions={[]}
                  submitFunctions={[]}
                  homeId={params.homeId}
                ></HouseRulesAndInformation>
              }
            ></EditPopup>
          </div>
          <div className="flex flex-col gap-5 p-3">
            <div>
              <p className="font-medium text-lg">Events and parties</p>
              {hostHomeDetails.houseRules.eventsAllowed === null ? (
                <p>Not specified.</p>
              ) : !hostHomeDetails.houseRules.eventsAllowed ? (
                <p>Not allowed</p>
              ) : (
                <p>Allowed</p>
              )}
            </div>
            <div>
              <p className="font-medium text-lg">Pets</p>
              {hostHomeDetails.houseRules.petsAllowed === null ? (
                <p>Not specified.</p>
              ) : !hostHomeDetails.houseRules.petsAllowed ? (
                <p>Not allowed</p>
              ) : (
                <p>Allowed</p>
              )}
            </div>
            <div>
              <p className="font-medium text-lg">Smoking</p>
              {hostHomeDetails.houseRules.smokingAllowed === null ? (
                <p>Not specified.</p>
              ) : !hostHomeDetails.houseRules.smokingAllowed ? (
                <p>Not allowed</p>
              ) : (
                <p>Allowed</p>
              )}
            </div>
            <div>
              <p className="font-medium text-lg">Quiet hours</p>
              {hostHomeDetails.houseRules.startOfQuietHours !== null &&
              hostHomeDetails.houseRules.endOfQuietHours !== null ? (
                <p>
                  From {hostHomeDetails.houseRules.startOfQuietHours} to{" "}
                  {hostHomeDetails.houseRules.endOfQuietHours}.
                </p>
              ) : (
                <p>Not set.</p>
              )}
            </div>
            <div>
              <p className="font-medium text-lg">Additional rules</p>
              <p>
                {hostHomeDetails.houseRules.additionalRules
                  ? hostHomeDetails.houseRules.additionalRules
                  : "No rules were set."}
              </p>
            </div>
            <div>
              <p className="font-medium text-lg">House information</p>
              <p>
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
