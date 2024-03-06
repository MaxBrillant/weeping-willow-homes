"use client";

import { FacilitiesAndFeaturesFormSchema } from "@/validation/newHomeValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OptionContainer from "../components/optionContainer";
import { Button } from "@/components/ui/button";
import {
  facilities,
  features,
  securityAndSafetyFacilities,
} from "@/data/facilitiesAndFeatures";

type schema = z.infer<typeof FacilitiesAndFeaturesFormSchema>;

type formProps = {
  backFunctions: (() => void | undefined)[];
  submitFunctions: (() => void | undefined)[];
};
export default function FacilitiesAndFeaturesForm(form: formProps) {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<schema>({
    resolver: zodResolver(FacilitiesAndFeaturesFormSchema),
    mode: "onChange",
  });

  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);
  const [selectedSafetyFacilities, setSelectedSafetyFacilities] = useState<
    number[]
  >([]);
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);

  const facilitiesList = facilities;
  const safetyFacilitiesList = securityAndSafetyFacilities;
  const featuresList = features;

  useEffect(() => {
    const selectedIds: string[] = selectedFacilities.map(
      (index) => facilitiesList[index].title
    );
    setValue("facilities", selectedIds);
  }, [selectedFacilities]);

  useEffect(() => {
    const selectedIds: string[] = selectedSafetyFacilities.map(
      (index) => safetyFacilitiesList[index].title
    );
    setValue("safetyAndSecurity", selectedIds);
  }, [selectedSafetyFacilities]);

  useEffect(() => {
    const selectedIds: string[] = selectedFeatures.map(
      (index) => featuresList[index].title
    );
    setValue("features", selectedIds);
  }, [selectedFeatures]);

  const onSubmit = (data: schema) => {
    //RANK FACILITIES BY QUALITY
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
        <p className="font-semibold text-lg">Facilities</p>
        <p>
          Highlight the facilities and benefits that guests will enjoy during
          their stay. Those are the conveniences and features that make your
          property comfortable and attractive.
        </p>
        <OptionContainer
          options={facilitiesList.map((facility) => facility.title)}
          multipleSelectionEnabled={true}
          selectedOptions={[]}
          setSelectedOptions={setSelectedFacilities}
        />
        {errors.facilities && (
          <p className="text-red-500 font-semibold">
            {errors.facilities.message}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Safety Facilities</p>
        <p>
          The safety and security of your guests are paramount. In this section,
          detail the safety measures and features that provide peace of mind
          during their stay.
        </p>
        <OptionContainer
          options={safetyFacilitiesList.map((facility) => facility.title)}
          multipleSelectionEnabled={true}
          selectedOptions={[]}
          setSelectedOptions={setSelectedSafetyFacilities}
        />
        {errors.safetyAndSecurity && (
          <p className="text-red-500 font-semibold">
            {errors.safetyAndSecurity.message}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Features</p>
        <p>
          Highlight two unique characteristics and qualities that make your
          accommodation special.
        </p>
        <OptionContainer
          options={featuresList.map((feature) => feature.title)}
          multipleSelectionEnabled={true}
          selectedOptions={[]}
          setSelectedOptions={setSelectedFeatures}
        />
        {errors.features && (
          <p className="text-red-500 font-semibold">
            {errors.features.message}
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
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
