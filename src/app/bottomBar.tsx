"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchIcon from "../icons/search.svg";
import HouseIcon from "../icons/house.svg";
import KeysIcon from "../icons/keys.svg";
import AccountIcon from "../icons/account.svg";

export default function BottomBar() {
  let pathName = usePathname();
  if (
    pathName === "/" ||
    pathName.includes("/search") ||
    pathName.includes("/stays") ||
    pathName.includes("/hosting") ||
    pathName.includes("/users") ||
    pathName === "/account"
  ) {
    return (
      <div className="sticky bottom-0 w-full flex align-bottom flex-row justify-center gap-10  items-center p-1 bg-white">
        <Link
          href={"/"}
          className={
            pathName !== "/"
              ? "flex flex-col items-center"
              : "bg-gray-300 rounded-xl px-2 py-1 flex flex-col items-center"
          }
        >
          <SearchIcon className={"w-7 h-7 fill-blue-500"} />
          <p>Explore</p>
        </Link>
        <Link
          href={"/hosting"}
          className={
            pathName !== "/hosting"
              ? "flex flex-col items-center"
              : "bg-gray-300 rounded-xl px-2 py-1 flex flex-col items-center"
          }
        >
          <HouseIcon className={"w-7 h-7 fill-blue-500"} />
          <p>Hosting</p>
        </Link>
        <Link
          href={"/stays"}
          className={
            pathName !== "/stays"
              ? "flex flex-col items-center"
              : "bg-gray-300 rounded-xl px-2 py-1 flex flex-col items-center"
          }
        >
          <KeysIcon className={"w-7 h-7 fill-blue-500"} />
          <p>My stays</p>
        </Link>
        <Link
          href={"/account"}
          className={
            pathName !== "/account"
              ? "flex flex-col items-center"
              : "bg-gray-300 rounded-xl px-2 py-1 flex flex-col items-center"
          }
        >
          <AccountIcon className={"w-7 h-7 fill-blue-500"} />
          <p>Account</p>
        </Link>
      </div>
    );
  }
}
