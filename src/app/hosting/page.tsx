import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageHomes from "./manageHomes";
import ManageGuests from "./manageGuests";
import Image from "next/image";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import UserHasProfile from "@/api/fetch/checkIfUserHasProfile";

export default async function Hosting() {
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
        <p className="font-bold text-3xl">Hosting</p>
      </div>
      <Tabs defaultValue="My homes" className="flex flex-col w-full">
        <TabsList>
          <TabsTrigger value="My homes" className="w-1/2">
            My homes
          </TabsTrigger>
          <TabsTrigger value="My guests" className="w-1/2">
            Guests and reservations
          </TabsTrigger>
        </TabsList>
        <TabsContent value="My homes">
          <ManageHomes />
        </TabsContent>
        <TabsContent value="My guests">
          <ManageGuests />
        </TabsContent>
      </Tabs>
    </>
  );
}
