import { Button } from "@/components/ui/button";
import HomeSearch from "./components/homeSearch";
import Link from "next/link";

export default function Homes() {
  return (
    <div className="flex flex-col flex-grow items-center">
      <div>
        <p className="text-2xl font-semibold">Weeping willow Homes</p>
      </div>
      <div className="flex flex-col py-10 px-5 items-center">
        <HomeSearch />
      </div>
      <div>
        <Link href={"/login"}>
          <Button>Sign in</Button>
        </Link>
      </div>
    </div>
  );
}
