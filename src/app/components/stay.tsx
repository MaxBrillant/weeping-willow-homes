import Image from "next/image";
import Link from "next/link";

type stayProps = {
  id: number;
  title: string;
  coverPhotoUrl: string;
  checkInDate: Date;
  duration: number;
  status:
    | "checked-in"
    | "awaiting-approval"
    | "request-denied"
    | "booked"
    | "checked-out"
    | "cancelled";
};
export default function Stay(stay: stayProps) {
  return (
    <Link href={"/stays/" + stay.id} className="flex flex-row gap-5 p-3">
      <Image
        src={stay.coverPhotoUrl}
        alt={stay.title}
        width={70}
        height={70}
        className="h-[70px] rounded-xl"
      />
      <div>
        <p className="font-semibold text-lg">{stay.title}</p>
        <p>
          {new Date(stay.checkInDate).toDateString()} - {stay.duration} months
        </p>
        <p className="font-semibold">{stay.status}</p>
      </div>
    </Link>
  );
}
