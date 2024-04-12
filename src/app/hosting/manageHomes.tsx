import getAllHostHomes from "@/api/fetch/fetchHostHomes";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import { TbHomeOff } from "react-icons/tb";
import { BsHourglassSplit } from "react-icons/bs";
import { MdAddHome } from "react-icons/md";

export default async function ManageHomes() {
  const hostHomes = await getAllHostHomes();

  if (hostHomes.length === 0) {
    return (
      <div className="flex flex-col gap-5 p-10 items-center">
        <TbHomeOff className="w-32 h-32" />
        <p className="font-medium text-lg">
          You are not hosting on this platform...yet.
        </p>
        <Link href={"/become-a-host"}>
          <Button>Start hosting and earn</Button>
        </Link>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-row w-full py-7 justify-end p-1">
        <Link href={"/become-a-host"}>
          <Button variant={"ghost"}>
            <MdAddHome className="w-7 h-7 mr-2" />
            Create a new Willow Home
          </Button>
        </Link>
      </div>
      <div className="flex flex-col p-5 bg-slate-50 rounded-3xl divide-y-2 divide-slate-200">
        {hostHomes.map((home) =>
          home.status === "completed" || home.status === "verified" ? (
            <Link key={home.id} href={"/hosting/homes/" + home.id}>
              <div className="flex flex-row gap-5 p-3 py-7 items-start">
                <Image
                  src={home.coverPhotoUrl as string}
                  alt={home.title}
                  width={150}
                  height={150}
                  className="w-40 aspect-[3/2] object-cover rounded-xl"
                />
                <div className="flex flex-col gap-2 justify-center">
                  <p className="font-bold text-lg">{home.title}</p>
                  <p className="font-normal text-sm">{home.city}</p>
                  <p
                    className={
                      home.status === "verified"
                        ? "bg-green-500 border border-green-600 text-white text-sm font-medium w-fit py-1 px-3 rounded-full"
                        : "bg-gray-500 border border-gray-600 text-white text-sm font-medium w-fit py-1 px-3 rounded-full"
                    }
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <div className="w-2 aspect-square bg-white rounded-full"></div>
                      {home.status === "verified"
                        ? home.status
                        : `not verified yet`}
                    </div>
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div
              key={home.id}
              className="flex flex-row gap-5 p-3 py-7 items-start"
            >
              <div className="flex flex-col items-center justify-center w-32 p-3 aspect-square bg-slate-200 rounded-3xl">
                <BsHourglassSplit className="w-20 h-20 p-3 bg-slate-200 items-center" />
              </div>
              <div className="w-full flex flex-col justify-center gap-3">
                <p className="font-bold text-lg">{home.title}</p>
                <div className="w-full max-w-60 flex flex-row gap-2 items-center">
                  <p className="font-normal text-sm">
                    {Math.round(
                      (((home.creationProgress as number) + 1) / 7) * 100
                    )}
                    %
                  </p>
                  <Progress
                    className="border border-slate-300"
                    value={(((home.creationProgress as number) + 1) / 7) * 100}
                  />
                </div>
                <Link
                  href={
                    "become-a-host/" +
                    home.id +
                    "?step=" +
                    home.creationProgress
                  }
                >
                  <Button variant={"secondary"}>Resume home creation</Button>
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
