import getHostGuestsDetaills from "@/api/fetch/fetchHostGuestsDetails";
import BackButton from "@/app/components/backButton";
import { Button } from "@/components/ui/button";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function GuestPage({
  params,
}: {
  params: { guestId: number };
}) {
  const stayId = params.guestId;

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const guestDetails = await getHostGuestsDetaills(supabase, stayId);

  console.log(guestDetails);

  if (guestDetails == undefined) {
    return (
      <div className="flex flex-col gap-5 p-3 items-center">
        <p>You don't have access to information about this guest.</p>
        <Link href={"/hosting"}>
          <Button>Go to the hosting page</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div>
        <BackButton />
        <div className="flex flex-row gap-5 p-3 border-b">
          <div className="flex flex-col items-center gap-1">
            <Image
              src={guestDetails?.guest.profilePicture}
              alt={guestDetails.guest.fullName}
              width={50}
              height={50}
              className="aspect-square object-cover rounded-full"
            />
            <div className="w-[3px] h-7 bg-slate-500"></div>
            <Image
              src={guestDetails.home.coverPhotoUrl}
              alt={guestDetails.home.title}
              width={70}
              height={70}
              className="aspect-square object-cover rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <p className="font-semibold text-lg">
                {guestDetails.guest.fullName} - {guestDetails.home.title}
              </p>
              <Link href={"/users/" + guestDetails.guest.id + "/profile"}>
                <Button variant={"link"} className="underline p-0 h-fit w-fit">
                  See profile
                </Button>
              </Link>
            </div>
            <div>
              <p>Check-in date: {guestDetails.checkInDate.toDateString()}</p>
              <p>Duration: {guestDetails.duration} months</p>
              <p>3 guests</p>
              <p className="font-semibold">Status: {guestDetails.status}</p>
            </div>
            <div className="flex flex-row flex-wrap gap-3">
              <Button>Call at {guestDetails.guest.phoneNumber}</Button>
              <Button variant={"outline"}>
                Email at {guestDetails.guest.emailAddress}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {guestDetails.status === "awaiting-approval" && (
        <div className=" flex flex-col w-full gap-3 p-5 mt-5 bg-gray-200 rounded-3xl">
          <p className="font-semibold text-lg">
            You have received a booking request from this user.
          </p>
          <p className="font-normal text-base">
            The request was sent on Jan 20 2024 at 3:37PM. You have{" "}
            <b>24 hours</b> to accept this request or it will be automatically
            denied.
          </p>
          <div className="flex flex-row flex-wrap gap-3">
            <Button>Accept the request</Button>
            <Button variant={"destructive"}>Deny the request</Button>
          </div>
        </div>
      )}
    </>
  );
}
