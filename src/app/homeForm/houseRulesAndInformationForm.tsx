"use client";

import {
  HouseRulesAndInformationFormSchema,
  hours,
} from "@/validation/newHomeValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OptionContainer from "../components/optionContainer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import getHouseRulesAndInformationDefaultValues from "@/api/defaultValues/houseRulesAndInformationForm";
import { addOrUpdateHouseRulesAndInformation } from "@/api/mutations/houseRulesAndInformationMutations";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import Loading from "../loading";

type schema = z.infer<typeof HouseRulesAndInformationFormSchema>;
type hoursType = z.infer<typeof hours>;

type formProps = {
  backFunctions: (() => void | undefined)[];
  submitFunctions: (() => void | undefined)[];
  homeId: number | null;
  saveAndExit?: boolean;
};
type defaultValuesType = {
  houseRulesAndInformationId: number;
  additionalRules: string | null;
  houseInformation: string | null;
};

export default function HouseRulesAndInformation(form: formProps) {
  const [defaultValues, setDefaultValues] = useState<
    defaultValuesType | undefined
  >();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<schema>({
    resolver: zodResolver(HouseRulesAndInformationFormSchema),
    mode: "onChange",
  });

  const [selectedOptionForEvents, setSelectedOptionForEvents] = useState<
    number[]
  >([]);
  const [selectedOptionForPets, setSelectedOptionForPets] = useState<number[]>(
    []
  );
  const [selectedOptionForSmoking, setSelectedOptionForSmoking] = useState<
    number[]
  >([]);

  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getDefaultValues = async () => {
      if (form.homeId) {
        setIsLoading(true);
        const values = await getHouseRulesAndInformationDefaultValues(
          form.homeId
        );
        if (values) {
          setDefaultValues({
            houseRulesAndInformationId: values.houseRulesAndInformationId,
            additionalRules: values.additionalRules,
            houseInformation: values.houseInformation,
          });

          setValue(
            "startOfQuietHours",
            values.startOfQuietHours != undefined
              ? (values.startOfQuietHours as hoursType)
              : undefined
          );
          setValue(
            "endOfQuietHours",
            values.endOfQuietHours != undefined
              ? (values.endOfQuietHours as hoursType)
              : undefined
          );

          if (values.eventsAllowed === true) {
            setSelectedOptionForEvents([0]);
          } else if (values.eventsAllowed === false) {
            setSelectedOptionForEvents([1]);
          }

          if (values.petsAllowed === true) {
            setSelectedOptionForPets([0]);
          } else if (values.petsAllowed === false) {
            setSelectedOptionForPets([1]);
          }

          if (values.smokingAllowed === true) {
            setSelectedOptionForSmoking([0]);
          } else if (values.smokingAllowed === false) {
            setSelectedOptionForSmoking([1]);
          }
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
    if (selectedOptionForEvents.length > 0) {
      setValue(
        "eventsAllowed",
        selectedOptionForEvents[0] === 0 ? true : false
      );
    } else {
      setValue("eventsAllowed", undefined);
    }
  }, [selectedOptionForEvents]);

  useEffect(() => {
    if (selectedOptionForPets.length > 0) {
      setValue("petsAllowed", selectedOptionForPets[0] === 0 ? true : false);
    } else {
      setValue("petsAllowed", undefined);
    }
  }, [selectedOptionForPets]);

  useEffect(() => {
    if (selectedOptionForSmoking.length > 0) {
      setValue(
        "smokingAllowed",
        selectedOptionForSmoking[0] === 0 ? true : false
      );
    } else {
      setValue("smokingAllowed", undefined);
    }
  }, [selectedOptionForSmoking]);

  const onSubmit = async (data: schema) => {
    setIsSubmitting(true);
    if (defaultValues == undefined) {
      await addOrUpdateHouseRulesAndInformation({
        houseRulesAndInformationId: null,
        homeId: form.homeId as number,
        eventsAllowed:
          data.eventsAllowed != undefined ? data.eventsAllowed : null,
        petsAllowed: data.petsAllowed != undefined ? data.petsAllowed : null,
        smokingAllowed:
          data.smokingAllowed != undefined ? data.smokingAllowed : null,
        startOfQuietHours:
          data.startOfQuietHours != undefined ? data.startOfQuietHours : null,
        endOfQuietHours:
          data.endOfQuietHours != undefined ? data.endOfQuietHours : null,
        additionalRules:
          data.additionalRules != undefined ? data.additionalRules : null,
        houseInformation:
          data.houseInformation != undefined ? data.houseInformation : null,
      });
    } else {
      await addOrUpdateHouseRulesAndInformation({
        houseRulesAndInformationId: defaultValues.houseRulesAndInformationId,
        homeId: form.homeId as number,
        eventsAllowed:
          data.eventsAllowed != undefined ? data.eventsAllowed : null,
        petsAllowed: data.petsAllowed != undefined ? data.petsAllowed : null,
        smokingAllowed:
          data.smokingAllowed != undefined ? data.smokingAllowed : null,
        startOfQuietHours:
          data.startOfQuietHours != undefined ? data.startOfQuietHours : null,
        endOfQuietHours:
          data.endOfQuietHours != undefined ? data.endOfQuietHours : null,
        additionalRules:
          data.additionalRules != undefined ? data.additionalRules : null,
        houseInformation:
          data.houseInformation != undefined ? data.houseInformation : null,
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
      <div className="flex flex-row gap-2">
        <div className="w-full space-y-3">
          <p className="font-bold text-lg">Are events / parties allowed?</p>
          <p className="font-normal text-sm">
            Specify whether guests are allowed to host events or parties in your
            property.
          </p>
          {errors.eventsAllowed && (
            <p className="text-red-500 font-semibold">
              {errors.eventsAllowed.message}
            </p>
          )}
        </div>
        <div className="flex w-40 justify-center">
          <OptionContainer
            options={["Yes", "No"]}
            multipleSelectionEnabled={false}
            selectedOptions={selectedOptionForEvents}
            setSelectedOptions={setSelectedOptionForEvents}
          />
        </div>
      </div>
      <Separator />
      <div className="flex flex-row gap-2">
        <div className="w-full space-y-3">
          <p className="font-bold text-lg">Are pets allowed?</p>
          <p className="font-normal text-sm">
            Indicate whether guests are allowed to bring pets with them during
            their stay.
          </p>
          {errors.petsAllowed && (
            <p className="text-red-500 font-semibold">
              {errors.petsAllowed.message}
            </p>
          )}
        </div>

        <div className="flex w-40 justify-center">
          <OptionContainer
            options={["Yes", "No"]}
            multipleSelectionEnabled={false}
            selectedOptions={selectedOptionForPets}
            setSelectedOptions={setSelectedOptionForPets}
          />
        </div>
      </div>
      <Separator />
      <div className="flex flex-row gap-2">
        <div className="w-full space-y-3">
          <p className="font-bold text-lg">Is smoking allowed?</p>
          <p className="font-normal text-sm">
            Clarify whether smoking is allowed within the accommodation.
          </p>
          {errors.smokingAllowed && (
            <p className="text-red-500 font-semibold">
              {errors.smokingAllowed.message}
            </p>
          )}
        </div>
        <div className="flex w-40 justify-center">
          <OptionContainer
            options={["Yes", "No"]}
            multipleSelectionEnabled={false}
            selectedOptions={selectedOptionForSmoking}
            setSelectedOptions={setSelectedOptionForSmoking}
          />
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Quiet Hours</p>
        <p className="font-normal text-sm">
          Define the specific time during which guests are expected to maintain
          quiet and refrain from loud activities. This ensures a peaceful
          environment for all guests.
        </p>
        <div className="flex flex-row gap-2 items-center">
          <p className="w-12 text-right">From</p>
          <Select
            defaultValue={watch("startOfQuietHours")}
            onValueChange={(e: hoursType | "No time set") => {
              setValue(
                "startOfQuietHours",
                e === "No time set" ? undefined : e
              );
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="No time set">No time set</SelectItem>
                {Object.values(hours.Values).map((hour, index) => {
                  return (
                    <SelectItem key={index} value={hour}>
                      {hour}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {watch("startOfQuietHours") == undefined &&
          watch("endOfQuietHours") != undefined && (
            <p className="text-red-500 font-semibold">
              Both start time and end time must be set together
            </p>
          )}

        <div className="flex flex-row gap-2 items-center">
          <p className="w-12 text-right">To</p>
          <Select
            defaultValue={watch("endOfQuietHours")}
            onValueChange={(e: hoursType | "No time set") => {
              setValue("endOfQuietHours", e === "No time set" ? undefined : e);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select end time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="No time set">No time set</SelectItem>
                {Object.values(hours.Values).map((hour, index) => {
                  return (
                    <SelectItem key={index} value={hour}>
                      {hour}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {watch("startOfQuietHours") != undefined &&
          watch("endOfQuietHours") == undefined && (
            <p className="text-red-500 font-semibold">
              Both start time and end time must be set together
            </p>
          )}
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Additional rules</p>
        <p className="font-normal text-sm">
          Use this section to outline any other rules or regulations that guests
          must adhere to during their stay. This can include rules related to
          maximum occupancy, specific behavior expectations, or any unique
          guidelines that apply to your property. Be concise and comprehensive
          in detailing these additional rules.
        </p>
        <Textarea
          {...register("additionalRules", {
            setValueAs: (v) => (v === "" ? undefined : v),
          })}
          defaultValue={
            defaultValues?.additionalRules &&
            defaultValues?.additionalRules != undefined
              ? defaultValues?.additionalRules
              : ""
          }
          placeholder="Guests are expected to respect their neighbors"
        />
        {errors.additionalRules && (
          <p className="text-red-500 font-semibold">
            {errors.additionalRules.message}
          </p>
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">House information</p>
        <p className="font-normal text-sm">
          {`Use this section to  offer valuable information such as Wi-Fi passwords or other essential details to facilitate a comfortable stay for guests. This information will be accessible exclusively to guests following their booking.`}
        </p>
        <Textarea
          defaultValue={
            defaultValues?.houseInformation &&
            defaultValues?.houseInformation != undefined
              ? defaultValues?.houseInformation
              : ""
          }
          {...register("houseInformation", {
            setValueAs: (v) => (v === "" ? undefined : v),
          })}
          placeholder="Wi-Fi password is 1234"
        />
        {errors.houseInformation && (
          <p className="text-red-500 font-semibold">
            {errors.houseInformation.message}
          </p>
        )}
      </div>
      <div className="w-full flex flex-wrap gap-3 justify-end p-3">
        {(form.saveAndExit || form.saveAndExit == undefined) && (
          <Button
            variant={"outline"}
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
        )}
        {form.backFunctions.length > 0 && (
          <Button
            variant={"link"}
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
