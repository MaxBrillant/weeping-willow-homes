import UserHasProfile from "@/api/fetch/checkIfUserHasProfile";
import getAllHostHomes from "@/api/fetch/fetchHostHomes";
import { Button } from "@/components/ui/button";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ManageHomes() {
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

  const hostHomes = await getAllHostHomes();
  console.log(hostHomes);

  if (hostHomes.length === 0) {
    return (
      <div className="flex flex-col gap-5 p-3 items-center">
        <p>You are not hosting on this platform...yet.</p>
        <Link href={"/become-a-host"}>
          <Button>Start hosting and earning now</Button>
        </Link>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-row w-full justify-end p-1">
        <Button>Add a new home</Button>
      </div>
      <div className="flex flex-col gap-3 p-5">
        {hostHomes.map((home) =>
          home.status === "completed" || home.status === "verified" ? (
            <Link key={home.id} href={"/hosting/homes/" + home.id}>
              <div className="flex flex-row gap-5 p-3">
                <Image
                  src={home.coverPhotoUrl as string}
                  alt={home.title}
                  width={150}
                  height={150}
                  className="w-40 aspect-[3/2] object-cover rounded-xl"
                />
                <div className="flex flex-col justify-center">
                  <p className="font-semibold text-lg">{home.title}</p>
                  <p className="font-medium">{home.city}</p>
                  <p>{home.status}</p>
                </div>
              </div>
            </Link>
          ) : (
            <div key={home.id} className="flex flex-row gap-5 p-3">
              <div className="flex flex-col items-center justify-center w-20 h-20 rounded-xl bg-slate-300">
                <p>Pending</p>
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-semibold text-lg">{home.title}</p>
                <p>
                  You are on step {(home.creationProgress as number) + 1} out of
                  the 7 steps required to create a home.
                </p>
                <Link
                  href={
                    "become-a-host/" +
                    home.id +
                    "?step=" +
                    home.creationProgress
                  }
                >
                  <Button>Resume home creation</Button>
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
