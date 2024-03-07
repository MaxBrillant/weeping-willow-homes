import getListOfStays from "@/api/fetch/fetchStays";
import Stay from "../components/stay";
import { cookies, headers } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Stays() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const headersList = headers();
    redirect(`/login?redirect-to=${headersList.get("x-pathname")}`);
  }

  const stays = await getListOfStays(supabase);

  if (stays.length === 0) {
    return (
      <>
        <div className="py-3 px-10 border-b-2">
          <p className="font-bold text-3xl">My stays</p>
        </div>
        <div className="flex flex-col gap-5 p-3 items-center">
          <p>No stays have been booked yet. Booked stays will appear here.</p>
          <Link href={"/"}>
            <Button>Search for homes</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="py-3 px-10 border-b-2">
        <p className="font-bold text-3xl">My stays</p>
      </div>
      <div className="flex flex-col gap-5 p-3 items-center">
        {stays.map((stayItem) => {
          return (
            <Stay
              key={stayItem.id}
              id={stayItem.id}
              title={stayItem.title}
              coverPhotoUrl={stayItem.coverPhoto}
              checkInDate={stayItem.checkInDate}
              duration={stayItem.duration}
              status={stayItem.status}
            />
          );
        })}
      </div>
    </>
  );
}
