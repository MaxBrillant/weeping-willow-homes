import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

type searchSelectionProps = {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
  setSearchedCity: Dispatch<SetStateAction<string | undefined>>;
  setSearchedDate: Dispatch<SetStateAction<string | undefined>>;
  setSearchedDuration: Dispatch<SetStateAction<number | undefined>>;
};

export default function SearchSelection(search: searchSelectionProps) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  let cities = [
    { id: 0, name: "Nairobi, Kenya", imageLink: "/nairobi.webp" },
    { id: 1, name: "Mombasa, Kenya", imageLink: "/Mombasa.webp" },
  ];

  const [selectedCity, setSelectedCity] = useState<number | undefined>(
    searchParams.get("city")?.toString() != undefined
      ? //TODO: Validate with Zod
        cities.filter(
          (city) => city.name === searchParams.get("city")?.toString()
        )[0].id
      : undefined
  );

  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("start-date")?.toString() != undefined
      ? //TODO: Validate with Zod
        new Date(String(searchParams.get("start-date")?.toString()))
      : new Date()
  );
  const [duration, setDuration] = useState<number | undefined>(
    searchParams.get("duration")?.toString() != undefined
      ? //TODO: Validate with Zod
        Number(searchParams.get("duration")?.toString())
      : undefined
  );

  {
    if (search.step === 0) {
      return (
        <div className="flex flex-col gap-5 p-3">
          <p className="font-semibold text-lg">
            Tell us where you want to stay
          </p>
          <div className="flex flex-row gap-5">
            {cities.map((city, index) =>
              selectedCity === index ? (
                <button
                  key={index}
                  className="flex flex-col items-center rounded-2xl bg-gray-300 border-4 border-gray-700 overflow-hidden"
                  onClick={() => {
                    setSelectedCity(undefined);
                    search.setSearchedCity(undefined);
                  }}
                >
                  <Image
                    className="w-28 h-24 object-cover"
                    src={city.imageLink}
                    alt={city.name}
                    width={100}
                    height={100}
                  />
                  <p className="font-medium">{city.name}</p>
                </button>
              ) : (
                <button
                  key={index}
                  className="flex flex-col items-center rounded-2xl border border-gray-500 overflow-hidden "
                  onClick={() => {
                    setSelectedCity(index);

                    search.setSearchedCity(cities[index].name);
                  }}
                >
                  <Image
                    className="w-28 h-24 object-cover"
                    src={city.imageLink}
                    alt={city.name}
                    width={100}
                    height={100}
                  />
                  <p>{city.name}</p>
                </button>
              )
            )}
          </div>
          <div className="w-full flex flex-row gap-3 justify-end">
            <Button
              onClick={() => {
                search.setStep(1);
              }}
              disabled={selectedCity == undefined}
            >
              Next
            </Button>
          </div>
        </div>
      );
    }
  }

  if (search.step === 1) {
    return (
      <div className="flex flex-col gap-5 p-3">
        <p className="font-semibold text-lg">When do you want to start?</p>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          onDayClick={(newDate, e) => {
            if (!e.selected) {
              search.setSearchedDate(
                newDate.getFullYear() +
                  "-" +
                  (newDate.getMonth() + 1) +
                  "-" +
                  newDate.getDate()
              );
            } else {
              search.setSearchedDate(undefined);
            }
          }}
        />
        <div className="w-full flex flex-row gap-3 justify-end">
          <Button
            onClick={() => {
              search.setStep(0);
            }}
            variant={"link"}
          >
            Back
          </Button>
          <Button
            onClick={() => {
              search.setStep(2);
              duration == undefined && setDuration(3);
              duration == undefined && search.setSearchedDuration(3);
            }}
            disabled={date == undefined}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }
  if (search.step === 2) {
    return (
      <div className="flex flex-col gap-5 p-3">
        <p className="font-semibold text-lg">How long will your stay be?</p>

        <div className="flex flex-col w-full items-center text-center">
          <p className="font-extrabold text-6xl">{duration}</p>
          <p className="text-xl">months</p>
        </div>
        <Slider
          defaultValue={duration != undefined ? [(duration * 100) / 12] : [0]}
          max={100}
          min={100 / 12}
          step={100 / 12}
          onValueChange={(newValue: number[]) => {
            setDuration(Math.round(newValue[0] * 12) / 100);

            search.setSearchedDuration(Math.round(newValue[0] * 12) / 100);
          }}
        />

        <div className="w-full flex flex-row gap-3 justify-end">
          <Button
            onClick={() => {
              search.setStep(1);
            }}
            variant={"link"}
          >
            Back
          </Button>
          <Button
            onClick={() => {
              if (selectedCity != undefined) {
                const params = new URLSearchParams(searchParams);
                params.delete("city");
                params.delete("start-date");
                params.delete("duration");
                if (selectedCity != undefined) {
                  params.set("city", cities[selectedCity].name);
                }
                if (date != undefined) {
                  let dateString =
                    date.getFullYear() +
                    "-" +
                    (date.getMonth() + 1) +
                    "-" +
                    date.getDate();
                  params.set("start-date", dateString);
                }
                if (duration != undefined) {
                  params.set("duration", duration.toString());
                }
                replace(`/search?${params.toString()}`);
                search.setIsOpened(false);
              } else {
                search.setStep(0);
              }
            }}
          >
            Search for homes
          </Button>
        </div>
      </div>
    );
  }
}
