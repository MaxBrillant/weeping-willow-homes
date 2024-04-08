"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { AccommodationFormSchema } from "@/validation/newHomeValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import NumberSelection from "../components/numberSelection";
import getAccommodationInformationDefaultValues from "@/api/defaultValues/accommodationInformation";
import { addOrUpdateAccommodationInformation } from "@/api/mutations/accomodationInformationMutations";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import Loading from "../loading";

type schema = z.infer<typeof AccommodationFormSchema>;

type formProps = {
  backFunctions: (() => void | undefined)[];
  submitFunctions: (() => void | undefined)[];
  homeId: number | null;
  saveAndExit?: boolean;
};

type defaultValuesType = {
  accommodationId: number;
};
export default function AccommodationForm(form: formProps) {
  const [defaultValues, setDefaultValues] = useState<
    defaultValuesType | undefined
  >();
  const {
    handleSubmit,
    setValue,
    trigger,
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { push } = useRouter();

  useEffect(() => {
    const getDefaultValues = async () => {
      if (form.homeId) {
        setIsLoading(true);
        const values = await getAccommodationInformationDefaultValues(
          form.homeId
        );
        if (values) {
          setDefaultValues({
            accommodationId: values.accommodationId,
          });
          setNumberOfGuests(values.numberOfGuests);
          setNumberOfBedrooms(values.numberOfBedrooms);
          setNumberOfBeds(values.numberOfBeds);
          setNumberOfPrivateBathrooms(values.numberOfPrivateBathrooms);
          setNumberOfSharedBathrooms(values.numberOfSharedBathrooms);
        } else {
          setDefaultValues(undefined);
        }
        setIsLoading(false);
      } else {
        setDefaultValues(undefined);
        setIsLoading(false);
      }
    };

    getDefaultValues();
  }, [form.homeId]);

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

  const onSubmit = async (data: schema) => {
    setIsSubmitting(true);
    if (defaultValues == undefined) {
      await addOrUpdateAccommodationInformation({
        accommodationId: null,
        homeId: form.homeId as number,
        guests: data.numberOfGuests,
        bedrooms: data.numberOfBedrooms,
        beds: data.numberOfBeds,
        privateBathrooms: data.numberOfPrivateBathrooms,
        sharedBathrooms: data.numberOfSharedBathrooms,
      });
    } else {
      await addOrUpdateAccommodationInformation({
        accommodationId: defaultValues.accommodationId,
        homeId: form.homeId as number,
        guests: data.numberOfGuests,
        bedrooms: data.numberOfBedrooms,
        beds: data.numberOfBeds,
        privateBathrooms: data.numberOfPrivateBathrooms,
        sharedBathrooms: data.numberOfSharedBathrooms,
      });
    }
    form.submitFunctions.map((submitFunction: () => void) => {
      submitFunction();
    });
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 p-7">
      {(form.saveAndExit || form.saveAndExit == undefined) && (
        <div className="relative mt-[-1.75rem] pb-7">
          <Button
            variant={"outline"}
            className="absolute top-3 right-0"
            disabled={isSubmitting}
            onClick={async () => {
              const isFormValid = await trigger();
              if (isFormValid) {
                setTimeout(() => {
                  push("/hosting");
                }, 100);
              }
            }}
          >
            Save & exit
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Number of guests</p>
        <p className="font-normal text-sm">
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
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Number of bedrooms</p>
        <p className="font-normal text-sm">
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
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Number of beds</p>
        <p className="font-normal text-sm">
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
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Number of bathrooms</p>
        <p className="font-normal text-sm">
          Specify the total count of bathrooms available in your accommodation.
          This includes any private and shared bathrooms.
        </p>
        <div className="w-fit flex flex-col items-center p-3 gap-2 border border-b-slate-300 rounded-xl">
          <p className="font-medium">Private bathrooms</p>
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
        <div className="w-fit flex flex-col items-center p-3 gap-2 border border-b-slate-300 rounded-xl">
          <p className="font-medium">Shared bathrooms</p>
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
        {form.backFunctions.length > 0 && (
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
        )}
        <Button type="submit" disabled={isSubmitting}>
          Save and continue
        </Button>
      </div>
      {Object.keys(errors).length > 0 && (
        <p className="text-red-500 font-medium animate-pulse mt-[-2rem] mx-auto">
          Fill out all required details to proceed
        </p>
      )}
    </form>
  );
}
