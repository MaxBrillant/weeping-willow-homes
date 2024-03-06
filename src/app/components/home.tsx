import Image from "next/image";
import HomeCarousel from "./homeCarousel";
import Link from "next/link";

type homeProps = {
  id: number;
  title: string;
  city: string;
  typeOfProperty: string;
  numberOfGuests: number;
  numberOfBedrooms: number;
  numberOfBeds: number;
  checkInDate: Date;
  duration: number;
  currency: "usd" | "kes";
  monthlyFee: number;
  photos: Array<string>;
  facilities: { id: number; title: string; iconUrl: string }[];
  guestsParams: number | undefined;
};
export default function Home(home: homeProps) {
  const date =
    home.checkInDate.getFullYear() +
    "-" +
    (home.checkInDate.getMonth() + 1) +
    "-" +
    home.checkInDate.getDate();
  return (
    <div className="flex flex-col w-full sm:w-[350px]  p-5 gap-3 border-2 border-gray-500 rounded-2xl hover:bg-slate-300">
      <HomeCarousel imageList={home.photos} />
      <Link
        href={
          home.guestsParams == undefined
            ? "/homes/" +
              home.id +
              "?start-date=" +
              date +
              "&duration=" +
              home.duration
            : "/homes/" +
              home.id +
              "?start-date=" +
              date +
              "&duration=" +
              home.duration +
              "&guests=" +
              home.guestsParams
        }
      >
        <div className="flex flex-col">
          <p className="font-semibold text-lg">{home.title}</p>
          <p>{home.city}</p>
        </div>
        <div className="text-gray-500">
          <p>
            {home.numberOfBedrooms}-bedroom {home.typeOfProperty} {" - "}
            {home.numberOfBeds} beds {" - "}
            {home.numberOfGuests} guests
          </p>
          <p>
            {home.checkInDate.getMonth() + 1} {home.checkInDate.getDate()}{" "}
            {" - "}
            {home.duration} months
          </p>
        </div>
        <div className="flex flex-row gap-1 flex-wrap">
          {home.facilities.map((facility) => {
            return (
              <div key={facility.id} className="bg-slate-100 p-1 rounded-full">
                <Image
                  width={20}
                  height={20}
                  src={facility.iconUrl}
                  alt={facility.title}
                />
              </div>
            );
          })}
        </div>
        <div className="flex flex-row gap-3">
          <p className="font-extrabold text-lg">
            {home.currency.toUpperCase()}
          </p>
          <p className="font-extrabold text-lg">{home.monthlyFee}</p>
          <p>/month</p>
        </div>
      </Link>
    </div>
  );
}
