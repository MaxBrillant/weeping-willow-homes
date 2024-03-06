"use client";

import { FeesAndFinancesFormSchema } from "@/validation/newHomeValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ref, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OptionContainer from "../components/optionContainer";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "../components/currencyInput";

type schema = z.infer<typeof FeesAndFinancesFormSchema>;

type formProps = {
  backFunctions: (() => void | undefined)[];
  submitFunctions: (() => void | undefined)[];
};
export default function FeesForm(form: formProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<schema>({
    resolver: zodResolver(FeesAndFinancesFormSchema),
    mode: "onChange",
  });

  const [selectedCurrency, setSelectedCurrency] = useState<number[]>([]);
  const [selectedBookingOption, setSelectedBookingOption] = useState<number[]>(
    []
  );

  const regularFeesInputRef = useRef<HTMLInputElement | null>(null);
  const firstTimeFeesInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (selectedCurrency.length > 0) {
      setValue("currency", selectedCurrency[0] === 0 ? "usd" : "kes");
    }
  }, [selectedCurrency]);

  useEffect(() => {
    if (selectedBookingOption.length > 0) {
      setValue(
        "bookingOption",
        selectedBookingOption[0] === 0 ? "instant" : "request"
      );
    }
  }, [selectedBookingOption]);

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
        <p className="font-semibold text-lg">Currency</p>
        <p>Select the currency in which you are charging the rental fees.</p>
        <OptionContainer
          options={["US Dollars", "Kenyan Shillings"]}
          multipleSelectionEnabled={false}
          selectedOptions={[]}
          setSelectedOptions={setSelectedCurrency}
        />
        {errors.currency && (
          <p className="text-red-500 font-semibold">
            {errors.currency.message}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Regular fees</p>
        <p>Set the standard rental rates for your accommodation.</p>
        <div className="flex flex-row gap-2 w-fit mx-auto my-7 p-2 bg-slate-300 items-center rounded-2xl ">
          <p className="font-medium text-xl">Monthly</p>
          <button
            className="flex flex-row items-center p-1 px-3 gap-1 bg-white rounded-xl"
            onClick={(e) => {
              e.preventDefault();
              if (regularFeesInputRef.current) {
                regularFeesInputRef.current.focus();
              }
            }}
          >
            <p>{selectedCurrency[0] === 0 ? "$" : "KES"}</p>
            <CurrencyInput
              ref={regularFeesInputRef}
              type="text"
              placeholder="0"
              onChange={(e) => {
                setValue("regularFees", Number(e.currentTarget.value));
              }}
            />
          </button>
        </div>
        {errors.regularFees && (
          <p className="text-red-500 font-semibold">
            {errors.regularFees.message}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-lg">First-time fees</p>
        <p>
          Outline the initial costs associated with booking your property. This
          includes any upfront fees such as a deposit, cleaning fee, or any
          other one-time charges that guests need to pay when they book your
          accommodation.
        </p>
        <button
          className="flex flex-row items-center p-5 gap-1 mx-auto"
          onClick={(e) => {
            e.preventDefault();
            if (firstTimeFeesInputRef.current) {
              firstTimeFeesInputRef.current.focus();
            }
          }}
        >
          <p>{selectedCurrency[0] === 0 ? "$" : "KES"}</p>
          <CurrencyInput
            ref={firstTimeFeesInputRef}
            type="text"
            placeholder="0"
            onChange={(e) => {
              setValue("firstTimeFees", Number(e.currentTarget.value));
            }}
          />
        </button>
        {errors.firstTimeFees && (
          <p className="text-red-500 font-semibold">
            {errors.firstTimeFees.message}
          </p>
        )}
        <p>Description (optional)</p>
        <Textarea
          {...register("firstTimeFeesDescription")}
          placeholder="Describe the included fees and other details here"
        />
        {errors.firstTimeFeesDescription && (
          <p className="text-red-500 font-semibold">
            {errors.firstTimeFeesDescription.message}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-lg">Booking option</p>
        <p>
          Define how guests can book your property. This includes options such
          as "Instant Book," which allows guests to reserve the property without
          host approval, or "Approve or Decline Booking Requests," which means
          you'll review and approve each reservation individually.
        </p>
        <OptionContainer
          options={["Instant Book", "Accept or Decline Booking Requests"]}
          multipleSelectionEnabled={false}
          selectedOptions={[]}
          setSelectedOptions={setSelectedBookingOption}
        />
        {errors.bookingOption && (
          <p className="text-red-500 font-semibold">
            {errors.bookingOption.message}
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
