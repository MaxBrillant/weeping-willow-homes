"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

export default function BackButton(props: { goTo?: string }) {
  const router = useRouter();
  return (
    <Button
      variant={"ghost"}
      onClick={
        props.goTo != undefined
          ? () => router.push(props.goTo as string)
          : router.back
      }
    >
      <IoIosArrowBack />
      Back
    </Button>
  );
}
