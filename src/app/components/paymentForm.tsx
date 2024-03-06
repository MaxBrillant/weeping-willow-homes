"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { PaystackButton } from "react-paystack";

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
const config = {
  reference: new Date().getTime().toString(),
  email: "ndashimax37@gmail.com",
  amount: 2000,
  publicKey: PAYSTACK_PUBLIC_KEY as string,
  currency: "kes",
  plan: "PLN_bf3rsvn1pocofuc",
};

export default function PaymentForm() {
  // you can call this function anything
  const handlePaystackSuccessAction = (reference: string) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
  };

  // you can call this function anything
  const handlePaystackCloseAction = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log("closed");
  };

  const componentProps = {
    ...config,
    text: "Go to payment page",
    onSuccess: (reference: string) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  return (
    <Button size={"lg"} asChild>
      <PaystackButton {...componentProps} />
    </Button>
  );
}
