"use client";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";

type numberProps = {
  value: number;
  min: number;
  max: number;
  setValueMethods: Dispatch<SetStateAction<number>>[];
};
export default function NumberSelection(number: numberProps) {
  const [value, setValue] = useState(number.value);
  return (
    <div className="flex flex-row gap-3 items-center">
      <Button
        variant={"secondary"}
        disabled={value <= number.min}
        size={"icon"}
        className="text-2xl font-medium rounded-full"
        onClick={(e) => {
          e.preventDefault();
          setValue(value - 1);
          number.setValueMethods.map((method) => method(value - 1));
        }}
      >
        -
      </Button>
      <p className="text-lg font-medium p-1">{number.value}</p>
      <Button
        variant={"secondary"}
        disabled={value >= number.max}
        size={"icon"}
        className="text-2xl font-medium rounded-full"
        onClick={(e) => {
          e.preventDefault();
          setValue(value + 1);
          number.setValueMethods.map((method) => method(value + 1));
        }}
      >
        +
      </Button>
    </div>
  );
}
