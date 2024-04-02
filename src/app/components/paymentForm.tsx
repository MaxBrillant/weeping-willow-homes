"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { PaystackButton } from "react-paystack";
import axios from "axios";

const PAYSTACK_PUBLIC_KEY = process.env
  .NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string;

export default function PaymentForm() {
  const handlePaystackSuccessAction = async (reference: string) => {
    console.log(reference);
    // Create a plan
    const plan = await createPlan();
    if (plan) {
      // Create a subscription using the plan code
      const subscription = await createSubscription(
        plan.data.plan_code,
        "ndashimax37@gmail.com"
      );
      console.log(subscription);
    }
  };

  const handlePaystackCloseAction = () => {
    console.log("closed");
  };

  const componentProps = {
    text: "Go to payment page",
    onSuccess: (reference: string) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
    publicKey: PAYSTACK_PUBLIC_KEY, // Add your Paystack public key here
    email: "ndashimax37@gmail.com", // Add the customer's email here
    amount: 1, // Add the amount to be charged here
    currency: "USD",
  };

  return (
    <Button size={"lg"} asChild>
      <PaystackButton {...componentProps} />
    </Button>
  );
}

async function createPlan() {
  const planDetails = {
    name: "Your Plan Name",
    interval: "daily",
    amount: 2000,
    currency: "NGN",
  };

  try {
    const response = await axios.post(
      "https://api.paystack.co/plan",
      planDetails,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_PUBLIC_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function createSubscription(planCode: string, customerEmail: string) {
  const subscriptionDetails = {
    customer: customerEmail,
    plan: planCode,
  };

  try {
    const response = await axios.post(
      "https://api.paystack.co/subscription",
      subscriptionDetails,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_PUBLIC_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
