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

type schema = z.infer<typeof HouseRulesAndInformationFormSchema>;
type hoursType = z.infer<typeof hours>;

type formProps = {
  backFunctions: (() => void | undefined)[];
  submitFunctions: (() => void | undefined)[];
};
export default function HouseRulesAndInformation(form: formProps) {
  const {
    register,
    handleSubmit,
    setValue,
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

  useEffect(() => {
    if (selectedOptionForEvents.length > 0) {
      setValue(
        "eventsAllowed",
        selectedOptionForEvents[0] === 0 ? true : false
      );
    }
  }, [selectedOptionForEvents]);

  useEffect(() => {
    if (selectedOptionForPets.length > 0) {
      setValue("petsAllowed", selectedOptionForPets[0] === 0 ? true : false);
    }
  }, [selectedOptionForPets]);

  useEffect(() => {
    if (selectedOptionForSmoking.length > 0) {
      setValue(
        "smokingAllowed",
        selectedOptionForSmoking[0] === 0 ? true : false
      );
    }
  }, [selectedOptionForSmoking]);

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
      <div className="flex flex-row gap-2">
        <div className="w-[70%]">
          <p className="font-semibold text-lg">Are events / parties allowed?</p>
          <p>
            Specify whether guests are allowed to host events or parties in your
            property.
          </p>
          {errors.eventsAllowed && (
            <p className="text-red-500 font-semibold">
              {errors.eventsAllowed.message}
            </p>
          )}
        </div>
        <OptionContainer
          options={["Yes", "No"]}
          multipleSelectionEnabled={false}
          selectedOptions={[]}
          setSelectedOptions={setSelectedOptionForEvents}
        />
      </div>
      <div className="flex flex-row gap-2">
        <div className="w-[70%]">
          <p className="font-semibold text-lg">Are pets allowed?</p>
          <p>
            Indicate whether guests are allowed to bring pets with them during
            their stay.
          </p>
          {errors.petsAllowed && (
            <p className="text-red-500 font-semibold">
              {errors.petsAllowed.message}
            </p>
          )}
        </div>
        <OptionContainer
          options={["Yes", "No"]}
          multipleSelectionEnabled={false}
          selectedOptions={[]}
          setSelectedOptions={setSelectedOptionForPets}
        />
      </div>
      <div className="flex flex-row gap-2">
        <div className="w-[70%]">
          <p className="font-semibold text-lg">Is smoking allowed?</p>
          <p>Clarify whether smoking is allowed within the accommodation.</p>
          {errors.smokingAllowed && (
            <p className="text-red-500 font-semibold">
              {errors.smokingAllowed.message}
            </p>
          )}
        </div>
        <OptionContainer
          options={["Yes", "No"]}
          multipleSelectionEnabled={false}
          selectedOptions={[]}
          setSelectedOptions={setSelectedOptionForSmoking}
        />
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Quiet Hours</p>
        <p>
          Define the specific time during which guests are expected to maintain
          quiet and refrain from loud activities. This ensures a peaceful
          environment for all guests.
        </p>
        <Select
          onValueChange={(e: hoursType) => {
            setValue("startOfQuietHours", e);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select start time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
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
        {errors.startOfQuietHours && (
          <p className="text-red-500 font-semibold">
            {errors.startOfQuietHours.message}
          </p>
        )}
        <Select
          onValueChange={(e: hoursType) => {
            setValue("endOfQuietHours", e);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select end time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
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
        {errors.endOfQuietHours && (
          <p className="text-red-500 font-semibold">
            {errors.endOfQuietHours.message}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Additional rules</p>
        <p>
          Use this section to outline any other rules or regulations that guests
          must adhere to during their stay. This can include rules related to
          maximum occupancy, specific behavior expectations, or any unique
          guidelines that apply to your property. Be concise and comprehensive
          in detailing these additional rules.
        </p>
        <Textarea
          {...register("additionalRules")}
          placeholder="Guests are expected to respect their neighbors"
        />
        {errors.additionalRules && (
          <p className="text-red-500 font-semibold">
            {errors.additionalRules.message}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-lg">House information</p>
        <p>Bla bla bla bla bla.</p>
        <Textarea {...register("houseInformation")} placeholder="Bla la" />
        {errors.houseInformation && (
          <p className="text-red-500 font-semibold">
            {errors.houseInformation.message}
          </p>
        )}
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
        {<Button type="submit">Next</Button>}
      </div>
    </form>
  );
}
