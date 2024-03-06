import { getUrlSearchFilters } from "@/api/fetch/urlSearchFilters";
import TopBar from "../components/topBar";
import { URLSearchParams } from "url";
import { getListOfHomes } from "@/api/fetch/fetchHomes";
import Home from "../components/home";
import LoadMoreHomes from "../components/loadMoreHomes";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SearchHomes({
  searchParams,
}: {
  searchParams: URLSearchParams;
}) {
  const filters = getUrlSearchFilters(searchParams);
  const homes = await getListOfHomes(filters, 0);

  if (homes.length === 0) {
    return (
      <div className="flex flex-col flex-grow">
        <TopBar />
        <div className="w-full p-10 flex flex-col items-center gap-3 flex-grow">
          <p>No results have been found that match those filters.</p>
          <Link
            href={
              "/search?city=" +
              filters.city +
              "&start-date=" +
              filters.date +
              "&duration=" +
              filters.duration
            }
          >
            <Button>Search with no filters</Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-grow">
      <TopBar />
      <div className="w-full p-2 flex flex-col gap-5 flex-grow">
        <div className="w-full p-5 flex flex-wrap gap-10">
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
          <LoadMoreHomes
            initialData={homes}
            searchParams={searchParams}
            dataLength={10}
          />
        </div>
      </div>
    </div>
  );
}
