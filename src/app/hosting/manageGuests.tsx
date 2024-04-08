import UserHasProfile from "@/api/fetch/checkIfUserHasProfile";
import getAllHostguests from "@/api/fetch/fetchHostGuests";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaUserAltSlash } from "react-icons/fa";

export default async function ManageGuests() {
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

  const hostGuests = await getAllHostguests();

  if (hostGuests.length === 0) {
    return (
      <div className="flex flex-col gap-5 p-10 items-center">
        <FaUserAltSlash className="w-32 h-32" />
        <p className="font-medium text-lg">{`You don't have any guests...yet.`}</p>
        <p>{`We will notify you once guests book stays with you.`}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-5">
      {hostGuests.map((guest) => (
        <Link key={guest.id} href={"/hosting/guests/" + guest.id}>
          <div className="flex flex-row gap-5 p-3">
            <Image
              src={guest.coverPhoto}
              alt={guest.guestFullName}
              width={50}
              height={50}
              className="h-fit aspect-square object-cover rounded-full"
            />
            <div>
              <p className="font-semibold text-lg">
                {guest.guestFullName} - {guest.title}
              </p>
              <p>
                {guest.checkInDate.toDateString()} - {guest.duration} months
              </p>
              <p className="font-semibold">{guest.status}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
