import Image from "next/image";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { getUserBasicInfo } from "@/api/fetch/fetchUserProfile";
import SignOutButton from "../components/signOutButton";
import UserHasProfile from "@/api/fetch/checkIfUserHasProfile";
import { Separator } from "@/components/ui/separator";
import { IoIosArrowForward } from "react-icons/io";

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
        <div className="flex flex-row gap-3 py-3 px-7 items-center">
          <Link href={"/"}>
            <Image
              src="/logo.png"
              alt="logo"
              width={40}
              height={40}
              className="h-fit aspect-square object-cover border border-black rounded-full"
            />
          </Link>
          <p className="font-bold text-3xl">Account</p>
        </div>
        <div className="flex flex-col gap-7 p-7 items-center">
          <div className="w-full flex flex-row gap-5 rounded-3xl">
            <Link
              href={"/users/" + basicInfo?.id + "/profile"}
              className="flex flex-row w-full justify-between items-center p-5 rounded-3xl bg-slate-100"
            >
              <Image
                src={basicInfo?.profilePicture}
                width={50}
                height={50}
                alt="Profile picture"
                className="w-[50px] aspect-square object-cover rounded-full mr-3"
              />
              <div className="flex flex-col w-full">
                <p className="font-bold text-lg">{basicInfo?.fullName}</p>
                <p className="font-normal text-sm">See your profile</p>
              </div>
              <IoIosArrowForward className={"w-7 h-7"} />
            </Link>
          </div>
          {/* <Link
            href={"/become-a-host"}
            className="w-full flex flex-row gap-5 p-5 px-10 items-center rounded-3xl bg-slate-100 drop-shadow-2xl border border-slate-300"
          >
            <Icon className={"h-28 w-52"} />
            <p className="font-bold text-lg">
              Turn your Home or Property into a Willow Home and start earning
            </p>
          </Link> */}
          {/* <Link
            href={"/users/payout"}
            className="flex flex-row w-full p-3 justify-between items-center"
          >
            <div>
              <p className="font-bold text-lg">Payout</p>
              <p className="font-normal text-sm">
                Manage how you get paid for hosting guests.
              </p>
            </div>
            <Icon className={"w-5 h-5"} />
          </Link> */}
          {/* <Separator /> */}
          <SignOutButton />
        </div>
      </>
    );
  }
}
