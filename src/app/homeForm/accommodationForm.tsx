"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { AccommodationFormSchema } from "@/validation/newHomeValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import NumberSelection from "../components/numberSelection";

type schema = z.infer<typeof AccommodationFormSchema>;

type formProps = {
  backFunctions: (() => void | undefined)[];
  submitFunctions: (() => void | undefined)[];
};
export default function AccommodationForm(form: formProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<schema>({
    resolver: zodResolver(AccommodationFormSchema),
    mode: "onSubmit",
  });

  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [numberOfBedrooms, setNumberOfBedrooms] = useState<number>(1);
  const [numberOfBeds, setNumberOfBeds] = useState<number>(1);
  const [numberOfPrivateBathrooms, setNumberOfPrivateBathrooms] =
    useState<number>(1);
  const [numberOfSharedBathrooms, setNumberOfSharedBathrooms] =
    useState<number>(1);

  useEffect(() => {
    setValue("numberOfGuests", numberOfGuests);
  }),
    [numberOfGuests];

  useEffect(() => {
    setValue("numberOfBedrooms", numberOfBedrooms);
  }),
    [numberOfBedrooms];
  useEffect(() => {
    setValue("numberOfBeds", numberOfBeds);
  }),
    [numberOfBeds];
  useEffect(() => {
    setValue("numberOfPrivateBathrooms", numberOfPrivateBathrooms);
  }),
    [numberOfPrivateBathrooms];
  useEffect(() => {
    setValue("numberOfSharedBathrooms", numberOfSharedBathrooms);
  }),
    [numberOfSharedBathrooms];

  const onSubmit = (data: schema) => {
    console.log(data);
    form.submitFunctions.map((submitFunction: () => void) => {
      submitFunction();
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-10 p-5"
    >
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Number of guests</p>
        <p>
          Specify the maximum number of guests or guests your accommodation can
          comfortably accommodate.
        </p>
        <NumberSelection
          value={numberOfGuests}
          min={1}
          max={7}
          setValueMethods={[setNumberOfGuests]}
        />
        {errors.numberOfGuests && (
          <p className="text-red-500 font-semibold">
            {errors.numberOfGuests.message}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Number of bedrooms</p>
        <p>
          Indicate the total number of separate bedrooms available within your
          accommodation. Bedrooms are private sleeping spaces.
        </p>
        <NumberSelection
          value={numberOfBedrooms}
          min={1}
          max={7}
          setValueMethods={[setNumberOfBedrooms]}
        />
        {errors.numberOfBedrooms && (
          <p className="text-red-500 font-semibold">
            {errors.numberOfBedrooms.message}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Number of beds</p>
        <p>
          Specify the total number of beds within the accommodation. This
          includes all types of beds, such as single beds, double beds, and sofa
          beds.
        </p>
        <NumberSelection
          value={numberOfBeds}
          min={1}
          max={7}
          setValueMethods={[setNumberOfBeds]}
        />
        {errors.numberOfBeds && (
          <p className="text-red-500 font-semibold">
            {errors.numberOfBeds.message}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Number of bathrooms</p>
        <p>
          Specify the total count of bathrooms available in your accommodation.
          This includes any private and shared bathrooms.
        </p>
        <div className="w-fit flex flex-col items-center p-3">
          <p>Private bathrooms</p>
          <NumberSelection
            value={numberOfPrivateBathrooms}
            min={0}
            max={5}
            setValueMethods={[setNumberOfPrivateBathrooms]}
          />
          {errors.numberOfPrivateBathrooms && (
            <p className="text-red-500 font-semibold">
              {errors.numberOfPrivateBathrooms.message}
            </p>
          )}
        </div>
        <div className="w-fit flex flex-col items-center p-3">
          <p>Shared bathrooms</p>
          <NumberSelection
            value={numberOfSharedBathrooms}
            min={1}
            max={5}
            setValueMethods={[setNumberOfSharedBathrooms]}
          />
          {errors.numberOfSharedBathrooms && (
            <p className="text-red-500 font-semibold">
              {errors.numberOfSharedBathrooms.message}
            </p>
          )}
        </div>
      </div>
      <div className="w-full flex flex-row gap-3 justify-end p-3">
        <Button
          variant={"outline"}
          onClick={() =>
            form.backFunctions.map((backFunction: () => void) => {
              backFunction();
            })
          }
        >
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
