"use client";
import Image from "next/image";
import FilterSelection from "./filterSelection";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import HomeSearch from "./homeSearch";

export default function TopBar() {
  const searchParams = useSearchParams();

  return (
    <div className="sticky top-0 w-full max-h-full overflow-auto bg-white z-50">
      <div className="w-full flex flex-row items-center gap-7 p-2">
        <Image
          src="/logo.png"
          alt="logo"
          width={50}
          height={50}
          className="h-fit border border-black rounded-full"
        />
        <div className="flex flex-col items-center">
          <p className="text-sm">Search for your next home</p>
          <HomeSearch />
        </div>
      </div>
      <div className="w-full text-nowrap flex flex-row overflow-auto gap-5 px-5 py-1">
        <FilterSelection />
        {searchParams.get("currency")?.toString() && (
          <Button variant={"secondary"}>
            {searchParams.get("currency")?.toString()}
          </Button>
        )}
        {searchParams.get("min-price")?.toString() && (
          <Button variant={"secondary"}>
            {searchParams.get("min-price")?.toString()} -{" "}
            {searchParams.get("max-price")?.toString()}
          </Button>
        )}
        {searchParams.get("guests")?.toString() && (
          <Button variant={"secondary"}>
            {searchParams.get("guests")?.toString()} guests
          </Button>
        )}
        {searchParams.get("bedrooms")?.toString() && (
          <Button variant={"secondary"}>
            {searchParams.get("bedrooms")?.toString()} bedrooms
          </Button>
        )}
        {searchParams.get("beds")?.toString() && (
          <Button variant={"secondary"}>
            {searchParams.get("beds")?.toString()} beds
          </Button>
        )}
        {searchParams.get("private-bathrooms")?.toString() && (
          <Button variant={"secondary"}>
            {searchParams.get("private-bathrooms")?.toString()} private
            bathrooms
          </Button>
        )}
        {searchParams.get("shared-bathrooms")?.toString() && (
          <Button variant={"secondary"}>
            {searchParams.get("shared-bathrooms")?.toString()} shared bathrooms
          </Button>
        )}
      </div>
    </div>
  );
}
