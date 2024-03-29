import Image from "next/image";
import Icon from "../../icons/search.svg";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { getUserBasicInfo } from "@/api/fetch/fetchUserProfile";
import SignOutButton from "../components/signOutButton";
import UserHasProfile from "@/api/fetch/checkIfUserHasProfile";

export default async function Account() {
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
  if (session.user.id != undefined) {
    const basicInfo = await getUserBasicInfo(session.user.id);

    if (basicInfo == undefined) {
      //TODO Collect the user's information
      return;
    }
    return (
      <>
        <div className="py-3 px-10 border-b-2">
          <p className="font-bold text-3xl">Account</p>
        </div>
        <div className="flex flex-col gap-5 px-3 py-7 items-center">
          <div className="w-full flex flex-row gap-5 p-5 rounded-3xl">
            <Image
              src={basicInfo?.profilePicture}
              width={50}
              height={50}
              alt="Profile picture"
              className="w-[50px] h-[50px] object-cover rounded-full"
            />
            <Link
              href={"/users/" + basicInfo?.id + "/profile"}
              className="flex flex-row w-full justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg">{basicInfo?.fullName}</p>
                <p>See your profile</p>
              </div>
              <Icon className={"w-5 h-5"} />
            </Link>
          </div>
          <div className="w-full flex flex-row gap-5 px-10 items-center rounded-3xl bg-slate-200">
            <Icon className={"w-40 h-40"} />
            <p className="font-semibold text-lg">
              Turn your Home or Property into a Weeping Willow Home and start
              earning
            </p>
          </div>
          <Link
            href={"/users/payout"}
            className="flex flex-row w-full p-3 justify-between"
          >
            <div>
              <p className="font-semibold text-lg">Payout</p>
              <p>Manage how you get paid for hosting guests.</p>
            </div>
            <Icon className={"w-5 h-5"} />
          </Link>
          <SignOutButton />
        </div>
      </>
    );
  }
}
