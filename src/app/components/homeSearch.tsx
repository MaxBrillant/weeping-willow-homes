"use client";
import { useState } from "react";
import SearchIcon from "../../icons/search.svg";
import SearchSelection from "./searchSelection";
import { useSearchParams } from "next/navigation";

export default function HomeSearch() {
  const [selectedStep, setSelectedStep] = useState(0);
  const [isOpened, setIsOpened] = useState(false);

  const searchParams = useSearchParams();

  const [searchedCity, setSearchedCity] = useState(
    searchParams.get("city")?.toString()
  );
  const [searchedDate, setSearchedDate] = useState(
    searchParams.get("start-date")?.toString()
  );
  const [searchedDuration, setSearchedDuration] = useState<number | undefined>(
    searchParams.get("duration")?.toString() != undefined
      ? Number(searchParams.get("duration")?.toString())
      : undefined
  );

  return (
    <div>
      <div className="flex flex-row w-fit items-center  border border-black rounded-full">
        <SearchIcon className="w-10 h-10 pl-3 pr-1" />
        <button
          className={
            isOpened && selectedStep === 0
              ? "bg-gray-300 flex flex-col items-center px-4 py-2 rounded-full"
              : "flex flex-col items-center px-4 py-2 rounded-full"
          }
          onClick={() => {
            setSelectedStep(0);
            setIsOpened(true);
          }}
        >
          <p className="text-xs">Where</p>
          {searchedCity != undefined ? <p>{searchedCity}</p> : <p>Anywhere</p>}
        </button>
        <p>|</p>
        <button
          className={
            isOpened && (selectedStep === 1 || selectedStep === 2)
              ? "bg-gray-300 flex flex-col items-center px-4 py-2 rounded-full"
              : "flex flex-col items-center px-4 py-2 rounded-full"
          }
          onClick={() => {
            if (searchedCity != undefined) {
              setSelectedStep(1);
              setIsOpened(true);
            } else {
              setSelectedStep(0);
              setIsOpened(true);
            }
          }}
        >
          <p className="text-xs">When</p>
          {searchedDate != undefined ? (
            searchedDuration != undefined ? (
              <p>
                {searchedDate} - {searchedDuration} months
              </p>
            ) : (
              <p>{searchedDate}</p>
            )
          ) : (
            <p>Anytime</p>
          )}
        </button>
      </div>
      {isOpened && (
        <SearchSelection
          step={selectedStep}
          setStep={setSelectedStep}
          setIsOpened={setIsOpened}
          setSearchedCity={setSearchedCity}
          setSearchedDate={setSearchedDate}
          setSearchedDuration={setSearchedDuration}
        />
      )}
    </div>
  );
}
