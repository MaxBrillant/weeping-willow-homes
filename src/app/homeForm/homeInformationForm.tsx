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

type schema = z.infer<typeof PropertyFormSchema>;

type formProps = {
  submitFunctions: (() => void | undefined)[];
};
export default function HomeInformationForm(form: formProps) {
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

  const [selectedType, setSelectedType] = useState<number[]>([]);
  useEffect(() => {
    if (selectedType.length > 0) {
      setValue("typeOfProperty", selectedType[0] === 0 ? "house" : "apartment");
    }
  }, [selectedType]);

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
        <p className="font-semibold text-lg">Title</p>
        <p>Give a descriptive and catchy title that summarizes the property.</p>
        <Input
          {...register("title")}
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
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Type of property</p>
        <p>
          Choose the option that best describes your property, whether it's a
          standalone house or an apartment within a building.
        </p>
        <OptionContainer
          options={["House", "Apartment"]}
          multipleSelectionEnabled={false}
          selectedOptions={[]}
          setSelectedOptions={setSelectedType}
          {...register("typeOfProperty")}
        />
        {errors.typeOfProperty && (
          <p className="text-red-500 font-semibold">
            {errors.typeOfProperty.message}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Description</p>
        <p>
          Provide a detailed description of the property, its unique features,
          and any special offerings.
        </p>
        <Textarea
          {...register("description")}
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
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Property size (optional)</p>
        <p>Help us understand how your property measures.</p>
        <Input
          type="number"
          {...register("size", {
            valueAsNumber: true,
          })}
          placeholder="Your property's size in square meters"
          // onChange={(e) => setValue("size", parseInt(e.target.value))}
        />
        {errors.size && (
          <p className="text-red-500 font-semibold">{errors.size.message}</p>
        )}
      </div>
      <div className="w-full flex flex-row gap-3 justify-end p-3">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
