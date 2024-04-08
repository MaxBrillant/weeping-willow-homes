"use client";

import { FeesAndFinancesFormSchema } from "@/validation/newHomeValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OptionContainer from "../components/optionContainer";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "../components/currencyInput";
import getFeesDefaultValues from "@/api/defaultValues/feesForm";
import { addOrUpdateFeesInformation } from "@/api/mutations/feesFormMutations";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import Loading from "../loading";

type schema = z.infer<typeof FeesAndFinancesFormSchema>;

type formProps = {
  backFunctions: (() => void | undefined)[];
  submitFunctions: (() => void | undefined)[];
  homeId: number | null;
  saveAndExit?: boolean;
};

type defaultValuesType = {
  feesId: number;
  firstTimeFeeDescription: string | null;
};
export default function FeesForm(form: formProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<schema>({
    resolver: zodResolver(FeesAndFinancesFormSchema),
    mode: "onChange",
  });

  const [defaultValues, setDefaultValues] = useState<
    defaultValuesType | undefined
  >();
  const [selectedCurrency, setSelectedCurrency] = useState<number[]>([]);
  const [selectedBookingOption, setSelectedBookingOption] = useState<number[]>(
    []
  );

  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const regularFeesInputRef = useRef<HTMLInputElement | null>(null);
  const firstTimeFeesInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const getDefaultValues = async () => {
      if (form.homeId) {
        setIsLoading(true);
        const values = await getFeesDefaultValues(form.homeId);
        if (values) {
          setDefaultValues({
            feesId: values.feesId,
            firstTimeFeeDescription: values.firstTimeFeeDescription,
          });

          setValue("monthlyFees", values.monthlyFee);
          if (values.firstTimeFee) {
            setValue("firstTimeFees", values.firstTimeFee);
          }

          if (values.currency === "usd") {
            setSelectedCurrency([0]);
          } else if (values?.currency === "kes") {
            setSelectedCurrency([1]);
          }

          if (values.bookingOption === "instant") {
            setSelectedBookingOption([0]);
          } else if (values?.bookingOption === "request") {
            setSelectedBookingOption([1]);
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

  const onSubmit = async (data: schema) => {
    setIsSubmitting(true);
    if (defaultValues == undefined) {
      await addOrUpdateFeesInformation({
        feesId: null,
        homeId: form.homeId as number,
        currency: data.currency,
        monthlyFees: data.monthlyFees,
        firstTimeFees:
          data.firstTimeFees != undefined ? data.firstTimeFees : null,
        firstTimeFeesDescription:
          data.firstTimeFeesDescription != undefined
            ? data.firstTimeFeesDescription
            : null,
        bookingOption: data.bookingOption,
      });
    } else {
      await addOrUpdateFeesInformation({
        feesId: defaultValues.feesId,
        homeId: form.homeId as number,
        currency: data.currency,
        monthlyFees: data.monthlyFees,
        firstTimeFees:
          data.firstTimeFees != undefined ? data.firstTimeFees : null,
        firstTimeFeesDescription:
          data.firstTimeFeesDescription != undefined
            ? data.firstTimeFeesDescription
            : null,
        bookingOption: data.bookingOption,
      });
    }

    form.submitFunctions.map((submitFunction: () => void) => {
      submitFunction();
    });
    setIsSubmitting(false);
  };

  {
    if (isLoading) {
      return <Loading />;
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 p-7">
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Currency</p>
        <p className="font-normal text-sm">
          Select the currency in which you are charging the rental fees.
        </p>
        <OptionContainer
          options={["US Dollars", "Kenyan Shillings"]}
          multipleSelectionEnabled={false}
          selectedOptions={selectedCurrency}
          setSelectedOptions={setSelectedCurrency}
          minSelections={1}
        />
        {errors.currency && (
          <p className="text-red-500 font-semibold">
            {errors.currency.message}
          </p>
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Monthly Rental Fee</p>
        <p className="font-normal text-sm">
          Set the standard rental rates for your accommodation.
        </p>

        <button
          className="flex flex-row items-center p-2 my-7 gap-1 mx-auto"
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
            defaultValue={watch("monthlyFees")}
            onInput={(e) => {
              setValue(
                "monthlyFees",
                Number(
                  e.currentTarget.value
                    .replaceAll(",", "")
                    .replaceAll(/[^0-9,]/g, "")
                )
              );
            }}
          />
        </button>
        {errors.monthlyFees && (
          <p className="text-red-500 font-semibold">
            {errors.monthlyFees.message}
          </p>
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Initial Setup Fee (optional)</p>
        <p className="font-normal text-sm">
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
            defaultValue={
              watch("firstTimeFees") != undefined ? watch("firstTimeFees") : ""
            }
            ref={firstTimeFeesInputRef}
            onInput={(e) => {
              setValue(
                "firstTimeFees",
                e.currentTarget.value != ""
                  ? Number(
                      e.currentTarget.value
                        .replaceAll(",", "")
                        .replaceAll(/[^0-9,]/g, "")
                    )
                  : undefined
              );
            }}
          />
        </button>
        {errors.firstTimeFees && (
          <p className="text-red-500 font-semibold">
            {errors.firstTimeFees.message}
          </p>
        )}
        {watch("firstTimeFees") != undefined && (
          <Textarea
            {...register("firstTimeFeesDescription", {
              setValueAs: (v) => (v === "" ? undefined : v),
            })}
            defaultValue={
              defaultValues?.firstTimeFeeDescription
                ? defaultValues?.firstTimeFeeDescription
                : ""
            }
            placeholder="Describe the included fees and other details here"
          />
        )}
        {watch("firstTimeFees") != undefined &&
          errors.firstTimeFeesDescription && (
            <p className="text-red-500 font-semibold">
              {errors.firstTimeFeesDescription.message}
            </p>
          )}
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lg">Booking option</p>
        <p className="font-normal text-sm">
          {`Define how guests can book your property. This includes options such
          as "Instant Book," which allows guests to reserve the property without
          host approval, or "Approve or Decline Booking Requests," which means
          you'll review and approve each reservation individually.`}
        </p>
        <OptionContainer
          options={["Instant Book", "Accept or Decline Booking Requests"]}
          multipleSelectionEnabled={false}
          selectedOptions={selectedBookingOption}
          setSelectedOptions={setSelectedBookingOption}
          minSelections={1}
        />
        {errors.bookingOption && (
          <p className="text-red-500 font-semibold">
            {errors.bookingOption.message}
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
