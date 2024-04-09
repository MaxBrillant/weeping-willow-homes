import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import CityShowcase from "./components/cityShowcase";
import { FaLocationDot } from "react-icons/fa6";
import SparksIcon from "../icons/sparks.svg";
import LeafIcon from "../icons/leaf.svg";
import BrandIcon from "../icons/brand.svg";
import HomeIcon from "../icons/home-management.svg";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export default async function Homes() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/hosting");
  }
  return (
    <div className="min-h-full flex flex-col">
      <div className="sticky z-40 bg-white top-0 flex flex-row justify-between p-5">
        <div className="flex flex-row gap-2 items-center">
          <Image
            src="/logo.png"
            alt="logo"
            width={50}
            height={50}
            className="h-fit aspect-square object-cover border border-black rounded-full"
          />
          <p className="font-bold text-base">
            Willow
            <br />
            Homes
          </p>
        </div>
        {!session && (
          <Link href={"/login"}>
            <Button>Log in</Button>
          </Link>
        )}
      </div>
      <div className="flex-grow">
        <div className="relative">
          <Image
            src="/willow-1.png"
            alt="logo"
            width={1000}
            height={1000}
            priority
            loading="eager"
            className="w-full aspect-[9/10] sm:aspect-[5/4] md:aspect-[6/3] lg:aspect-[5/2] object-cover"
          />
          <div className="absolute w-3/4 sm:w-2/3 lg:w-1/2 h-fit flex flex-col m-auto sm:m-8 sm:my-auto left-0 right-0 top-0 bottom-0 space-y-2 p-7 sm:p-8 md:p-9 lg:p-10 backdrop-blur-md bg-white/40 rounded-3xl">
            <p className="font-extrabold text-2xl sm:text-4xl md:text-5xl">
              Premium, top-tier accommodations tailored for long-term residency.
            </p>
            <p className="font-medium sm:text-lg md:text-xl md:font-medium">
              We redefine luxury living and sustainability with a unique
              approach to long-term accommodations and home management.
            </p>
            <Link href={"/become-a-host"}>
              <Button size={"lg"} className="w-fit">
                Start Hosting And Earn
              </Button>
            </Link>
          </div>
        </div>
        <div className=" flex flex-col w-sm gap-3 items-center p-5 py-16 mx-auto">
          <p className="font-semibold text-xl text-center">
            Experience luxury in 11 Cities and Towns Across Kenya
          </p>
          <div className="flex flex-col items-center pt-7 px-5 justify-center bg-white rounded-3xl drop-shadow-2xl">
            <FaLocationDot className="w-12 h-12" />
            <CityShowcase />
          </div>
        </div>
        <div className=" flex flex-col w-full bg-cover bg-[url('/willow-2.png')]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-10 backdrop-blur-md bg-white/0">
            <div className="flex flex-col space-y-2 p-7 backdrop-blur-lg bg-black/30 text-white fill-white rounded-3xl drop-shadow-lg">
              <SparksIcon className="w-20 h-20 object-cover" />
              <p className="font-extrabold text-2xl">Luxury Living</p>
              <p className="font-medium">
                Our elegantly furnished homes seamlessly blend comfort and
                style, offering a refined living experience.
              </p>
            </div>

            <div className="flex flex-col space-y-2 p-7 backdrop-blur-lg bg-black/30 text-white fill-white rounded-3xl drop-shadow-lg">
              <LeafIcon className="w-20 h-20" />
              <p className="font-extrabold text-2xl">
                Environmental Engagement
              </p>
              <p className="font-medium">
                Each guest is presented with a Weeping Willow tree to plant and
                nurture during their stay, fostering the creation of a lasting
                legacy.
              </p>
            </div>

            <div className="flex flex-col space-y-2 p-7 backdrop-blur-lg bg-black/30 text-white fill-white rounded-3xl drop-shadow-lg">
              <BrandIcon className="w-20 h-20" />
              <p className="font-extrabold text-2xl">
                Exclusive Brand Merchandise
              </p>
              <p className="font-medium">
                Premium items available only to our guests, partners, and hosts
                encapsulate the essence of Willow Homes.
              </p>
            </div>

            <div className="flex flex-col space-y-2 p-7 backdrop-blur-lg bg-black/30 text-white fill-white rounded-3xl drop-shadow-lg">
              <HomeIcon className="w-20 h-20" />
              <p className="font-extrabold text-2xl">Personalized Service</p>
              <p className="font-medium">
                Exceptional home management and private compounds care services
                ensure an unforgettable stay.
              </p>
            </div>
          </div>
        </div>

        <div className=" flex flex-col max-w-4xl gap-5 items-center p-5 py-16 mx-auto">
          <p className="font-semibold text-xl text-center text-pretty">
            {`We go beyond the ordinary, offering an experience that combines elegance, sustainability, and a unique legacy.`}
          </p>

          <Link href={"/become-a-host"}>
            <Button size={"lg"} className="w-fit">
              Join us and start earning
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
