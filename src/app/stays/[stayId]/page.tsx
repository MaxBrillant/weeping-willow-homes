import getStayDetails from "@/api/fetch/fetchStayDetails";
import BackButton from "@/app/components/backButton";
import Map, { ExpandMap } from "@/app/components/map";
import { Button } from "@/components/ui/button";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StayDetails({
  params,
}: {
  params: { stayId: number };
}) {
  const stayId = params.stayId;

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const stayDetails = await getStayDetails(supabase, stayId);

  console.log(stayDetails);

  if (stayDetails == undefined) {
    return (
      <div className="flex flex-col gap-5 p-3 items-center">
        <p>You don't have access to this stay.</p>
        <Link href={"/"}>
          <Button>Search for homes</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div>
        <BackButton />
        <div className="flex flex-row gap-5 p-3 border-b">
          <Image
            src={stayDetails.home.coverPhotoUrl}
            alt={stayDetails.home.title}
            width={70}
            height={70}
            className="h-fit aspect-square object-cover rounded-xl"
          />
          <div className="flex flex-col gap-2">
            <div>
              <p className="font-semibold text-lg">{stayDetails.home.title}</p>
              <Link
                href={"/homes/" + stayDetails.home.id}
                className="underline"
              >
                See property details
              </Link>
            </div>
            <div>
              <p>Check-in date: {stayDetails.checkInDate.toDateString()}</p>
              <p>Duration: {stayDetails.duration} months</p>
              <p>{stayDetails.guests} guests</p>
              <p className="font-semibold">Status: {stayDetails.status}</p>
            </div>
            <div className="flex flex-row flex-wrap gap-3">
              {(stayDetails.status === "booked" ||
                stayDetails.status === "awaiting-approval") && (
                <Button variant={"outline"}>Edit stay</Button>
              )}
              {(stayDetails.status === "checked-in" ||
                stayDetails.status === "booked" ||
                stayDetails.status === "awaiting-approval") && (
                <Button variant={"outline"}>Cancel stay</Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {(stayDetails.status === "checked-in" ||
        stayDetails.status === "booked") && (
        <div className="flex flex-col p-5 gap-5">
          <div className="p-5 bg-gray-200 rounded-3xl">
            <p className="font-semibold text-lg">Host details</p>
            <div className="flex flex-row gap-5 p-3 border-b">
              <Image
                src={stayDetails.host.profilePicture}
                alt={stayDetails.host.fullName}
                width={50}
                height={50}
                className="h-fit aspect-square object-cover rounded-full"
              />
              <div className="flex flex-col gap-1 items-start">
                <p className="font-semibold text-base">
                  {stayDetails.host.fullName}
                </p>
                <Link href={"/users/" + stayDetails.host.id + "/profile"}>
                  <Button
                    variant={"link"}
                    className="underline p-0 h-fit w-fit"
                  >
                    See profile
                  </Button>
                </Link>
                <div className="flex flex-row flex-wrap gap-3">
                  <Button>Call at {stayDetails.host.phoneNumber}</Button>
                  <Button variant={"outline"}>
                    Email at {stayDetails.host.emailAddress}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 bg-gray-200 rounded-3xl">
            <p className="font-semibold text-lg">Property location</p>
            <div className="rounded-2xl">
              <div className="flex flex-col gap-0 w-full aspect-[4/3]">
                <Map
                  long={stayDetails.location.longitude}
                  lat={stayDetails.location.latitude}
                />
                <ExpandMap
                  longitude={stayDetails.location.longitude}
                  latitude={stayDetails.location.latitude}
                />
              </div>
            </div>
          </div>
          <div className="p-5 bg-gray-200 rounded-3xl">
            <p className="font-semibold text-lg">House rules</p>
            {stayDetails.houseRules.eventsAllowed !== null &&
              (stayDetails.houseRules.eventsAllowed ? (
                <p>Events and parties are allowed.</p>
              ) : (
                <p>Events and parties are NOT allowed.</p>
              ))}
            {stayDetails.houseRules.petsAllowed !== null &&
              (stayDetails.houseRules.petsAllowed ? (
                <p>Pets are allowed.</p>
              ) : (
                <p>Pets are NOT allowed.</p>
              ))}
            {stayDetails.houseRules.smokingAllowed !== null &&
              (stayDetails.houseRules.smokingAllowed ? (
                <p>Smoking is allowed.</p>
              ) : (
                <p>Smoking is NOT allowed.</p>
              ))}
            {stayDetails.houseRules.startOfQuietHours !== null &&
              stayDetails.houseRules.endOfQuietHours !== null && (
                <p>
                  Quiet hours: from {stayDetails.houseRules.startOfQuietHours}{" "}
                  to {stayDetails.houseRules.endOfQuietHours}.
                </p>
              )}
            {stayDetails.houseRules.additionalRules && (
              <p>Additional Rules: {stayDetails.houseRules.additionalRules}</p>
            )}
          </div>
          {stayDetails.houseRules.houseInformation && (
            <div className="p-5 bg-gray-200 rounded-3xl">
              <p className="font-semibold text-lg">House information</p>
              <p>{stayDetails.houseRules.houseInformation}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
