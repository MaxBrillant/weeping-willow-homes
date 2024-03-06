import getAllHostHomes from "@/api/fetch/fetchHostHomes";
import { Button } from "@/components/ui/button";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ManageHomes() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const hostHomes = await getAllHostHomes(supabase);
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
        {hostHomes.map((home) => (
          <Link key={home.id} href={"/hosting/homes/" + home.id}>
            <div className="flex flex-row gap-5 p-3">
              <Image
                src={home.coverPhotoUrl}
                alt={home.title}
                width={150}
                height={150}
                className="h-fit aspect-[3:2] object-cover rounded-xl"
              />
              <div className="flex flex-col justify-center">
                <p className="font-semibold text-lg">{home.title}</p>
                <p className="font-medium">{home.city}</p>
                <p>{home.status}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
