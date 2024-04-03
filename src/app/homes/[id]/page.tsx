import { getHomeDetails } from "@/api/fetch/fetchHomeDetails";
import BackButton from "@/app/components/backButton";
import BookCta from "@/app/components/bookCta";
import HomePhotos from "@/app/components/homePhotos";
import Map, { ExpandMap } from "@/app/components/map";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function HomeDetails({
  params,
}: {
  params: { id: number };
}) {
  const homeDetails = await getHomeDetails(params.id);

  const formatLanguages = (languages: string[]): string => {
    if (languages.length === 1) {
      return `Speaks ${languages[0]}`;
    } else if (languages.length === 2) {
      return `Speaks ${languages[0]} and ${languages[1]}`;
    } else {
      // For three or more languages, join all except the last one with a comma, and then add "and" before the last one
      const lastLanguage = languages.pop();
      return `Speaks ${languages.join(", ")} and ${lastLanguage}`;
    }
  };

  if (homeDetails == undefined) {
    return (
      <div className="flex flex-col gap-5 p-3 items-center">
        <p>This home is currently unavailable.</p>
        <Link href={"/"}>
          <Button>Search for homes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-52 sm:pb-0">
      <div className="py-3">
        <BackButton />
        <Link href={"/homes/" + params.id + "/photos"}>
          <HomePhotos photos={homeDetails.photos} />
        </Link>
        <div className="flex flex-row">
          <div className="flex flex-col p-5">
            <p className="font-semibold text-2xl">{homeDetails.title}</p>
            <p>{homeDetails.city}</p>
            <p>
              {homeDetails.numberOfBedrooms}-bedroom{" "}
              {homeDetails.typeOfProperty} - {homeDetails.numberOfGuests} guests
              - {homeDetails.numberOfBeds} beds -{" "}
              {homeDetails.numberOfSharedBathrooms +
                homeDetails.numberOfPrivateBathrooms}{" "}
              bathrooms ({homeDetails.numberOfPrivateBathrooms} private and{" "}
              {homeDetails.numberOfSharedBathrooms} shared)
            </p>
            <Button variant={"outline"} className="mt-3 w-fit">
              Share
            </Button>
          </div>
          <BookCta
            title={homeDetails.title}
            coverPhotoUrl={homeDetails.photos[0]}
            maxGuests={homeDetails.numberOfGuests}
            currency={homeDetails.currency}
            monthlyFee={homeDetails.monthlyFee}
            firstTimeFee={homeDetails.firstTimeFee}
            firstTimeFeeDescription={homeDetails.firstTimeFeeDescription}
            disabledDate={homeDetails.checkOutDate}
          />
        </div>
      </div>
      <div className="w-full flex flex-col gap-7 p-5">
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-200">
          <p className="font-semibold text-2xl">About this home</p>
          <p>{homeDetails.description}</p>
        </div>
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-200">
          <p className="font-semibold text-2xl">
            Facilities and benefits of this home
          </p>
          <div className="flex flex-wrap gap-3">
            {homeDetails.facilities.map((facility) => (
              <div
                key={facility.id}
                className="flex flex-row gap-2 p-2 border border-black rounded-2xl font-semibold text-sm"
              >
                <Image
                  src={facility.iconUrl}
                  width={20}
                  height={20}
                  alt={facility.title}
                />
                {facility.title}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-200">
          <p className="font-semibold text-2xl">Where to find this home</p>
          <div className="flex flex-col gap-0 w-full aspect-[4/3]">
            <Map
              long={homeDetails.longitude}
              lat={homeDetails.latitude}
              scrollToZoom={false}
            />
            <ExpandMap
              longitude={homeDetails.longitude}
              latitude={homeDetails.latitude}
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-200">
          <p className="font-semibold text-2xl">Know your host</p>
          <div className="flex flex-col gap-5">
            <div className="w-full flex flex-row gap-5 p-7 rounded-3xl bg-slate-100 drop-shadow-2xl">
              <Image
                src={homeDetails.userProfile.profilePicture}
                width={100}
                height={100}
                alt="Profile picture"
                className="w-[50px] h-[50px] sm:w-[100px] sm:h-[100px] object-cover rounded-full"
              />
              <div>
                <p className="font-semibold text-lg">
                  {homeDetails.userProfile.fullName}
                </p>
                <p>{homeDetails.userProfile.bio}</p>
              </div>
            </div>
            <div>
              <p>{homeDetails.userProfile.cityAddress}</p>
              <p>{formatLanguages(homeDetails.userProfile.languages)}</p>
              {homeDetails.userProfile.isIdentityVerified && (
                <p className="font-semibold">
                  {`This user's identity has been verified`}
                </p>
              )}
              <Link href={"/users/" + homeDetails.userProfile.id + "/profile"}>
                <Button variant={"link"} className="underline p-0 h-fit w-fit">
                  See profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-1 p-7 rounded-3xl bg-slate-200">
          <p className="font-semibold text-2xl">House rules</p>
          {homeDetails.houseRules.eventsAllowed !== null &&
            (homeDetails.houseRules.eventsAllowed ? (
              <p>Events and parties are allowed.</p>
            ) : (
              <p>Events and parties are NOT allowed.</p>
            ))}
          {homeDetails.houseRules.petsAllowed !== null &&
            (homeDetails.houseRules.petsAllowed ? (
              <p>Pets are allowed.</p>
            ) : (
              <p>Pets are NOT allowed.</p>
            ))}
          {homeDetails.houseRules.smokingAllowed !== null &&
            (homeDetails.houseRules.smokingAllowed ? (
              <p>Smoking is allowed.</p>
            ) : (
              <p>Smoking is NOT allowed.</p>
            ))}
          {homeDetails.houseRules.startOfQuietHours !== null &&
            homeDetails.houseRules.endOfQuietHours !== null && (
              <p>
                Quiet hours: from {homeDetails.houseRules.startOfQuietHours} to{" "}
                {homeDetails.houseRules.endOfQuietHours}.
              </p>
            )}
          {homeDetails.houseRules.additionalRules !== null && (
            <p>Additional rules: {homeDetails.houseRules.additionalRules}</p>
          )}
        </div>
      </div>
    </div>
  );
}
