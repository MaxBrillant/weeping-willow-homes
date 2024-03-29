"use client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dispatch, SetStateAction, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import OptionContainer from "./optionContainer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function FilterSelection() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Filters</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[500px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>
            Make your search more specific by using filters
          </DialogDescription>
        </DialogHeader>
        <FilterContent setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

type filterContentProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};
function FilterContent(filterContent: filterContentProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  let currencies = [
    { id: 0, name: "US Dollars" },
    { id: 1, name: "Kenyan Shillings" },
  ];

  const [selectedCurrency, setSelectedCurrency] = useState(
    searchParams.get("currency")?.toString() != undefined
      ? //TODO: Validate with Zod
        [
          currencies.filter(
            (currency) =>
              currency.name === searchParams.get("currency")?.toString()
          )[0].id,
        ]
      : []
  );
  const [priceRange, setPriceRange] = useState(
    searchParams.get("min-price")?.toString() != undefined
      ? //TODO: Validate with Zod
        [
          Number(searchParams.get("min-price")?.toString()),
          Number(searchParams.get("max-price")?.toString()),
        ]
      : [70000, 120000]
  );
  const [numberOfGuests, setNumberOfGuests] = useState(
    searchParams.get("guests")?.toString() != undefined
      ? //TODO: Validate with Zod
        [Number(searchParams.get("guests")?.toString()) - 1]
      : []
  );
  const [numberOfBedrooms, setNumberOfBedrooms] = useState(
    searchParams.get("bedrooms")?.toString() != undefined
      ? //TODO: Validate with Zod
        [Number(searchParams.get("bedrooms")?.toString()) - 1]
      : []
  );
  const [numberOfBeds, setNumberOfBeds] = useState(
    searchParams.get("beds")?.toString() != undefined
      ? //TODO: Validate with Zod
        [Number(searchParams.get("beds")?.toString()) - 1]
      : []
  );
  const [numberOfPrivateBathrooms, setNumberOfPrivateBathrooms] = useState(
    searchParams.get("private-bathrooms")?.toString() != undefined
      ? //TODO: Validate with Zod
        [Number(searchParams.get("private-bathrooms")?.toString()) - 1]
      : []
  );
  const [numberOfSharedBathrooms, setNumberOfSharedBathrooms] = useState(
    searchParams.get("shared-bathrooms")?.toString() != undefined
      ? //TODO: Validate with Zod
        [Number(searchParams.get("shared-bathrooms")?.toString()) - 1]
      : []
  );

  return (
    <div className="flex flex-col gap-10 p-7">
      <div>
        <p>Currency</p>
        <div className="flex flex-row gap-1">
          <OptionContainer
            options={currencies.map((currency) => currency.name)}
            multipleSelectionEnabled={false}
            selectedOptions={selectedCurrency}
            setSelectedOptions={setSelectedCurrency}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <p className="font-semibold text-lg">Price Range</p>
        <Slider
          defaultValue={[priceRange[0], priceRange[1]]}
          max={150000}
          min={20000}
          step={10000}
          onValueChange={(newValue) => {
            setPriceRange([newValue[0], newValue[1]]);
          }}
        />
        <div className="flex justify-center flex-row gap-14">
          <div className="flex flex-col items-center">
            <p>Minimum</p>
            <p className="font-extrabold text-3xl">{priceRange[0]}</p>
          </div>
          <div className="flex flex-col items-center">
            <p>Maximum</p>
            <p className="font-extrabold text-3xl">{priceRange[1]}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-start">
          <p>Guests</p>
          <OptionContainer
            options={[1, 2, 3, 4, 5, 6, 7]}
            multipleSelectionEnabled={false}
            selectedOptions={numberOfGuests}
            setSelectedOptions={setNumberOfGuests}
          />
        </div>
        <div className="flex flex-col items-start">
          <p>Bedrooms</p>
          <OptionContainer
            options={[1, 2, 3, 4, 5, 6, 7]}
            multipleSelectionEnabled={false}
            selectedOptions={numberOfBedrooms}
            setSelectedOptions={setNumberOfBedrooms}
          />
        </div>
        <div className="flex flex-col items-start">
          <p>Beds</p>
          <OptionContainer
            options={[1, 2, 3, 4, 5, 6, 7]}
            multipleSelectionEnabled={false}
            selectedOptions={numberOfBeds}
            setSelectedOptions={setNumberOfBeds}
          />
        </div>
        <div className="flex flex-col items-start">
          <p>Private bathrooms</p>
          <OptionContainer
            options={[1, 2, 3, 4, 5]}
            multipleSelectionEnabled={false}
            selectedOptions={numberOfPrivateBathrooms}
            setSelectedOptions={setNumberOfPrivateBathrooms}
          />
        </div>
        <div className="flex flex-col items-start">
          <p>Shared Bathrooms</p>
          <OptionContainer
            options={[1, 2, 3, 4, 5]}
            multipleSelectionEnabled={false}
            selectedOptions={numberOfSharedBathrooms}
            setSelectedOptions={setNumberOfSharedBathrooms}
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          onClick={() => {
            filterContent.setOpen(false);

            const params = new URLSearchParams(searchParams);
            params.delete("currency");
            params.delete("min-price");
            params.delete("max-price");
            params.delete("guests");
            params.delete("bedrooms");
            params.delete("beds");
            params.delete("private-bathrooms");
            params.delete("shared-bathrooms");

            if (selectedCurrency.length > 0) {
              params.set("currency", currencies[selectedCurrency[0]].name);
            }
            params.set("min-price", priceRange[0].toString());
            params.set("max-price", priceRange[1].toString());
            if (numberOfGuests.length > 0) {
              params.set("guests", (numberOfGuests[0] + 1).toString());
            }
            if (numberOfBedrooms.length > 0) {
              params.set("bedrooms", (numberOfBedrooms[0] + 1).toString());
            }
            if (numberOfBeds.length > 0) {
              params.set("beds", (numberOfBeds[0] + 1).toString());
            }
            if (numberOfPrivateBathrooms.length > 0) {
              params.set(
                "private-bathrooms",
                (numberOfPrivateBathrooms[0] + 1).toString()
              );
            }
            if (numberOfSharedBathrooms.length > 0) {
              params.set(
                "shared-bathrooms",
                (numberOfSharedBathrooms[0] + 1).toString()
              );
            }
            replace(`${pathname}?${params.toString()}`);
          }}
        >
          Apply Filters
        </Button>
      </DialogFooter>
    </div>
  );
}
