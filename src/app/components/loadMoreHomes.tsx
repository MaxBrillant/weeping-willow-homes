"use client";
import { getListOfHomes, homesType } from "@/api/fetch/fetchHomes";
import { useState } from "react";
import Home from "./home";
import { getUrlSearchFilters } from "@/api/fetch/urlSearchFilters";
import { URLSearchParams } from "url";
import { Button } from "@/components/ui/button";

type PropsType = {
  initialData: homesType;
  searchParams: URLSearchParams;
  dataLength: number;
};
export default function LoadMoreHomes(props: PropsType) {
  const [homes, setHomes] = useState<homesType>([]);
  const [hasMore, setHasMore] = useState(
    props.initialData.length >= props.dataLength
  );
  const [pageNumber, setPageNumber] = useState(1);

  const filters = getUrlSearchFilters(props.searchParams);

  const loadMoreHomes = async () => {
    const newHomes = await getListOfHomes(filters, pageNumber);
    setPageNumber(pageNumber + 1);
    setHomes([...homes, ...newHomes]);
    if (newHomes.length < props.dataLength) setHasMore(false);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-wrap gap-10">
        {homes.map((home) => {
          return (
            <Home
              key={home.id}
              id={home.id}
              title={home.title}
              city={home.city}
              typeOfProperty={home.typeOfProperty}
              numberOfGuests={home.numberOfGuests}
              numberOfBedrooms={home.numberOfBedrooms}
              numberOfBeds={home.numberOfBeds}
              checkInDate={new Date(home.checkInDate)}
              duration={home.duration}
              currency={home.currency}
              monthlyFee={home.monthlyFee}
              photos={home.photos}
              facilities={home.facilities}
              guestsParams={filters.guests}
            />
          );
        })}
      </div>
      {hasMore && (
        <Button onClick={loadMoreHomes} className="w-fit mx-auto">
          Load more homes
        </Button>
      )}
    </div>
  );
}
