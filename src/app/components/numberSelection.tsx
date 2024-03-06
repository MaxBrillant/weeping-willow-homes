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
        variant={"outline"}
        disabled={value <= number.min}
        size={"icon"}
        onClick={(e) => {
          e.preventDefault();
          setValue(value - 1);
          number.setValueMethods.map((method) => method(value - 1));
        }}
      >
        -
      </Button>
      <p>{number.value}</p>
      <Button
        variant={"outline"}
        disabled={value >= number.max}
        size={"icon"}
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
