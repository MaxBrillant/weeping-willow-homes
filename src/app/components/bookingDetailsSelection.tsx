import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import NumberSelection from "./numberSelection";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";

type detailsProps = {
  date: Date | undefined;
  duration: number | undefined;
  numberOfGuests: number;
  maxGuests: number;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
  setDuration: Dispatch<SetStateAction<number | undefined>>;
  setNumberOfGuests: Dispatch<SetStateAction<number>>;
  disabledDate: Date;
};
export default function BookingDetailsSelection(booking: detailsProps) {
  const [date, setDate] = useState<Date | undefined>(booking.date);
  const [duration, setDuration] = useState<number | undefined>(
    booking.duration
  );

  const [numberOfGuests, setNumberOfGuests] = useState(booking.numberOfGuests);

  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"link"}
            className="p-0 w-fit h-fit underline text-sm sm:text-base"
          >
            {date != undefined && duration != undefined ? (
              <p>
                {date.toDateString()} - {duration} months
              </p>
            ) : (
              <p>No dates have been set</p>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[500px] overflow-auto">
          <DialogHeader>
            <DialogTitle>Stay details</DialogTitle>
          </DialogHeader>
          <EditBookingDetails
            date={date}
            duration={duration}
            setDate={setDate}
            setDuration={setDuration}
            disabledDate={booking.disabledDate}
            setOpen={setOpen}
            setRootDate={booking.setDate}
            setRootDuration={booking.setDuration}
          />
        </DialogContent>
      </Dialog>

      <div className="flex flex-row gap-3 items-center">
        <p>Guests</p>
        <NumberSelection
          value={numberOfGuests}
          min={1}
          max={booking.maxGuests}
          setValueMethods={[booking.setNumberOfGuests, setNumberOfGuests]}
        />
      </div>
    </div>
  );
}

type editDetailsProps = {
  date: Date | undefined;
  duration: number | undefined;
  disabledDate: Date;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
  setDuration: Dispatch<SetStateAction<number | undefined>>;

  setRootDate: Dispatch<SetStateAction<Date | undefined>>; //This will change the CTA's date
  setRootDuration: Dispatch<SetStateAction<number | undefined>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
function EditBookingDetails(details: editDetailsProps) {
  const [date, setDate] = useState<Date | undefined>(
    details.date != undefined ? details.date : new Date()
  );
  const [duration, setDuration] = useState<number | undefined>(
    details.duration != undefined ? details.duration : 3
  );

  return (
    <div className="flex flex-col gap-10 p-7 w-full items-center">
      <div className="flex flex-col gap-5 p-3">
        <p className="font-semibold text-lg">When do you want to start?</p>
        <Calendar
          mode="single"
          selected={date != undefined ? date : new Date()}
          defaultMonth={date != undefined ? date : new Date()}
          onSelect={setDate}
          className="rounded-md border"
          disabled={(date: Date) => date < details.disabledDate}
          onDayClick={(newDate, e) => {
            if (!e.selected) {
              setDate(
                new Date(
                  newDate.getFullYear() +
                    "-" +
                    (newDate.getMonth() + 1) +
                    "-" +
                    newDate.getDate()
                )
              );
            } else {
              setDate(undefined);
              details.setDate(undefined);
            }
          }}
        />
      </div>
      <div className="flex flex-col gap-5 p-3">
        <p className="font-semibold text-lg">How long will your stay be?</p>

        <div className="flex flex-col w-full items-center text-center">
          <p className="font-extrabold text-6xl">{duration}</p>
          <p className="text-xl">months</p>
        </div>
        <Slider
          defaultValue={duration != undefined ? [(duration * 100) / 12] : [0]}
          max={100}
          min={100 / 12}
          step={100 / 12}
          onValueChange={(newValue: number[]) => {
            setDuration(Math.round(newValue[0] * 12) / 100);
          }}
        />
      </div>
      <DialogFooter>
        <Button
          onClick={() => {
            details.setOpen(false);
            details.setDate(date);
            details.setDuration(duration);
            details.setRootDate(date);
            details.setRootDuration(duration);
          }}
          disabled={
            date == undefined ||
            duration == undefined ||
            date < details.disabledDate
          }
        >
          Continue
        </Button>
      </DialogFooter>
    </div>
  );
}
