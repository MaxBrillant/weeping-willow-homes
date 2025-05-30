"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PropertyFormSchema } from "@/validation/newHomeValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import OptionContainer from "../components/optionContainer";
import { useEffect, useState } from "react";
import getHomeInformationDefaultValues from "@/api/defaultValues/homeInformation";
import { createOrUpdateHome } from "@/api/mutations/homeInformationMutations";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Loading from "../loading";

type schema = z.infer<typeof PropertyFormSchema>;

type formProps = {
  submitFunctions: (() => void | undefined)[];
  homeId: number | null;
};
type defaultValuesType = {
  id: number;
  title: string;
  typeOfProperty:
    | "penthouse"
    | "townhouse"
    | "condominium"
    | "bungalow"
    | "apartment";
  description: string;
  propertySize: number | undefined;
};

export default function HomeInformationForm(form: formProps) {
  const [defaultValues, setDefaultValues] = useState<
    defaultValuesType | undefined
  >();
  const [selectedType, setSelectedType] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<schema>({
    resolver: zodResolver(PropertyFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const getDefaultValues = async () => {
      if (form.homeId) {
        setIsLoading(true);
        const values = await getHomeInformationDefaultValues(form.homeId);
        if (values) {
          setDefaultValues({
            id: values.id,
            title: values?.title,
            typeOfProperty: values?.typeOfProperty,
            description: values?.description,
            propertySize: values?.propertySize
              ? values.propertySize
              : undefined,
          });

          const homeTypes = [
            "penthouse",
            "townhouse",
            "condominium",
            "bungalow",
            "apartment",
          ];
          setSelectedType([
            homeTypes.indexOf(
              homeTypes.filter((type) => type === values.typeOfProperty)[0]
            ),
          ]);
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
    if (selectedType.length > 0) {
      const homeTypes = [
        "penthouse",
        "townhouse",
        "condominium",
        "bungalow",
        "apartment",
      ];
      setValue(
        "typeOfProperty",
        homeTypes.filter((type, index) => index === selectedType[0])[0] as
          | "penthouse"
          | "townhouse"
          | "condominium"
          | "bungalow"
          | "apartment"
      );
    }
  }, [selectedType]);

  const onSubmit = async (formData: schema) => {
    setIsSubmitting(true);
    if (defaultValues == undefined) {
      const homeId = await createOrUpdateHome({
        id: null,
        title: formData.title,
        typeOfProperty: formData.typeOfProperty,
        description: formData.description,
        propertySize:
          formData.propertySize != undefined ? formData.propertySize : null,
      });
      push("/become-a-host/" + homeId + "?step=1");
    } else {
      await createOrUpdateHome({
        id: defaultValues.id,
        title: formData.title,
        typeOfProperty: formData.typeOfProperty,
        description: formData.description,
        propertySize:
          formData.propertySize != undefined ? formData.propertySize : null,
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
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Title</p>
        <p className="font-normal text-sm">
          Give a descriptive and catchy title that summarizes the property.
        </p>
        <Input
          {...register("title")}
          defaultValue={defaultValues?.title}
          placeholder="Luxurious 4 bedroom apartment"
        />
        <p
          className={
            watch("title")?.length > 50 ? "text-red-500 font-semibold" : ""
          }
        >
          {watch("title") ? watch("title").length : 0}/{50}
        </p>
        {errors.title && (
          <p className="text-red-500 font-semibold">{errors.title.message}</p>
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Type of property</p>
        <p className="font-normal text-sm">
          {`Choose the option that best describes your property, whether it's a
          standalone house or an apartment within a building.`}
        </p>
        <OptionContainer
          options={[
            "Penthouse",
            "Townhouse",
            "Condominium",
            "Bungalow",
            "Apartment",
          ]}
          multipleSelectionEnabled={false}
          selectedOptions={selectedType}
          setSelectedOptions={setSelectedType}
          minSelections={1}
          {...register("typeOfProperty")}
        />
        {errors.typeOfProperty && (
          <p className="text-red-500 font-semibold">
            {errors.typeOfProperty.message}
          </p>
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Description</p>
        <p className="font-normal text-sm">
          Provide a detailed description of the property, its unique features,
          and any special offerings.
        </p>
        <Textarea
          {...register("description")}
          defaultValue={defaultValues?.description}
          placeholder="This place offers a unique view of the city and its spendid mountains"
        />
        <p
          className={
            watch("description")?.length > 500
              ? "text-red-500 font-semibold"
              : ""
          }
        >
          {watch("description") ? watch("description").length : 0}/{500}
        </p>
        {errors.description && (
          <p className="text-red-500 font-semibold">
            {errors.description.message}
          </p>
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Property size (optional)</p>
        <p className="font-normal text-sm">
          Help us understand how your property measures.
        </p>
        <Input
          type="number"
          {...register("propertySize", {
            setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
          })}
          defaultValue={defaultValues?.propertySize}
          placeholder="Your property's size in square meters"
        />
        {errors.propertySize && (
          <p className="text-red-500 font-semibold">
            {errors.propertySize.message}
          </p>
        )}
      </div>
      <div className="w-full flex flex-row gap-3 justify-end p-3">
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
