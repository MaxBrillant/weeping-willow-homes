"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoHome, GoHomeFill } from "react-icons/go";
import { RiAccountCircleFill, RiAccountCircleLine } from "react-icons/ri";

export default function BottomBar() {
  let pathName = usePathname();
  if (
    pathName === "/" ||
    pathName.includes("/search") ||
    pathName.includes("/stays") ||
    pathName === "/hosting" ||
    pathName === "/account"
  ) {
    return (
      <div className="sticky bottom-0 w-full flex align-bottom flex-row justify-center gap-10 p-3  items-center bg-white">
        <Link
          href={"/hosting"}
          className={
            pathName !== "/hosting"
              ? "flex flex-col items-center"
              : "bg-gray-300 rounded-xl px-2 py-1 flex flex-col items-center"
          }
        >
          {pathName !== "/hosting" ? (
            <GoHome className="w-7 h-7" />
          ) : (
            <GoHomeFill className="w-7 h-7" />
          )}
          <p className={pathName !== "/hosting" ? "font-medium" : "font-bold"}>
            Hosting
          </p>
        </Link>
        {/* <Link
          href={"/stays"}
          className={
            pathName !== "/stays"
              ? "flex flex-col items-center"
              : "bg-gray-300 rounded-xl px-2 py-1 flex flex-col items-center"
          }
        >
          <KeysIcon className={"w-7 h-7 fill-blue-500"} />
          <p>My stays</p>
        </Link> */}
        <Link
          href={"/account"}
          className={
            pathName !== "/account"
              ? "flex flex-col items-center"
              : "bg-gray-300 rounded-xl px-2 py-1 flex flex-col items-center"
          }
        >
          {pathName !== "/account" ? (
            <RiAccountCircleLine className="w-7 h-7" />
          ) : (
            <RiAccountCircleFill className="w-7 h-7" />
          )}
          <p className={pathName !== "/account" ? "font-medium" : "font-bold"}>
            Account
          </p>
        </Link>
      </div>
    );
  }
}
