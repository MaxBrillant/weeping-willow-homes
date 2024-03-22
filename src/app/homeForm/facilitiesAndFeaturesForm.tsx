"use client";

import { FacilitiesAndFeaturesFormSchema } from "@/validation/newHomeValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OptionContainer from "../components/optionContainer";
import { Button } from "@/components/ui/button";
import getFacilitiesAndFeaturesDefaultValues from "@/api/defaultValues/facilitiesAndFeaturesForm";
import { addOrUpdateFacilitiesAndFeatures } from "@/api/mutations/facilitiesAndFeaturesMutations";

type schema = z.infer<typeof FacilitiesAndFeaturesFormSchema>;

type formProps = {
  backFunctions: (() => void | undefined)[];
  submitFunctions: (() => void | undefined)[];
  homeId: number | null;
};
type facilitiesType = {
  id: string;
  title: string;
  iconUrl: string;
  description: string | null;
  type: "facility" | "safety" | "feature";
};
type defaultValuesType = {
  selectedIds: string[];
};
export default function FacilitiesAndFeaturesForm(form: formProps) {
  const [defaultValues, setDefaultValues] = useState<
    defaultValuesType | undefined
  >({ selectedIds: [] });
  const {
    handleSubmit,
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

  const [facilitiesList, setFacilitiesList] = useState<facilitiesType[]>([]);
  const [safetyFacilitiesList, setSafetyFacilitiesList] = useState<
    facilitiesType[]
  >([]);
  const [featuresList, setFeaturesList] = useState<facilitiesType[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getDefaultValues = async () => {
      if (form.homeId) {
        setIsLoading(true);
        const values = await getFacilitiesAndFeaturesDefaultValues(form.homeId);
        if (values) {
          setDefaultValues({
            selectedIds: values
              .filter((value) => value.homeFacilityAndFeatureId !== null)
              .map((value) => value.id as string),
          });
          setFacilitiesList(
            values.filter((facility) => facility.type === "facility")
          );
          setSafetyFacilitiesList(
            values.filter((facility) => facility.type === "safety")
          );
          setFeaturesList(
            values.filter((facility) => facility.type === "feature")
          );

          setSelectedFacilities(
            values.reduce((acc, facility, index) => {
              if (
                facility.type === "facility" &&
                facility.homeFacilityAndFeatureId
              ) {
                acc.push(index);
              }
              return acc;
            }, [] as number[])
          );
          setSelectedSafetyFacilities(
            values.reduce((acc, facility, index) => {
              if (
                facility.type === "safety" &&
                facility.homeFacilityAndFeatureId
              ) {
                acc.push(
                  index -
                    values.filter((facility) => facility.type === "facility")
                      .length
                );
              }
              return acc;
            }, [] as number[])
          );
          setSelectedFeatures(
            values.reduce((acc, facility, index) => {
              if (
                facility.type === "feature" &&
                facility.homeFacilityAndFeatureId
              ) {
                acc.push(
                  index -
                    values.filter((facility) => facility.type === "facility")
                      .length -
                    values.filter((facility) => facility.type === "safety")
                      .length
                );
              }
              return acc;
            }, [] as number[])
          );
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
    if (facilitiesList.length > 0) {
      const selectedIds = selectedFacilities.map(
        (index) => facilitiesList[index].id
      );
      setValue("facilities", selectedIds);
    }
  }, [selectedFacilities]);

  useEffect(() => {
    if (safetyFacilitiesList.length > 0) {
      const selectedIds = selectedSafetyFacilities.map(
        (index) => safetyFacilitiesList[index].id
      );
      setValue("safetyAndSecurity", selectedIds);
    }
  }, [selectedSafetyFacilities]);

  useEffect(() => {
    if (featuresList.length > 0) {
      const selectedIds = selectedFeatures.map(
        (index) => featuresList[index].id
      );
      setValue("features", selectedIds);
    }
  }, [selectedFeatures]);

  const onSubmit = async (data: schema) => {
    setIsSubmitting(true);
    const allFacilities = data.facilities.concat(
      data.safetyAndSecurity,
      data.features
    );
    if (defaultValues != undefined) {
      const newFacilities = allFacilities.filter(
        (facility) => !defaultValues?.selectedIds.includes(facility)
      );
      const faciltiesToDelete = defaultValues.selectedIds.filter(
        (id) => !allFacilities.includes(id)
      );
      await addOrUpdateFacilitiesAndFeatures({
        homeId: form.homeId as number,
        newFacilities: newFacilities,
        facilitiesToDelete: faciltiesToDelete,
      });
    } else {
      await addOrUpdateFacilitiesAndFeatures({
        homeId: form.homeId as number,
        newFacilities: allFacilities,
        facilitiesToDelete: [],
      });
    }

    form.submitFunctions.map((submitFunction: () => void) => {
      submitFunction();
    });
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

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
          selectedOptions={selectedFacilities}
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
          selectedOptions={selectedSafetyFacilities}
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
          selectedOptions={selectedFeatures}
          setSelectedOptions={setSelectedFeatures}
        />
        {errors.features && (
          <p className="text-red-500 font-semibold">
            {errors.features.message}
          </p>
        )}
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
    </form>
  );
}
