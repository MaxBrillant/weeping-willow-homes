"use client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import BookingDetailsSelection from "./bookingDetailsSelection";
import { BookingParamsSchema } from "@/validation/paramValidation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import PaymentForm from "./paymentForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type ctaProps = {
  title: string;
  coverPhotoUrl: string;
  maxGuests: number;
  currency: "usd" | "kes";
  monthlyFee: number;
  firstTimeFee: number | null;
  firstTimeFeeDescription: string | null;
  disabledDate: Date;
};
export default function BookCta(cta: ctaProps) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  useEffect(() => {
    try {
      // Validate and parse the search parameters
      const params = BookingParamsSchema.parse({
        guests: searchParams.get("guests")
          ? Number(searchParams.get("guests"))
          : undefined,
        startDate: searchParams.get("start-date")
          ? new Date(searchParams.get("start-date") as string)
          : undefined,
        duration: searchParams.get("duration")
          ? Number(searchParams.get("duration"))
          : undefined,
      });
    } catch (error) {
      console.error("Validation failed", error);
      replace("/homes/1");
    }
  }, [searchParams]);

  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("start-date")?.toString() != undefined
      ? //TODO: Validate with Zod
        new Date(String(searchParams.get("start-date")?.toString()))
      : undefined
  );
  const [duration, setDuration] = useState<number | undefined>(
    searchParams.get("duration")?.toString() != undefined
      ? //TODO: Validate with Zod
        Number(searchParams.get("duration")?.toString())
      : undefined
  );

  const [numberOfGuests, setNumberOfGuests] = useState(
    searchParams.get("guests")?.toString() != undefined
      ? //TODO: Validate with Zod
        Number(searchParams.get("guests")?.toString())
      : 1
  );
  return (
    <div className="fixed bottom-0 z-50 w-full sm:w-64 sm:relative">
      <div className="w-full flex flex-row flex-wrap m-auto items-center gap-5 sm:flex sm:flex-col sm:gap-2 :w-64 h-fit px-5 py-3 mt-3 rounded-2xl bg-white shadow drop-shadow-2xl border border-slate-400">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-3">
            <p className="font-extrabold text-lg sm:text-2xl">
              {cta.currency.toUpperCase()} {cta.monthlyFee}
            </p>
            <p>/month</p>
          </div>
          <BookingDetailsSelection
            date={date}
            duration={duration}
            numberOfGuests={numberOfGuests}
            maxGuests={cta.maxGuests}
            setDate={setDate}
            setDuration={setDuration}
            setNumberOfGuests={setNumberOfGuests}
            disabledDate={cta.disabledDate}
          />
        </div>
        <div className="flex-grow flex flex-col">
          <BookingPage
            date={date}
            duration={duration}
            numberOfGuests={numberOfGuests}
            setDate={setDate}
            setDuration={setDuration}
            setNumberOfGuests={setNumberOfGuests}
            disabledDate={cta.disabledDate}
            title={cta.title}
            coverPhotoUrl={cta.coverPhotoUrl}
            maxGuests={cta.maxGuests}
            currency={cta.currency}
            monthlyFee={cta.monthlyFee}
            firstTimeFee={cta.firstTimeFee}
            firstTimeFeeDescription={cta.firstTimeFeeDescription}
          />
          <p className="text-sm text-center">You will not be charged yet.</p>
        </div>
      </div>
    </div>
  );
}

function BookingPage(stay: {
  date: Date | undefined;
  duration: number | undefined;
  numberOfGuests: number;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
  setDuration: Dispatch<SetStateAction<number | undefined>>;
  setNumberOfGuests: Dispatch<SetStateAction<number>>;
  disabledDate: Date;
  title: string;
  coverPhotoUrl: string;
  maxGuests: number;
  currency: "usd" | "kes";
  monthlyFee: number;
  firstTimeFee: number | null;
  firstTimeFeeDescription: string | null;
}) {
  const [open, setOpen] = useState(false);
  const { push } = useRouter();

  const handleSignedOutUser = async () => {
    const supabase = createClientComponentClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log(session);

    if (!session) {
      push(`/login?redirect-to=${location}`);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        open ? setOpen(false) : setOpen(true);
        !open && handleSignedOutUser();
      }}
    >
      <DialogTrigger asChild>
        <Button
          size={"lg"}
          disabled={
            stay.date == undefined ||
            stay.duration == undefined ||
            stay.date < stay.disabledDate
          }
        >
          Proceed to Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[500px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Confirm and book your stay</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-7 p-5">
          <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-200">
            <div className="flex flex-row  flex-wrap gap-5 p-5 bg-white rounded-2xl">
              <Image
                src={stay.coverPhotoUrl}
                alt={stay.title}
                width={70}
                height={70}
                className="h-[70px] rounded-xl"
              />
              <div className="flex flex-col gap-3">
                <p className="font-semibold text-lg">{stay.title}</p>
                <BookingDetailsSelection
                  date={stay.date}
                  duration={stay.duration}
                  numberOfGuests={stay.numberOfGuests}
                  maxGuests={stay.maxGuests}
                  setDate={stay.setDate}
                  setDuration={stay.setDuration}
                  setNumberOfGuests={stay.setNumberOfGuests}
                  disabledDate={stay.disabledDate}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-7">
            <div className="w-full flex flex-col gap-3 p-7 rounded-3xl bg-slate-200">
              <p className="font-semibold text-2xl">Price details</p>
              <div className="flex flex-col gap-3 text-sm font-medium">
                <div className="flex flex-row w-full gap-7">
                  <p className="w-full">
                    Monthly fee (paid each month on {stay.date?.toDateString()})
                    TO BE CHANGED WITH TEMPORAL API
                  </p>
                  <p className="text-nowrap font-semibold text-base">
                    {stay.currency.toUpperCase()} {stay.monthlyFee}
                  </p>
                </div>
                {stay.firstTimeFee && (
                  <div className="flex flex-row w-full gap-7">
                    <div className="w-full">
                      <p>First time fee</p>
                      {stay.firstTimeFeeDescription && (
                        <p>Description: {stay.firstTimeFeeDescription}</p>
                      )}
                    </div>
                    <p className="text-nowrap font-semibold text-base">
                      {stay.currency.toUpperCase()} {stay.firstTimeFee}
                    </p>
                  </div>
                )}
                <div className="flex flex-row w-full gap-7">
                  <p className="w-full">Monthly service fee.</p>
                  <p className="text-nowrap font-semibold text-base">
                    {stay.currency.toUpperCase()} {(stay.monthlyFee * 5) / 100}
                  </p>
                </div>
              </div>
            </div>
            <PaymentForm />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
